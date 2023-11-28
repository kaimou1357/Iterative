from celery import Celery, shared_task
import os

from openai import OpenAI

celery = Celery('Iterative')
celery.conf.broker_url = os.environ.get("REDIS_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("REDIS_URL", "redis://localhost:6379")

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
          presence_penalty=0
      )