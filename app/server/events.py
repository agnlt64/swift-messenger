from . import socketio
from .models import Message
from . import db
from .. import logger

@socketio.on('connect')
def handle_connection():
    logger.disable_file_logging()
    logger.info('Client connected')

@socketio.on('message')
def handle_message(message: str, chat_group_id: int, current_user: str):
    # we need to pass the current user because the user is not logged in anymore when this function is called
    # I think it is due to the AJAX loading but I'm not sure
    if message != '':
        new_message = Message(sender=current_user, content=message, chat_group=chat_group_id)
        db.session.add(new_message)
        db.session.commit()
