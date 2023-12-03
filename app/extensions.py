from flask_sqlalchemy import SQLAlchemy
from app import app
from flask_login import LoginManager
from flask_session import Session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from celery import Celery
from config import Config

db = SQLAlchemy()
login_manager = LoginManager(app)
session = Session(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
celery = Celery(app.name, broker_url=Config.REDIS_URL,
        result_backend=Config.REDIS_URL )
celery.conf.update(app.config)