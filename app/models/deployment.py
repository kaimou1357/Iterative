from app.extensions import db

class Deployment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_state_id = db.Column(db.Integer, db.ForeignKey('project_state.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    password = db.Column(db.String(20), nullable = False)
    
