Environment Variables you will need.
Create a .env file (make sure you have python-dotenv installed)
Below are the sample environment variables you will need.
Once you have these and have installed the dependencies in requirements.txt, you can run flash run --debug to start the server.

To run the frontend code: use npm run start while in the react_app folder. This is assuming you installed everything already in package.json

REDIS_URL="redis://localhost:6379"
SECRET_KEY="secret_key"
DATABASE_URL="postgresql://localhost:5432"
OPENAI_API_KEY="not-needed"
APP_SETTINGS="config.DevelopmentConfig"
FLASK_ENV=development
FLASK_RUN_PORT=8000