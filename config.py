import os

class Config:
  SECRET_KEY = os.environ.get('SECRET_KEY')
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
  OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
  FLASK_ENV = os.environ.get('FLASK_ENV')
  REDIS_URL = os.environ.get('REDIS_URL')
  SQLALCHEMY_TRACK_MODIFICATIONS = False