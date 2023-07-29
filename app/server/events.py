from . import socketio
from datetime import datetime
from .models import Message
from flask_login import current_user
from . import db
from .. import logger, LogLevel

@socketio.on('connect')
def handle_connection():
    logger.set_level(LogLevel.Info)
    logger.log('Client connected')

@socketio.on('message')
def handle_message(message: str, chat_group_id: int):
    new_message = Message(sender=current_user.username, content=message, chat_group=chat_group_id)
    if message != '':
        db.session.add(new_message)
        db.session.commit()
