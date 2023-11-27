from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, AnonymousUserMixin, login_required
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis
import re
import openai
import os
import tiktoken
import logging
from logging.handlers import RotatingFileHandler
import uuid
from datetime import timedelta
from enum import Enum
from amplitude import Amplitude, BaseEvent

# Initialize environment variables dictionary
env_vars = {
    'SECRET_KEY': os.environ.get('SECRET_KEY'),
    'OPENAI_API_KEY': os.environ.get('OPENAI_API_KEY'),
    'FLASK_ENV': os.environ.get('FLASK_ENV'),
    'AMPLITUDE_API_KEY': os.environ.get('AMPLITUDE_API_KEY')
}

# Add production-specific environment variables if not in development
if env_vars['FLASK_ENV'] != 'development':
    env_vars.update({
        'RENDER_POSTGRESQL_URL': os.environ.get('RENDER_POSTGRESQL_URL'),
        'RENDER_REDIS_HOST': os.environ.get('RENDER_REDIS_HOST'),
        'RENDER_REDIS_PORT': os.environ.get('RENDER_REDIS_PORT')
    })

# Identify missing variables
missing_vars = [key for key, value in env_vars.items() if value is None]

if missing_vars:
    raise EnvironmentError(f"Required environment variables are missing: {', '.join(missing_vars)}")

# Assign environment variables to Python variables
SECRET_KEY = env_vars['SECRET_KEY']
OPENAI_API_KEY = env_vars['OPENAI_API_KEY']
FLASK_ENV = env_vars['FLASK_ENV']
AMPLITUDE_API_KEY = env_vars['AMPLITUDE_API_KEY']

if FLASK_ENV != 'development':
    RENDER_POSTGRESQL_URL = env_vars['RENDER_POSTGRESQL_URL']
    RENDER_REDIS_HOST = env_vars['RENDER_REDIS_HOST']
    RENDER_REDIS_PORT = env_vars['RENDER_REDIS_PORT']

# Define the Flask application
app = Flask(__name__)
app.secret_key = SECRET_KEY

# Initialize environment-specific variables and logging
if FLASK_ENV == 'development':
    cors_origins = ["http://localhost:3000"]
    db_uri = 'postgresql://localhost/TBD_dev'
    redis_host = 'localhost'
    redis_port = 6379

    # Set up logging for development
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s: %(message)s')
    
    # Create a file handler and set the level to error
    file_handler = RotatingFileHandler('TBD_dev.log', maxBytes=1024 * 1024, backupCount=1)
    file_handler.setLevel(logging.ERROR)

    redis_url = f'redis://{redis_host}:{redis_port}/0'
    
    # Disable rate limiting in development
    limiter = Limiter(
        app=app,
        storage_uri=redis_url,
        key_func=get_remote_address
    )
    logging.debug("Running in development")
else:
    cors_origins = ["https://TBD.com", "https://www.TBD.com"]
    db_uri = RENDER_POSTGRESQL_URL
    redis_host = RENDER_REDIS_HOST
    redis_port = RENDER_REDIS_PORT

    # Set up logging for production
    logging.basicConfig(level=logging.WARNING, format='%(asctime)s - %(levelname)s: %(message)s')

    # Create a file handler and set the level to warning
    file_handler = RotatingFileHandler('TBD_prod.log', maxBytes=1024 * 1024, backupCount=1)
    file_handler.setLevel(logging.WARNING)

    redis_url = f'redis://{redis_host}:{redis_port}/0'

    # Enable rate limiting in production
    limiter = Limiter(
        app=app,
        storage_uri=redis_url,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"]
    )

# Common logging setup
formatter = logging.Formatter('%(asctime)s - %(levelname)s: %(message)s')
file_handler.setFormatter(formatter)

# Add the handlers to the logger
logging.getLogger().addHandler(file_handler)

CORS(app, resources={r"/*": {"origins": cors_origins}}, supports_credentials=True)

openai.api_key = os.getenv("OPENAI_API_KEY")

# SQLAlchemy Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)  # Make session data persist for 30 days
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'TBD:'
app.config['SESSION_REDIS'] = redis.StrictRedis(host=redis_host, port=redis_port, db=0)

