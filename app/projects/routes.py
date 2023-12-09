import re
from app.models.chat_message import ChatMessage
from app.models.constants import AssistantModel, CSSFramework
from app.models.project import Project
from app.models.project_state import ProjectState
from flask import request, jsonify
from flask_login import current_user
import uuid
from app.projects import bp
from app.extensions import db

@bp.route('/api/create-project', methods=['POST'])
def create_project():
    # Retrieve project information from the request
    name = request.json['name']

    # Create a new Project instance
    project = Project(name=name)

    if current_user.is_authenticated:
        # Associate the current user with the project
        project.users.append(current_user)
        project.css_framework = current_user.settings.css_framework
        # Add and commit the new project to the database
        db.session.add(project)
        db.session.commit()

    # Return a success response
    return jsonify({'status': 'success', 'project': project.to_dict()})

@bp.route('/api/delete-project', methods=['DELETE'])
def delete_project():
    # Retrieve the project_id from the request body
    project_id = request.json['project_id']
    
    if current_user.is_authenticated:
        # Retrieve the project by its ID
        project = Project.query.get(project_id)
        
    # Check if the project exists
    if project is None:
        return jsonify({'status': 'error', 'message': 'Project not found'}), 404
  
    
    if current_user.is_authenticated:
        # Check if the current user is associated with the project
        if current_user not in project.users:
            return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403
        
        # Delete the project from the database
        db.session.delete(project)
        db.session.commit()

    # Return a success response
    return jsonify({'status': 'success', 'message': 'Project deleted successfully'})

@bp.route('/api/get-project', methods=['GET'])
def get_project():
    # Retrieve the project_id and project_name from the request body
    project_id = request.args.get('project_id')
    project_name = request.args.get('project_name')
    
    user_projects = current_user.projects  # Access the projects relationship directly
    retrieved_project = None

    for project in user_projects:
        if project.id == project_id:
            retrieved_project = project
            break

    if retrieved_project is None:
        # couldn't find by id, let's check by name for newly signed up, converted guest users
        for project in user_projects:
            if project.name == project_name:
                retrieved_project = project
                break

    if retrieved_project is None:
        return jsonify({'status': 'error', 'message': 'Project not found'}), 404

    project_data = retrieved_project.to_dict()
    return jsonify({'project': project_data})

@bp.route('/api/get-projects', methods=['GET'])
def get_projects():
    user_projects = current_user.projects  # Access the projects relationship directly
    projects_data = [project.to_dict() for project in user_projects]
    return jsonify({'projects': projects_data})

@bp.route('/api/projects/update', methods=['POST'])
def update_project():
    project_id = request.json.get('project_id')
    response_text = request.json.get('result')
    user_input = request.json.get("user_input")

    project = Project.query.get(project_id)
    
    if project.project_states:
        latest_project_state = project.project_states[-1]
        persisted_react_code = latest_project_state.react_code
        persisted_css_code = latest_project_state.css_code
        chat_messages_content = [{'role': msg.role, 'content': msg.content, 'created_at': msg.created_at} for msg in latest_project_state.chat_messages]
    else:
        latest_project_state = None
        persisted_react_code = ""
        persisted_css_code = ""
        chat_messages_content = []
    react_code, css_code = extract_code(response_text)

    # Add the chat messages to the new project state
    chat_messages_content.append({"role": "user", "content": user_input, 'created_at': None})
    chat_messages_content.append({"role": "assistant", "content": response_text, 'created_at': None})

    # if the model returns only React or CSS code for a given query, ensure that the state is created with the code so far instead of being empty
    if not react_code:
        react_code = persisted_react_code
    
    if not css_code:
        css_code = persisted_css_code
    
    # Create a new ProjectState and associate the new chat message with it
    new_project_state = ProjectState(react_code=react_code, css_code=css_code, project_id=project.id)

    if current_user.is_authenticated:    
        db.session.add(new_project_state)
        db.session.flush() # Flush to get the new_project_state.id
    else:
        new_project_state.id = uuid.uuid4().int
        current_user.add_project_state_to_project(project, new_project_state)

    # Add the chat messages to the new project state
    for message in chat_messages_content:
        model_name_value = AssistantModel(AssistantModel.GPT_3_5_TURBO.value) if message['role'] == 'assistant' else None
        chat_message = ChatMessage(content=message['content'], role=message['role'], created_at=message['created_at'], user_id=current_user.id, project_state_id=new_project_state.id, model_name=model_name_value)

        if current_user.is_authenticated:
            db.session.add(chat_message)
        else:
            chat_message.id = uuid.uuid4().int
            current_user.add_chat_message_to_project_state(new_project_state, chat_message)
    
    if current_user.is_authenticated:
        db.session.commit()
    else:
        project = Project.query.get(int(project_id))

    # Create the response object with full project details
    return jsonify({'status': 'success', 'project': project.to_dict()})

@bp.route('/api/reset', methods=['POST'])
def reset():
    project_id = request.json['project_id']
    project = None
    
    if current_user.is_authenticated:
        project = Project.query.get(project_id)
        if project:
            model_name = None
            # Reset project states
            for state in project.project_states:
                for chat_message in state.chat_messages:
                    if chat_message.model_name:
                        model_name = chat_message.model_name.value
                    db.session.delete(chat_message)
                db.session.delete(state)
            db.session.commit()
    else:
        project = current_user.get_project(project_id)
        current_user.reset_project(project_id)
    
    return jsonify({'status': 'State has been reset'})

def extract_code(response_text):
    # # Use a regular expression to find code blocks
    js_pattern = r'```javascript.*?\n(.*?)```'
    css_pattern = r'```css.*?\n(.*?)```'
    
    js_code_blocks = re.findall(js_pattern, response_text, re.DOTALL)
    css_code_blocks = re.findall(css_pattern, response_text, re.DOTALL)
    
    # # Remove leading/trailing whitespace from each block
    react_code = js_code_blocks[0].strip() if js_code_blocks else ""
    css_code = css_code_blocks[0].strip() if css_code_blocks else ""
 
    return react_code, css_code