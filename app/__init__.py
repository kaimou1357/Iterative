from flask import Flask
from app.extensions import db
from app.main import bp as main_bp
from app.auth import bp as auth_bp
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__, static_folder = "react_app/build")
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)

    # Register blueprints here
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)

    return app