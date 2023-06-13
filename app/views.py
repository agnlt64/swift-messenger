from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from .server.models import ChatGroup, Message, User
from .server import db
import os

current_chat_group = 'unset'

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('index.html')

@views.route('/chat')
@login_required
def chat():
    if current_user.role == 'banned':
        flash('You have been banned. Contact the admin to get further informations.', category='error')
        return redirect(url_for('views.home'))
    return render_template('chat.html', user=current_user, groups=ChatGroup.query.all(), profile_picture=str(current_user.profile_picture))

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
            # necessary idk why but dont remove
            chat_group.members = ''
            chat_group.members += current_user.username + ','
            current_user.chat_groups += chat_group.name + ','
            db.session.add(chat_group)
            db.session.commit()
    return render_template('messages/create_group.html', user=current_user.username, groups=ChatGroup.query.all())

@views.route('/group/<id>')
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

@views.route('/send-message', methods=['POST'])
@login_required
def send_message():
    global current_chat_group
    print(current_chat_group)
    return render_template('messages/message.html', message=Message.query.order_by(Message.id.desc()).first(), user=current_user, current_chat_group=current_chat_group)