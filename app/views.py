from flask import Blueprint, render_template, request, flash
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from .server.models import ChatGroup, Message
from .server import db
import os

views = Blueprint('views', __name__)

@views.route('/')
def index():
    return render_template('index.html')

@views.route('/chat')
@login_required
def chat():
    return render_template('chat.html', user=current_user.username, groups=ChatGroup.query.all(), profile_picture=str(current_user.profile_picture))

@views.route('/create-form', methods=['POST'])
@login_required
def create_form():
    if request.method == 'POST':
        chat_group_name = request.form.get('room-name')
        chat_group = ChatGroup.query.filter_by(name=chat_group_name, creator=current_user.username).first()
        file = request.files.get('image-file')
        if chat_group:
            flash('The chat group already exists!', category='error')
        else:
            filename = secure_filename(file.filename)
            file.save(os.path.join('app/static/files/', filename))
            chat_group = ChatGroup(name=chat_group_name, creator=current_user.username, image_path=filename)
            current_user.chat_groups += chat_group.name + ','
            db.session.add(chat_group)
            db.session.commit()
    return render_template('messages/create_group.html', user=current_user.username, groups=ChatGroup.query.all())

@views.route('/group/<id>')
@login_required
def group(id):
    group = ChatGroup.query.filter_by(id=id).first()
    if group:
        return render_template('messages/send_message.html', messages=Message.query.all(), user=current_user.username, group=group)
    else:
        return 'An error occurred bruh'

@views.route('/send-message', methods=['POST'])
@login_required
def send_message():
    return render_template('messages/message.html', messages=Message.query.all(), user=current_user.username)