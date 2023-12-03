from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_session import Session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from celery import Celery
from config import Config
from app.extensions import db
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__, static_folder = "react_app/build")
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    login_manager = LoginManager(app)
    session = Session(app)
    migrate = Migrate(app, db)
    bcrypt = Bcrypt(app)
    celery = Celery(app.name, broker_url=config_class.REDIS_URL,
            result_backend=config_class.REDIS_URL)
    celery.conf.update(app.config)
    db.init_app(app)
    login_manager.init_app(app)
    CORS(app)
    
    # Login Manager Init
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Unauthorized"}), 401

    # Register blueprints here
    from app.main import bp as main_bp
    from app.auth import bp as auth_bp
    from app.projects import bp as project_bp
    from app.settings import bp as settings_bp
    from app.core import bp as core_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(core_bp)
    return app
  
