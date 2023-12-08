import os
import redis
from datetime import timedelta

class Config:
  SECRET_KEY = os.environ.get('SECRET_KEY', "secret_key")
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', "postgresql://localhost:5432")
  OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', "test-api-key")
  FLASK_ENV = os.environ.get('FLASK_ENV', "development")
  REDIS_URL = os.environ.get('REDIS_URL', "redis://localhost:6379/0")
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  CELERY = dict(
    broker_url=REDIS_URL,
    result_backend=REDIS_URL,
  )
  SESSION_TYPE = 'redis'
  SESSION_PERMANENT = True
  PERMANENT_SESSION_LIFETIME = timedelta(days=30)
  SESSION_USE_SIGNER = True
  SESSION_KEY_PREFIX = 'Iterative:'
  SESSION_REDIS = redis.from_url(REDIS_URL)