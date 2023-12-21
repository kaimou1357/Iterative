from app import socketio
from flask_socketio import send, emit


@socketio.on('connect')
def handle_message(message):
  print("Socket has connected")
  send(message)
