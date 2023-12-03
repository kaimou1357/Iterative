import ssl
from flask import Flask, request, jsonify, session, send_from_directory

from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, AnonymousUserMixin, login_required

from flask_session import Session

import redis
import re
from openai import OpenAI
import os
from tasks import stream_gpt_response

import logging
from logging.handlers import RotatingFileHandler


from enum import Enum


# GuestUser


# Many-to-Many relationship table between User and Project



# Define a function to convert the messages into a string, including the keys


def pad_user_id(user_id, min_length=5, padding_char='0'):
    """Pad the user ID to meet a minimum length."""
    return str(user_id).rjust(min_length, padding_char)