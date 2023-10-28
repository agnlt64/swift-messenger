from flask import Blueprint, request, flash, redirect
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
import json
import base64

from .. import logger, UPLOAD_PREFIX
from ..utils import sm_parse_raw_image, sm_save_file
from ..server.models import ChatGroup, Message
from ..server import db

chat = Blueprint('chat', __name__, url_prefix='/chat')

@chat.route('/create', methods=['POST'])
@login_required
def create_group_form():
    raw_data = json.loads(request.data.decode('utf-8'))
    chat_group_name = raw_data['name']
    img_data = sm_parse_raw_image(raw_data)
    filename = secure_filename(img_data[0])
    file_content = base64.b64decode(img_data[1])
    chat_group = ChatGroup.query.filter_by(name=chat_group_name, creator=current_user.username).first()
    if chat_group:
        flash('The chat group already exists!', category='error')
    else:
        sm_save_file(UPLOAD_PREFIX + filename, file_content)
        new_chat_group = ChatGroup(name=chat_group_name, creator=current_user.username, image_path=filename)
        # necessary idk why but dont remove
        new_chat_group.members = ''
        new_chat_group.members += current_user.username + ','
        current_user.chat_groups += new_chat_group.name + ','
        db.session.add(new_chat_group)
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