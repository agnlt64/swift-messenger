from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    chat_groups = db.Column(db.String(10_000_000), default='')

class ChatGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator = db.Column(db.String(150))
    name = db.Column(db.String(100))
    image_path = db.Column(db.String(200))

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(150))
    # the chat group containing the message
    chat_group = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(1000), nullable=False, default='')