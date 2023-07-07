from flask import Blueprint, request, render_template, flash
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
import os

from ..server.models import ChatGroup, Message, User
from ..server import db

current_chat_group = 'unset'

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

@chat.route('/group/<id>')
@login_required
def group(id):
    group = ChatGroup.query.filter_by(id=id).first()
    global current_chat_group
    current_chat_group = group.id
    if group:
        names = group.members.split(',')[:-1]
        members = [User.query.filter_by(username=name).first() for name in names]
        return render_template('messages/send_message.html', messages=Message.query.all(), user=current_user, group=group, members=members)
    else:
        # this can't be reached
        return 'Congrats! You triggered an ureachable error message!'

@chat.route('/send', methods=['POST'])
@login_required
def send():
    global current_chat_group
    return render_template('messages/message.html', message=Message.query.order_by(Message.id.desc()).first(), user=current_user, current_chat_group=current_chat_group)