from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from .models import ChatGroup, Message, User
from . import db
import os

views = Blueprint('views', __name__)

@views.get('/')
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
    return render_template('htmx/create_group.html', user=current_user.username, groups=ChatGroup.query.all())

@views.route('/group/<id>')
@login_required
def group(id):
    group = ChatGroup.query.filter_by(id=id).first()
    if group:
        return render_template('htmx/send_message.html', messages=Message.query.all(), user=current_user.username, group=group)
    else:
        return 'An error occurred bruh'

@views.route('/send-message', methods=['POST'])
@login_required
def send_message():
    return render_template('htmx/message.html', messages=Message.query.all(), user=current_user.username)

@views.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

@views.route('/update/pp', methods=['POST'])
@login_required
def update_profile_picture():
    return redirect(url_for('views.settings'))

@views.route('/admin')
@login_required
def admin():
    if current_user.username != 'antonin':
        return redirect(url_for('views.chat'))
    return render_template('admin/admin.html', profile_picture=current_user.profile_picture)

@views.route('/dashboard')
@login_required
def dashboard():
    total_users = 0
    for user in User.query.all():
        total_users += 1
    return render_template('admin/dashboard.html', total_users=total_users, users=User.query.all())

@views.route('/team')
@login_required
def team():
    return render_template('admin/team.html')