from app import app, db

print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI'])

with app.app_context():
    # Drop all existing tables
    db.drop_all()

print("Database tables dropped successfully.")
