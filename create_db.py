import os
from app import app, db

print("Current working directory:", os.getcwd())
print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI'])

with app.app_context():
    db.create_all()

print("Database tables created successfully.")