if FLASK_ENV != 'development':
    app.config['SESSION_COOKIE_DOMAIN'] = '.TBD.com'  # Use the common parent domain
    app.config['SESSION_COOKIE_SECURE'] = True

db = SQLAlchemy(app)

Session(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Flask-Login Configuration
login_manager = LoginManager(app)
bcrypt = Bcrypt(app)

amplitude = Amplitude(AMPLITUDE_API_KEY)

# GuestUser
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
        logging.debug(f"projects: {projects}")
        logging.debug(f"projectState: {project_state}")
        logging.debug(f"projectState.to_dict(): {project_state.to_dict()}")

        for idx, existing_project in enumerate(projects):
            if int(existing_project['id']) == int(project.id):
                logging.debug(f"found project with id: {project.id}")
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
                    logging.debug(f"found project state with id: {project_state.id}")
                    # Append the new chat message to the existing project state's messages
                    chat_message_dict = chat_message.to_dict()
                    chat_message_dict['user_email'] = self.email
                    logging.debug(f"adding chat_message_dict: {chat_message_dict}")
                    state['messages'].append(chat_message_dict)
                    break
        session['projects'] = projects
    
    def reset_project(self, project_id):
        projects = session.get('projects', [])

        logging.debug(f"current projects: {projects}")

        for idx, existing_project in enumerate(projects):
            logging.debug(f"existing project {existing_project} with id: {existing_project['id']}")
            if int(existing_project['id']) == int(project_id):
                logging.debug(f"resetting project with id: {project_id}")
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
        logging.debug(f"checking equality between self: {self.id} and other: {other.id}")
        if isinstance(other, GuestUser):
            logging.debug(f"return {self.id == other.id.id}")
            return self.id == other.id
        return False

login_manager.anonymous_user = GuestUser

# Many-to-Many relationship table between User and Project
user_project_table = db.Table('user_project', db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'))
)

class AssistantModel(Enum):
    GPT_3_5_TURBO = "gpt-3.5-turbo"
    GPT_3_5_TURBO_16K = "gpt-3.5-turbo-16k"
    GPT_4 = "gpt-4"

    def max_tokens_allowed(self):
        if self == AssistantModel.GPT_3_5_TURBO:
            return 4097
        elif self == AssistantModel.GPT_3_5_TURBO_16K:
            return 16384
        elif self == AssistantModel.GPT_4:
            return 8192

class ColorScheme(Enum):
    LIGHT = "light"
    DARK = "dark"
    SYSTEM = "system" # just follow the system settings

class CSSFramework(Enum):
    BOOTSTRAP = "bootstrap"
    DAISYUI = "daisyui"

    def to_str(self):
        if self == CSSFramework.BOOTSTRAP:
            return "Bootstrap 5"
        elif self == CSSFramework.DAISYUI:
            return "daisyUI"
        
    def dark_mode_str(self):
        if self == CSSFramework.BOOTSTRAP:
            return "data-bs-theme='dark'"
        elif self == CSSFramework.DAISYUI:
            return "data-theme='dark'"

class UserSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)  # Ensure one-to-one relationship
    
    model_name = db.Column(db.Enum(AssistantModel), default=AssistantModel.GPT_3_5_TURBO, server_default=AssistantModel.GPT_3_5_TURBO.name, nullable=False)
    color_scheme = db.Column(db.Enum(ColorScheme), default=ColorScheme.SYSTEM, server_default=ColorScheme.SYSTEM.name, nullable=False)
    show_assistant_messages = db.Column(db.Boolean, default=False, server_default="false", nullable=False)
    css_framework = db.Column(db.Enum(CSSFramework), default=CSSFramework.DAISYUI, server_default=CSSFramework.BOOTSTRAP.name, nullable=False)
    
    user = db.relationship('User', back_populates='settings', uselist=False)
    
    def __repr__(self):
        return f"UserSettings(user_id={self.user_id}, color_scheme='{self.color_scheme.name}'), model_name='{self.model_name.name}', css_framework='{self.css_framework.name}')"
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_email': self.user.email,
            'model_name': self.model_name.name,
            'color_scheme': self.color_scheme.name,
            'show_assistant_messages': self.show_assistant_messages,
            'css_framework': self.css_framework.name
        }

