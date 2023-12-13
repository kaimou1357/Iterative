from app.extensions import db

class Deployment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    project_state_id = db.Column(db.Integer, db.ForeignKey('project_state.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    password = db.Column(db.String(20), nullable = False)
    
    def serialize(self):
      return {
        "id": self.id,
        "project_state_id": self.project_state_id,
        "user_id": self.user_id,
        "name": self.name,
        "password": self.password,
      }
    
