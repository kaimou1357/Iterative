from functools import wraps
import os
from flask import request
import stytch
from app.models.user import User
from app.extensions import db

def get_or_create_user(stytch_user_id):
    user = User.query.filter_by(stytch_user_id=stytch_user_id).first()
    
    if not user:
      user = User(stytch_user_id=stytch_user_id)
      db.session.add(user)
      db.session.commit()
    
    return user
  
def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    client = stytch.Client(
      project_id=os.environ.get("STYTCH_PROJECT_ID"),
      secret=os.environ.get("STYTCH_SECRET"),
      environment=os.environ.get("STYTCH_PROJECT_ENV")
    )
    
    cookies = request.cookies
    stytch_jwt = cookies.get("stytch_session_jwt")
    if stytch_jwt is None:
      return f(None, *args, **kwargs)
    session = client.sessions.authenticate_jwt(stytch_jwt)
    if session is None:
      return f(None, *args, **kwargs)
    stytch_user_id = session.user_id
    current_user = get_or_create_user(stytch_user_id)
    
    return f(current_user, *args, **kwargs)
  return decorated 
    
    
    