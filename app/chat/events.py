from flask_socketio import send, emit
from app import socketio

@socketio.on('connect')
def handle_message(message):
  print("Socket has connected")
  send(message)

@socketio.on("user_message")
def on_user_message(message):
  print(message)
