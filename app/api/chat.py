from flask import Blueprint, request, flash, redirect, url_for
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
import os

from .. import logger
from ..server.models import ChatGroup, Message
from ..server import db

chat = Blueprint('chat', __name__, url_prefix='/chat')

@chat.route('/create', methods=['POST'])
@login_required
def create_form():
    chat_group_name = request.form.get('group-name')
    chat_group = ChatGroup.query.filter_by(name=chat_group_name, creator=current_user.username).first()
    file = request.files.get('image-file')
    if chat_group:
        flash('The chat group already exists!', category='error')
    else:
        filename = secure_filename(file.filename)
        file.save(os.path.join('app/client/static/files/', filename))
        chat_group = ChatGroup(name=chat_group_name, creator=current_user.username, image_path=filename)
        # necessary idk why but dont remove
        chat_group.members = ''
        chat_group.members += current_user.username + ','
        current_user.chat_groups += chat_group.name + ','
        db.session.add(chat_group)
        db.session.commit()
    # redirect the user to the previous url (most likely /chat)
    # because this route just creates a new chat group
    return redirect(request.referrer)

@chat.route('/send', methods=['POST'])
@login_required
def send():
    # this route is here for code readability, it does nothing but redirect the user to the current chat group
    # all the logic for sending messages and saving them is in server/events.py
    current_chat_group = request.form.get('current-chat-group')
    return redirect(url_for('views.group', id=current_chat_group))

@chat.route('/message/edit/<id>', methods=['POST'])
@login_required
def edit_message(id):
    message = Message.query.filter_by(id=id).first()
    message.content = request.form.get('message')
    db.session.commit()
    return redirect(request.referrer)

@chat.route('/message/delete/<id>', methods=['POST'])
@login_required
def delete_message(id):
    Message.query.filter_by(id=id).delete()
    db.session.commit()
    return redirect(request.referrer)