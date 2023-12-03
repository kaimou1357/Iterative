import uuid
from flask import session
from flask_login import AnonymousUserMixin
from app.models.project import Project


class GuestUser(AnonymousUserMixin):
    def setup(self):
        if 'guest_uuid' not in session:
            session['guest_uuid'] = 'guest-' + str(uuid.uuid4())
        if 'projects' not in session:
            session['projects'] = []

    def get_id(self):
        return session.get('guest_uuid', None)
    
    def add_project(self, project):
        project_dict = project.to_dict()
        project_dict['users'] = [self.to_dict()]
        session['projects'].append(project_dict)

    def delete_project(self, projectToDelete):  
        # Filter out the project with the given project_id
        session['projects'] = [project for project in session['projects'] if int(project['id']) != int(projectToDelete.id)]

    def get_projects(self):
        return [Project.from_dict(projectDict) for projectDict in session.get('projects', [])]
    
    def get_project(self, project_id):
        for project in self.projects:
            if int(project.id) == int(project_id):
                return project
        return None
    
    def add_project_state_to_project(self, project, project_state):
        projects = session.get('projects', [])

        for idx, existing_project in enumerate(projects):
            if int(existing_project['id']) == int(project.id):
                # Append the new project state to the existing project's states
                existing_project['projectStates'].append(project_state.to_dict())
                # Replace the old project data with the updated one
                projects[idx] = existing_project
                break
        session['projects'] = projects

    def add_chat_message_to_project_state(self, project_state, chat_message):
        projects = session.get('projects', [])
        for project in projects:
            for state in project['projectStates']:
                if int(state['id']) == int(project_state.id):
                    # Append the new chat message to the existing project state's messages
                    chat_message_dict = chat_message.to_dict()
                    chat_message_dict['user_email'] = self.email
                    state['messages'].append(chat_message_dict)
                    break
        session['projects'] = projects
    
    def reset_project(self, project_id):
        projects = session.get('projects', [])


        for idx, existing_project in enumerate(projects):
            if int(existing_project['id']) == int(project_id):
                # Clear out the project states
                existing_project['projectStates'] = []
                # Replace the old project data with the updated one
                projects[idx] = existing_project
                break
        session['projects'] = projects


    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email
        }
    
    @property
    def projects(self):
        return self.get_projects()
    
    @property
    def id(self):
        return self.get_id()
    
    @property
    def email(self):
        return "Guest"
    
    @property
    def is_guest(self):
        return self.id != None
    
    def __eq__(self, other):
        if isinstance(other, GuestUser):
            return self.id == other.id
        return False