# User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False) # Email Address (Primary)
    password = db.Column(db.String(60), nullable=False)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    username = db.Column(db.String(20), unique=True, nullable=True)
    phone_number = db.Column(db.String(15), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    projects = db.relationship('Project', secondary=user_project_table, back_populates='users')
    chat_messages = db.relationship('ChatMessage', back_populates='user')
    settings = db.relationship('UserSettings', back_populates='user', uselist=False, cascade="all, delete, delete-orphan")

    def __repr__(self):
        return f"User('{self.email}')"
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'phone_number': self.phone_number,
            'bio': self.bio
        }

    @classmethod
    def from_dict(cls, data):
        user = cls()
        user.id = data.get('id')
        user.email = data.get('email')
        user.first_name = data.get('first_name')
        user.last_name = data.get('last_name')
        user.username = data.get('username')
        user.phone_number = data.get('phone_number')
        user.bio = data.get('bio')
        return user
    
    @property
    def is_guest(self):
        return False

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)  # 'user' or 'assistant'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_state_id = db.Column(db.Integer, db.ForeignKey('project_state.id'), nullable=False)
    user = db.relationship('User', back_populates='chat_messages')
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    model_name = db.Column(db.Enum(AssistantModel), default=AssistantModel.GPT_3_5_TURBO, nullable=True)
    user_email = ""

    def __repr__(self):
        return f"ChatMessage(ID: {self.id}, User: {self.user_id}, Content: {self.content[:50]})"
    
    def to_dict(self):
        email = self.user_email
        if self.user:
            email = self.user.email

        time_str = ""
        if self.created_at:
            time_str = self.created_at.strftime('%Y-%m-%d %H:%M:%S')

        model_name = ""
        if self.model_name:
            model_name = self.model_name.value

        return {
            'id': str(self.id),
            'content': self.content,
            'role': self.role,
            'user_id': self.user_id,
            'project_state_id': str(self.project_state_id),
            'user_email': email,
            'created_at': time_str,
            'model_name': model_name
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            id=int(data.get('id')),
            content=data.get('content'),
            role=data.get('role'),
            user_id=data.get('user_id'),
            user_email=data.get('user_email'),
            project_state_id=int(data.get('project_state_id')),
            model_name=AssistantModel(data.get('model_name'))
        )

class ProjectState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    react_code = db.Column(db.Text, nullable=True)
    css_code = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.now())
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    chat_messages = db.relationship('ChatMessage', backref='project_state', cascade='all, delete-orphan', order_by=db.asc(ChatMessage.id))

    def __repr__(self):
        messages_summary = ", ".join([msg.content[:20] for msg in self.chat_messages]) # Truncate messages
        react_code_summary = self.react_code[:50] if self.react_code else "None" # Truncate react code
        css_code_summary = self.css_code[:50] if self.css_code else "None" # Truncate css code
        return f"ProjectState(ID: {self.id}, Project: {self.project_id}, Messages: [{messages_summary}], React Code: {react_code_summary}, CSS Code: {css_code_summary})"
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'reactCode': self.react_code,
            'cssCode': self.css_code,
            'projectID': str(self.project_id),
            'messages': [msg.to_dict() for msg in self.chat_messages]
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=int(data.get('id')),
            react_code=data.get('reactCode'),
            css_code=data.get('cssCode'),
            project_id=int(data.get('projectID')),
            chat_messages=[ChatMessage.from_dict(message) for message in data.get('messages', [])]
        )


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    last_modified_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())
    last_accessed_at = db.Column(db.DateTime)
    css_framework = db.Column(db.Enum(CSSFramework), default=CSSFramework.DAISYUI, server_default=CSSFramework.BOOTSTRAP.name, nullable=False)
    project_states = db.relationship('ProjectState', backref='project', cascade='all, delete-orphan', order_by=db.asc(ProjectState.id))
    users = db.relationship('User', secondary=user_project_table, back_populates='projects')

    def __repr__(self):
        return f"Project('{self.name}')"
    
    def to_dict(self):
        if isinstance(self.css_framework, CSSFramework):
            css_framework = self.css_framework.name
        else:
            css_framework = self.css_framework
        return {
            'id': str(self.id),
            'name': self.name,
            'users': [{'email': user.email, 'id': user.id} for user in self.users],
            'projectStates': [{
                'reactCode': state.react_code,
                'cssCode': state.css_code,
                'messages': [msg.to_dict() for msg in state.chat_messages]
            } for state in self.project_states],
            'cssFramework': css_framework
        }
    
    @classmethod
    def from_dict(cls, data):
        project = cls()
        project.id = int(data.get('id'))
        project.name = data.get('name')
                
        # Users
        user_data = data.get('users', [])
        logging.debug(f"Creating user list from user_data: {user_data}")
        project.users = [User.from_dict(user) for user in user_data]
        logging.debug(f"user list: {project.users}")
        
        # Project States
        state_data = data.get('projectStates', [])
        logging.debug(f"Creating project state list from state_data: {state_data}")
        project.project_states = [ProjectState.from_dict(state) for state in state_data]

        # CSS Framework
        css_framework_data = data.get('cssFramework', )
        logging.debug(f"Creating project css framework from css_framework_data: {css_framework_data}")
        project.css_framework = css_framework_data
        
        return project

