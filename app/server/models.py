from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    chat_groups = db.Column(db.String(10_000_000), default='')
    profile_picture = db.Column(db.String(200), default='media/default.png')
    role = db.Column(db.String(), nullable=False, default='user')
    join_date = db.Column(db.String(20))

class ChatGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator = db.Column(db.String(150))
    name = db.Column(db.String(100))
    image_path = db.Column(db.String(200))

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(150))
    # the chat group containing the message
    # nullable is True for now but will be False soon
    chat_group = db.Column(db.Integer, nullable=True)
    content = db.Column(db.String(1000), nullable=False, default='')

class Task(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(150))