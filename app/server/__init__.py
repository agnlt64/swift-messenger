from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='../client/templates', static_folder='../client/static')
socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy()