#__init__.py
from flask import Flask
from pymongo import MongoClient
from flask_cors import CORS  # Import CORS
import os

# Initialize the Flask application
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load MongoDB URI from .env or config.py
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)

# Database and collection setup
db = client['banking_db']
accounts_collection = db['accounts']

# Import routes after initializing the app
from app.routes import *
