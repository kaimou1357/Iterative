from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

user_project_table = db.Table('user_project', db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'))
)