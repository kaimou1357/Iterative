FROM python:3.9.18 as base
# Base image to be reused
RUN apt-get update
WORKDIR /usr/src/app
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
ENV FLASK_ENV="docker"
EXPOSE 5000

FROM base as debug
# Debug image reusing the base
# Install dev dependencies for debugging
RUN pip install debugpy
# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

FROM base as prod
# Production image
RUN pip install gunicorn
COPY . .
CMD ["gunicorn", "--reload", "--bind", "0.0.0.0:8000", "app:create_app()"]