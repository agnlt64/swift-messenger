from flask import Blueprint, request, render_template, flash, redirect, url_for
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
import os

from ..server.models import ChatGroup, Message
from ..server import db

chat = Blueprint('chat', __name__, url_prefix='/chat')

@chat.route('/create', methods=['POST'])
@login_required
def create_form():
    chat_group_name = request.form.get('room-name')
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
    return render_template('messages/create_group.html', user=current_user.username, groups=ChatGroup.query.all())

@chat.route('/send', methods=['POST'])
@login_required
def send():
    current_chat_group = request.form.get('current-chat-group')
    sent_message = request.form.get('message')
    print(sent_message)
    if sent_message != '':
        new_message = Message(sender=current_user.username, content=sent_message, chat_group=current_chat_group)
        db.session.add(new_message)
        db.session.commit()
    return redirect(url_for('views.group', id=current_chat_group))
    # return render_template('messages/message.html', messages=Message.query.all(), current_chat_group=current_chat_group)