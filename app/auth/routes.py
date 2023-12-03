from app.auth import bp
from app.models.chat_message import ChatMessage
from app.models.constants import CSSFramework
from app.models.guest_user import GuestUser
from app.models.project import Project
from app.models.project_state import ProjectState
from app.models.user import User
from app.models.user_settings import UserSettings
from flask import request, jsonify, session
from flask_login import login_user, logout_user
from app.extensions import db
import bcrypt

@bp.route('/api/sign-up', methods=['POST'])
def sign_up():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Check if the email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'status': 'error', 'message': 'Email already exists. Please choose a different email.'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, password=hashed_password)
    user.settings = UserSettings()
    
    db.session.add(user)
    db.session.commit()
    
    login_user(user, remember=True)

    migrate_guest_projects_to_db(user)

    response = jsonify({'status': 'success'})
    return response


@bp.route('/api/guest-auth', methods=['POST'])
def guest_auth():
    # Here, create an instance of the GuestUser with the UUID
    guest_user = GuestUser()
    guest_user.setup()

    login_user(guest_user, remember=False)

    return jsonify({'status': 'success'})

@bp.route('/api/sign-in', methods=['POST'])
def sign_in():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user, remember=True)
         # Print session data for debugging
        migrate_guest_projects_to_db(user)


        response = jsonify({'status': 'success'})
        return response
    else:
        return jsonify({'status': 'failure', 'message': 'Sign In Unsuccessful. Please check email and password'})

@bp.route('/api/sign-out', methods=['POST'])
def sign_out():
    logout_user()
    response = jsonify({'status': 'success'})
    return response


def migrate_guest_projects_to_db(user):
    # Retrieve projects from the session
    projects_data = session.get('projects', [])

    for project_data in projects_data:
        # Migrate the project
        new_project = Project(name=project_data['name'])
        new_project.users.append(user)
        new_project.css_framework = CSSFramework.BOOTSTRAP

        db.session.add(new_project)
        db.session.flush()  # flush so that we get the ID of the newly added project

        # Migrate project states for the project
        for state_data in project_data.get('projectStates', []):
            new_state = ProjectState(
                react_code=state_data['reactCode'],
                css_code=state_data['cssCode'],
                project_id=new_project.id,
            )
            db.session.add(new_state)
            db.session.flush()  # flush so that we get the ID of the newly added project state

            # Migrate chat messages for the project state
            for message_data in state_data.get('messages', []):
                new_message = ChatMessage(
                    content=message_data['content'],
                    role=message_data['role'],
                    model_name=message_data['model_name'],
                    project_state_id=new_state.id,
                    user_id=user.id
                )
                db.session.add(new_message)

    # Commit all changes
    db.session.commit()

    # Clear the projects from the session
    session.pop('projects', None)
    # Clear the guest_uuid from the session
    session.pop('guest_uuid', None)