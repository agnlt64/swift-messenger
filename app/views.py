from flask import Blueprint, render_template, request, flash, redirect, url_for, send_from_directory
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from .models import ChatGroup, Message
from . import db
import os

views = Blueprint('views', __name__)

@views.get('/')
def index():
    return render_template('index.html')

@views.route('/chat')
@login_required
def chat():
    return render_template('chat.html', user=current_user.username, groups=ChatGroup.query.all())

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
    return render_template('htmx/create_group.html', user=current_user.username, groups=ChatGroup.query.all())

@views.route('/group/<id>')
def group(id):
    group = ChatGroup.query.filter_by(id=id).first()
    if group:
        return render_template('htmx/send_message.html', messages=Message.query.all(), user=current_user.username, group=group)
    else:
        return 'An error occurred bruh'

@views.route('/send-message', methods=['POST'])
def send_message():
    return render_template('htmx/message.html', messages=Message.query.all(), user=current_user.username)