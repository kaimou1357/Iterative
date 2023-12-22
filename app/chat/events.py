import os
from flask_socketio import send, emit
from app import socketio
from app.models.project import Project
import tiktoken
from openai import OpenAI

openai_client = OpenAI(api_key = os.environ.get('OPENAI_API_KEY'), organization = 'org-tUXaB2qekHhDUPyZzOB2PnDT')

@socketio.on('connect')
def handle_connect(message):
  emit("server_response", "What would you like to build?")
  

def on_code_generated(user_msg):
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
  

@socketio.on("user_message")
def on_user_message(payload):
  user_msg = payload['description']
  project_id = 55
  css_framework_str = "daisyUI"
  project = Project.query.get(project_id)
  
  if project.project_states:
        latest_project_state = project.project_states[-1]
        persisted_react_code = latest_project_state.react_code
        chat_messages_content = [{'role': msg.role, 'content': msg.content, 'created_at': msg.created_at} for msg in latest_project_state.chat_messages]
  else:
      latest_project_state = None
      persisted_react_code = ""
      chat_messages_content = []
  
  chat_messages_content.append({"role": "user", "content": user_msg, 'created_at': None})
  
  user_messages_content = [
        {key: value for key, value in chat_message_content.items() if key in ['role', 'content']}
        for chat_message_content in chat_messages_content if chat_message_content['role'] == 'user'
    ]

    # This is a nuclear fix to force gpt-4 (especially) to listen and return the full code every time. Too many optimizations built in to it which return truncated responses.
    # Remove this once the diffing system is in.
  for user_message_content in user_messages_content:
    user_message_content['content'] = user_message_content['content'] + "- Please return the full React code in your response."

  system_prompt = f"""
                      Based on the user's request, please provide the code for a Single Page Application, using a functional React component named 'App', following these specific guidelines:
                          - [x] To start, first identify and build the PRIMARY features essential to the described application.
                          - [x] Also include SECONDARY features that enhance the functionality and user experience.
                          - [x] Do NOT use import, export or require statements. Only return a function App() {{}}.
                          - [x] Enclose the code within triple backticks.
                          - [x] Use only inline standard {css_framework_str} components for styling, including colors, margins, padding, and spacing. Ensure components are responsive and aesthetically pleasing, and ensure all components are visible.
                          - [x] Don't make up any fictional {css_framework_str} component names. Check {css_framework_str} docs if you have to, and find the closest theme, color, or component to what the user asks for.
                          - [x] In case of conflicting user requests, follow the most recent request for styling or functionality, and ignore the previous conflicting requests. Interpret the provided user messages in chronological order.
                          - [x] When the user asks to simply re-position or move an element, ensure there are no unwanted side effects, such as changing the size or visual styling.
                          - [x] Use React hooks like this: 'React.useState('')'.
                          - [x] Build out the secondary features as well. Do NOT just give me a starting point.
                          - [x] No explanations needed, only code. You're an experienced UI engineer and know what to do without being told.
                          - [x] Provide reasonable placeholder data so UI components aren't empty or filled with generic placeholder text.
                          - [x] Ensure continuity with previous code snippets, building upon the existing structure and returning the full, updated React code each time.
                          - [x] The code you return will be executed unaltered, so it should be complete and working in every response. Therefore, NEVER shorten the code with substitutions like '{{/* ...existing code... */}}'. Always return the full code.
                          - [x] If the user asks for a webpage, expand the page to fill the full available height and width.

                      Here's my current React code, please add to this:
                      \\`\\`\\`javascript
                      {persisted_react_code}
                      \\`\\`\\`

                      Here's an example structure you can follow:

                      \\`\\`\\`javascript
                      function App() {{
                          ... = React.useState("Click me");

                      }}
                      \\`\\`\\`
                      """

  messages = [
      {
          "role": "system",
          "content": system_prompt
      },
      *user_messages_content
  ]

  max_tokens_allowed = 3000

  encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
  messages_string = messages_to_string(messages)
  current_num_tokens = len(encoding.encode(messages_string))

  tokens_remaining = max_tokens_allowed - current_num_tokens

  # Enqueue Celery Job Here
  response = openai_client.chat.completions.create(
          model="gpt-3.5-turbo",
          messages=messages,
          temperature=0.1,
          max_tokens=tokens_remaining,
          top_p=1,
          frequency_penalty=0,
          presence_penalty=0,
          stream=True
      )
  
  collected_chunks = []
  collected_messages = []
  # iterate through the stream of events
  for chunk in response:
      collected_chunks.append(chunk)  # save the event response
      chunk_message = chunk.choices[0].delta  # extract the message
      collected_messages.append(chunk_message)  # save the message

  # print the time delay and text received
  full_reply_content = ''.join(["" if m.content is None else m.content for m in collected_messages])
  
  emit("server_code", full_reply_content)
  on_code_generated(user_msg)

def messages_to_string(messages):
    result = ""
    for message in messages:
        for key, value in message.items():
            result += f"{key}: {value}\n"
    return result
  

