import os
from flask_socketio import send, emit
from app import socketio
from openai import OpenAI

@socketio.on('connect')
def handle_connect(message):
  emit("server_response", "What would you like to build?")

@socketio.on("user_message")
def on_user_message(payload):
  user_msg = payload['description']
  
  user_prompt = f"""
    How can I improve the UI for what I am building for below?
    {user_msg}
  """
  
  messages = [
    {
      "role": "user",
      "content": user_prompt
    },
    {
      "role": "assistant",
      "content": "You should help the user suggest possible UI improvements they can make given their domain"
    }
  ]
  
  openai_client = OpenAI(api_key = os.environ.get('OPENAI_API_KEY'), organization = 'org-tUXaB2qekHhDUPyZzOB2PnDT')
  response = openai_client.chat.completions.create(
          model="gpt-3.5-turbo",
          messages=messages,
          temperature=0.1,
          max_tokens=150,
          top_p=1,
          frequency_penalty=0,
          presence_penalty=0,
      )
  content = response.choices[0].message.content
  emit("server_response", content)

