from . import socketio
from datetime import datetime
from .models import Message
from flask_login import current_user
from . import db

@socketio.on('connect')
def handle_connection():
    date = datetime.now()
    print(f'client connected the {date.day}/{date.month}/{date.year} at {date.hour}:{date.minute}')

@socketio.on('message')
def handle_message(message: str, chat_group_id: int):
    print(f'received data from client javascript: {chat_group_id}')
    new_message = Message(sender=current_user.username, chat_group=chat_group_id, content=message)
    db.session.add(new_message)
    db.session.commit()
