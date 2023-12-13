from flask import jsonify, request
from flask_login import current_user
from app.main import bp
from app.models.deployment import Deployment
from app.extensions import db

@bp.get("/api/deployments")
def deployments_get():
  deployments = current_user.deployments
  return jsonify({"deployments": [d.serialize() for d in deployments]})

@bp.post("/api/deployments")
def deployments_post():
  data = request.json
  project_state_id = data.get("project_state_id")
  deployment = Deployment(project_state_id=project_state_id, user_id=current_user.id, password="test")
  db.session.add(deployment)
  db.session.commit()
  return jsonify({"success": True})


