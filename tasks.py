import ssl
from celery import Celery, shared_task
import os

from openai import OpenAI

celery = Celery('Iterative')
celery.conf.broker_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
celery.conf.result_backend = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
celery.confg.broker_use_ssl = { "ssl_certs_reqs": ssl.CERT_NONE}
celery.confg.redis_backend_use_ssl = { "ssl_certs_reqs": ssl.CERT_NONE}

@shared_task
def stream_gpt_response(model_name, messages, tokens_remaining):
    openai_client = OpenAI(api_key = os.environ.get('OPENAI_API_KEY'), organization = 'org-tUXaB2qekHhDUPyZzOB2PnDT')
    response = openai_client.chat.completions.create(
          model=model_name,
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
    
    return full_reply_content