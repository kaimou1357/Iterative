from flask import Flask
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from celery import Celery
from config import Config
from app.extensions import db, login_manager
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__, static_folder = "../react_app/build")
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    session = Session(app)
    migrate = Migrate(app, db)
    bcrypt = Bcrypt(app)
    celery = Celery(app.name, broker_url=config_class.REDIS_URL,
            result_backend=config_class.REDIS_URL)
    celery.conf.update(app.config)
    db.init_app(app)
    login_manager.init_app(app)
    CORS(app)

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
  
def make_celery(app=None):
    """
    Create a new Celery object and tie together the Celery config to the app's
    config. Wrap all tasks in the context of the application.

    :param app: Flask app
    :return: Celery app
    """
    app = app or create_app()

    celery = Celery(app.import_name)
    celery.conf.broker_url = os.environ.get("REDISCLOUD_URL", "redis://localhost:6379/0")
    celery.conf.result_backend = os.environ.get("REDISCLOUD_URL", "redis://localhost:6379/0")
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery
  
