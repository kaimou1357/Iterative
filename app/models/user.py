from app.extensions import db, user_project_table
from flask_login import UserMixin

    
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