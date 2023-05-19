from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='../templates', static_folder='../static')
socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy()