from flask import Blueprint, request, flash, redirect
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
import json

from .. import logger, UPLOAD_PREFIX
from ..utils import sm_parse_raw_image, sm_save_file
from ..server.models import ChatGroup, Message
from ..server import db

chat = Blueprint('chat', __name__, url_prefix='/chat')

@chat.route('/create', methods=['POST'])
@login_required
def create_form():
    raw_data = json.loads(request.data.decode('utf-8'))
    chat_group_name = raw_data['name']
    chat_group = ChatGroup.query.filter_by(name=chat_group_name, creator=current_user.username).first()
    img_data = sm_parse_raw_image(raw_data)
    unsecure_file_name = img_data[0]
    file_content = img_data[1]
    if chat_group:
        flash('The chat group already exists!', category='error')
    else:
        filename = secure_filename(unsecure_file_name)
        sm_save_file(UPLOAD_PREFIX + filename, file_content)
        chat_group = ChatGroup(name=chat_group_name, creator=current_user.username, image_path=filename)
        # necessary idk why but dont remove
        chat_group.members = ''
        chat_group.members += current_user.username + ','
        current_user.chat_groups += chat_group.name + ','
        db.session.add(chat_group)
        db.session.commit()
        flash('New chat group created!', category='success')
    # redirect the user to the previous url (most likely /chat)
    # because this route just creates a new chat group
    return redirect(request.referrer)

@chat.route('/send', methods=['POST'])
@login_required
def send():
    # this route is here for code readability, it does nothing but redirect the user to the current chat group
    # all the logic for sending messages and saving them is in server/events.py
    return redirect(request.referrer)

@chat.route('/message/edit/<id>', methods=['POST'])
@login_required
def edit_message(id):
    raw_value = json.loads(request.data.decode('utf-8'))
    message = Message.query.filter_by(id=id).first()
    message.content = raw_value['message']
    db.session.commit()
    return redirect(request.referrer)

@chat.route('/message/delete/<id>', methods=['POST'])
@login_required
def delete_message(id):
    Message.query.filter_by(id=id).delete()
    db.session.commit()
    return redirect(request.referrer)