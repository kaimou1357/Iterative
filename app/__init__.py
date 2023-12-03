from app.models.guest_user import GuestUser
from flask import Flask
from flask_cors import CORS
from app.extensions import db, login_manager
from app.main import bp as main_bp
from app.auth import bp as auth_bp
from app.projects import bp as project_bp
from app.settings import bp as settings_bp
from app.core import bp as core_bp
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__, static_folder = "react_app/build")
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.anonymous_user = GuestUser
    CORS(app)

    # Register blueprints here
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(core_bp)
    return app