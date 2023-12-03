from app.main import bp
from app import app
import os
from flask import send_from_directory

@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def index(path):
  if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
  else:
      return send_from_directory(app.static_folder, 'index.html')