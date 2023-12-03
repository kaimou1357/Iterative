import os
import redis
from datetime import timedelta

class Config:
  SECRET_KEY = os.environ.get('SECRET_KEY')
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
  OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
  FLASK_ENV = os.environ.get('FLASK_ENV')
  REDIS_URL = os.environ.get('REDIS_URL')
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  SESSION_TYPE = 'redis'
  SESSION_PERMANENT = True
  PERMANENT_SESSION_LIFETIME = timedelta(days=30)
  SESSION_USE_SIGNER = True
  SESSION_KEY_PREFIX = 'Iterative:'
  SESSION_REDIS = redis.from_url(REDIS_URL)