# Define a function to convert the messages into a string, including the keys
def messages_to_string(messages):
    result = ""
    for message in messages:
        for key, value in message.items():
            result += f"{key}: {value}\n"
    return result

@app.route('/api/')
def home():
    return 'Welcome to the TBD API!'

@app.route('/api/generate', methods=['POST'])
def generate():
    project_id = request.json['project_id']

    if current_user.is_authenticated:
        project = Project.query.get(project_id)
        css_framework_str = project.css_framework.to_str()
        dark_mode_str = project.css_framework.dark_mode_str()
        model_name = current_user.settings.model_name.value
        model = current_user.settings.model_name
    else:
        # For non-logged-in users, use the session to store project state.
        logging.debug(f"Looking for project with id: {(project_id)}")
        logging.debug(f"Current user projects: {current_user.projects}")
        project = current_user.get_project(project_id)
        css_framework_str = CSSFramework.BOOTSTRAP.to_str()
        dark_mode_str = CSSFramework.BOOTSTRAP.dark_mode_str()
        model_name = AssistantModel.GPT_3_5_TURBO.value
        model = AssistantModel.GPT_3_5_TURBO

    logging.debug(f"css_framework_str: {css_framework_str}")
    
    if project is None:
        return jsonify({'error': 'Project not found'}), 404

    description = request.json['description']

    # Retrieve the latest ProjectState if exists
    if project.project_states:
        latest_project_state = project.project_states[-1]
        logging.debug(f"latest_project_state: {latest_project_state}")
        persisted_react_code = latest_project_state.react_code
        persisted_css_code = latest_project_state.css_code
        chat_messages_content = [{'role': msg.role, 'content': msg.content, 'created_at': msg.created_at} for msg in latest_project_state.chat_messages]
    else:
        latest_project_state = None
        persisted_react_code = ""
        persisted_css_code = ""
        chat_messages_content = []

    # Add the new chat message to the list
    chat_messages_content.append({"role": "user", "content": description, 'created_at': None})

    event = BaseEvent(
        event_type="Generate Code",
        user_id=pad_user_id(current_user.id),
        event_properties={
            "user_message": description,
            "project_name": project.name,
            "project_id": project.id,
            "model_name": model_name
        }
    )
    amplitude.track(event)

    logging.debug(f"chat_messages: {chat_messages_content}")

    user_messages_content = [
        {key: value for key, value in chat_message_content.items() if key in ['role', 'content']}
        for chat_message_content in chat_messages_content if chat_message_content['role'] == 'user'
    ]

    # This is a nuclear fix to force gpt-4 (especially) to listen and return the full code every time. Too many optimizations built in to it which return truncated responses.
    # Remove this once the diffing system is in.
    for user_message_content in user_messages_content:
        user_message_content['content'] = user_message_content['content'] + "- Please return the full React code in your response."

    system_prompt = f"""
                        Based on the user's request, please provide the code for a Single Page Application, using a functional React component named 'App', following these specific guidelines:
                            - [x] To start, first identify and build the PRIMARY features essential to the described application.
                            - [x] Also include SECONDARY features that enhance the functionality and user experience.
                            - [x] Do NOT use import, export or require statements. Only return a function App() {{}}.
                            - [x] Enclose the code within triple backticks.
                            - [x] Use only inline standard {css_framework_str} components for styling, including colors, margins, padding, and spacing. Ensure components are responsive and aesthetically pleasing, and ensure all components are visible.
                            - [x] Don't make up any fictional {css_framework_str} component names. Check {css_framework_str} docs if you have to, and find the closest theme, color, or component to what the user asks for.
                            - [x] If the user asks for a dark theme, set {dark_mode_str} on the outermost component. Use neutral colors throughout, so they will respect this setting.
                            - [x] In case of conflicting user requests, follow the most recent request for styling or functionality, and ignore the previous conflicting requests. Interpret the provided user messages in chronological order.
                            - [x] When the user asks to simply re-position or move an element, ensure there are no unwanted side effects, such as changing the size or visual styling.
                            - [x] Use React hooks like this: 'React.useState('')'.
                            - [x] Build out the secondary features as well. Do NOT just give me a starting point.
                            - [x] No explanations needed, only code. You're an experienced UI engineer and know what to do without being told.
                            - [x] Provide reasonable placeholder data so UI components aren't empty or filled with generic placeholder text.
                            - [x] Ensure continuity with previous code snippets, building upon the existing structure and returning the full, updated React code each time.
                            - [x] The code you return will be executed unaltered, so it should be complete and working in every response. Therefore, NEVER shorten the code with substitutions like '{{/* ...existing code... */}}'. Always return the full code.
                            - [x] If the user asks for a webpage, expand the page to fill the full available height and width.

                        Here's my current React code, please add to this:
                        \\`\\`\\`javascript
                        {persisted_react_code}
                        \\`\\`\\`

                        Here's an example structure you can follow:

                        \\`\\`\\`javascript
                        function App() {{
                            ... = React.useState("Click me");

                        }}
                        \\`\\`\\`
                        """
    
    logging.debug(f"system_prompt: {system_prompt}")

    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        *user_messages_content
    ]

    max_tokens_allowed = model.max_tokens_allowed()

    encoding = tiktoken.encoding_for_model(model_name)
    messages_string = messages_to_string(messages)
    current_num_tokens = len(encoding.encode(messages_string))
    logging.debug(f"current_num_tokens: {current_num_tokens}")

    tokens_remaining = max_tokens_allowed - current_num_tokens

    response = openai.ChatCompletion.create(
        model=model_name,
        messages=messages,
        temperature=0.1,
        max_tokens=tokens_remaining,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    response_text = response.choices[0].message['content']

    logging.debug(f"response_text: {response_text}")

    # Process the response
    react_code, css_code = extract_code(response_text)
    assistant_message = response_text

    # Add the chat messages to the new project state
    chat_messages_content.append({"role": "assistant", "content": assistant_message, 'created_at': None})

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
        model_name_value = AssistantModel(model_name) if message['role'] == 'assistant' else None
        chat_message = ChatMessage(content=message['content'], role=message['role'], created_at=message['created_at'], user_id=current_user.id, project_state_id=new_project_state.id, model_name=model_name_value)

        if current_user.is_authenticated:
            db.session.add(chat_message)
        else:
            chat_message.id = uuid.uuid4().int
            current_user.add_chat_message_to_project_state(new_project_state, chat_message)
    
    if current_user.is_authenticated:
        db.session.commit()
    else:
        project = current_user.get_project(project_id)

    logging.debug(f"project: {project.to_dict()}")

    # Create the response object with full project details
    return jsonify({'status': 'success', 'project': project.to_dict()})

def extract_code(response_text):
    # # Use a regular expression to find code blocks
    js_pattern = r'```javascript.*?\n(.*?)```'
    css_pattern = r'```css.*?\n(.*?)```'
    
    js_code_blocks = re.findall(js_pattern, response_text, re.DOTALL)
    css_code_blocks = re.findall(css_pattern, response_text, re.DOTALL)
    
    # # Remove leading/trailing whitespace from each block
    react_code = js_code_blocks[0].strip() if js_code_blocks else ""
    css_code = css_code_blocks[0].strip() if css_code_blocks else ""

    logging.debug("\n\n")

    logging.debug(f"react_code: {react_code}")
    logging.debug(f"css_code: {css_code}")
 
    return react_code, css_code

def extract_assistant_message(response_text):
    # Use regex to find and replace content within the code blocks while retaining the labels
    pattern = r"(```(javascript|css)\n).*?(```)"
    replacement = r"\1\3"
    modified_response_text = re.sub(pattern, replacement, response_text, flags=re.DOTALL)
    return modified_response_text

@app.route('/api/reset', methods=['POST'])
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
        logging.debug(f"need to reset project for guest user with id: {project_id}")
        project = current_user.get_project(project_id)
        current_user.reset_project(project_id)
        model_name = AssistantModel.GPT_3_5_TURBO.value

    event = BaseEvent(
        event_type="Reset Project",
        user_id=pad_user_id(current_user.id),
        event_properties={
            "project_name": project.name,
            "project_id": project_id,
            "model_name": model_name
        }
    )
    amplitude.track(event)
    
    return jsonify({'status': 'State has been reset'})

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized"}), 401

@app.route('/api/auth-status', methods=['GET'])
def auth_status():
    # Print session data for debugging
    logging.debug(f"session: {session}")
    logging.debug(f"current_user: {current_user}")
    logging.debug(f"current_user.id: {current_user.id}")
    logging.debug(f"current_user.is_authenticated: {current_user.is_authenticated}")
    logging.debug(f"current_user.is_guest: {current_user.is_guest}")
    
    response_data = {
        'isAuthenticated': current_user.is_authenticated,
        'isGuest': current_user.is_guest
    }
    
    response = jsonify(response_data)
    return response

@app.route('/api/sign-up', methods=['POST'])
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

    is_guest_sign_up = len(session.get('projects', [])) > 0

    migrate_guest_projects_to_db(user)

    event = BaseEvent(
        event_type="Sign Up",
        user_id=pad_user_id(user.id),
        event_properties={
            "email": email,
            "is_guest_sign_up": is_guest_sign_up
        }
    )
    amplitude.track(event)

    response = jsonify({'status': 'success'})
    return response

@app.route('/api/guest-auth', methods=['POST'])
def guest_auth():
    logging.debug(f"guest logging in")
    # Here, create an instance of the GuestUser with the UUID
    guest_user = GuestUser()
    guest_user.setup()
    logging.debug(f"guest_user.id: {guest_user.id}")

    login_user(guest_user, remember=False)

    return jsonify({'status': 'success'})

@app.route('/api/sign-in', methods=['POST'])
def sign_in():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user, remember=True)
         # Print session data for debugging
        logging.debug(f"session: {session}")
        logging.debug(f"current_user.is_authenticated: {current_user.is_authenticated}")
        logging.debug(f"current_user: {current_user}")

        migrate_guest_projects_to_db(user)

        event = BaseEvent(
            event_type="Sign In",
            user_id=pad_user_id(current_user.id),
            event_properties={
            }
        )
        amplitude.track(event)

        response = jsonify({'status': 'success'})
        return response
    else:
        return jsonify({'status': 'failure', 'message': 'Sign In Unsuccessful. Please check email and password'})

