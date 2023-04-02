from . import db
from flask_login import UserMixin
from sqlalchemy.types import UserDefinedType

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))

class ChatGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(150))
    name = db.Column(db.String(100), unique=True)
    image_path = db.Column(db.String(200))