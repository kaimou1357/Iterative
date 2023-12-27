from functools import wraps
import os
import stytch

def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    client = stytch.Client(
      project_id=os.environ.get("STYTCH_PROJECT_ID"),
      secret=os.environ.get("STYTCH_SECRET"),
      environment=os.environ.get("STYTCH_PROJECT_ENV")
    )
    
    client.sessions.authenticate_jwt()
    
    