@app.route('/api/sign-out', methods=['POST'])
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

@app.route('/api/create-project', methods=['POST'])
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
    elif current_user.is_guest:
        project.id = uuid.uuid4().int
        project.css_framework = CSSFramework.BOOTSTRAP
        current_user.add_project(project)

    event = BaseEvent(
        event_type="Create Project",
        user_id=pad_user_id(current_user.id),
        event_properties={
            "project_name": project.name,
            "project_id": project.id
        }
    )
    amplitude.track(event)

    # Return a success response
    return jsonify({'status': 'success', 'project': project.to_dict()})

@app.route('/api/delete-project', methods=['DELETE'])
def delete_project():
    # Retrieve the project_id from the request body
    project_id = request.json['project_id']
    
    if current_user.is_authenticated:
        # Retrieve the project by its ID
        project = Project.query.get(project_id)
    elif current_user.is_guest:
        project = current_user.get_project(project_id)
        
    # Check if the project exists
    if project is None:
        return jsonify({'status': 'error', 'message': 'Project not found'}), 404
    
    event = BaseEvent(
        event_type="Delete Project",
        user_id=pad_user_id(current_user.id),
        event_properties={
            "project_name": project.name,
            "project_id": project_id
        }
    )
    amplitude.track(event)
    
    if current_user.is_authenticated:
        # Check if the current user is associated with the project
        if current_user not in project.users:
            return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403
        
        # Delete the project from the database
        db.session.delete(project)
        db.session.commit()
    elif current_user.is_guest:
        current_user.delete_project(project)

    # Return a success response
    return jsonify({'status': 'success', 'message': 'Project deleted successfully'})

