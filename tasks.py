import celery
import os

app = celery.Celery("Iterative")
app.conf.update(BROKER_URL=os.environ['REDIS_URL'],
                CELERY_RESULT_BACKEND=os.environ['REDIS_URL'])

@app.task
def process_gpt_stream(x, y):
  return x + y