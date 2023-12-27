from functools import wraps
import os
from flask import request
import stytch

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
    session = client.sessions.authenticate_jwt(stytch_jwt)
    print(session)
    
    return f(None, *args, **kwargs)
  return decorated 
    
    
    