@app.route('/api/get-project', methods=['GET'])
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
    logging.debug(f"project: {project_data}")
    return jsonify({'project': project_data})

@app.route('/api/get-projects', methods=['GET'])
def get_projects():
    user_projects = current_user.projects  # Access the projects relationship directly
    projects_data = [project.to_dict() for project in user_projects]
    logging.debug(f"projects: {projects_data}")
    return jsonify({'projects': projects_data})

@app.route('/api/get-user-settings', methods=['GET'])
@login_required
def get_user_settings():
    user_settings = current_user.settings
    settings_data = user_settings.to_dict()
    logging.debug(f"settings: {settings_data}")
    return jsonify({"settings": settings_data})

@app.route('/api/update-user-settings', methods=['POST'])
@login_required
def update_user_settings():
    settings = request.json['settings']
    logging.debug(f"updated settings: {settings}")
    current_user.settings.color_scheme = settings['color_scheme']
    current_user.settings.model_name = settings['model_name']
    current_user.settings.show_assistant_messages = settings['show_assistant_messages']
    current_user.settings.css_framework = settings['css_framework']
    db.session.commit()

    event = BaseEvent(
        event_type="Update User Settings",
        user_id=pad_user_id(current_user.id),
        event_properties={
            "user_settings": settings
        }
    )
    amplitude.track(event)

    return jsonify({"success": True})

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    # Check if the request contains a file
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    logging.debug(f"audio_file: {audio_file}")

    event = BaseEvent(
        event_type="Transcribe Begin",
        user_id=pad_user_id(current_user.id),
        event_properties={
            "model_name": "whisper-1"
        }
    )
    amplitude.track(event)

    # Validate the file size (25 MB)
    audio_file.seek(0, os.SEEK_END)
    file_size = audio_file.tell()
    audio_file.seek(0)
    if file_size > 25 * 1024 * 1024:
        return jsonify({'error': 'File size exceeds 25MB'}), 400
    
    # Write the file to disk
    audio_file_path = "temp_audio.wav"
    audio_file.save(audio_file_path)

    # Open the saved file for reading
    with open(audio_file_path, "rb") as f:
        try:
            # Using .translate instead of .transcribe works seamlessly, translates from any supported language into English
            transcript = openai.Audio.translate(model = "whisper-1", file = f)
            transcript_text = transcript['text']

            event = BaseEvent(
                event_type="Transcribe Success",
                user_id=pad_user_id(current_user.id),
                event_properties={
                    "transcript_text": transcript_text,
                    "model_name": "whisper-1"
                }
            )
            amplitude.track(event)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Delete the temporary file
            os.remove(audio_file_path)
    return jsonify({'transcript': transcript_text})

@app.route('/api/health', methods=['GET'])
@limiter.exempt
def health_check():
    return jsonify(status="OK"), 200

def pad_user_id(user_id, min_length=5, padding_char='0'):
    """Pad the user ID to meet a minimum length."""
    return str(user_id).rjust(min_length, padding_char)

if __name__ == '__main__':
    if FLASK_ENV == 'development':
        app.run(debug=True)
    else:
        app.run(debug=False)
