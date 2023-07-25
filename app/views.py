from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user, logout_user
from werkzeug.utils import secure_filename
from .server.models import ChatGroup, Task, User, Message
from .server import db
import os

# client views only, logic is in the api folder
views = Blueprint('views', __name__)

current_chat_group = 'unset'

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

# display the page when a user clicks on a chat group
@views.route('/chat/group/<id>')
@login_required
def group(id):
    group = ChatGroup.query.filter_by(id=id).first()
    global current_chat_group
    current_chat_group = group.id
    if group:
        names = group.members.split(',')[:-1]
        members = [User.query.filter_by(username=name).first() for name in names]
        # a lot of parameters since send_message inherits from chat.html 
        # and we need to pass the parameters to chat.html via this render_template call
        # because the page is re-rendered
        return render_template('messages/send_message.html', messages=Message.query.all(), 
                               user=current_user, group=group, members=members, 
                               groups=ChatGroup.query.all(), profile_picture=str(current_user.profile_picture),
                               active='active', current_chat_group=current_chat_group)
    else:
        # this can't be reached
        return 'Congrats! You triggered an ureachable error message!'

@views.route('/login')
def login():
    return render_template('login.html')

@views.route('/sign-up')
def sign_up():
    return render_template('signup.html')

@views.route('/logout')
@login_required
def logout():
    flash('Logged out successfully!', category='success')
    logout_user()
    return redirect(url_for('views.login'))

@views.route('/admin')
@login_required
def admin_page():
    if current_user.role != 'admin':
        return redirect(url_for('views.chat'))
    return render_template('admin/admin.html', profile_picture=current_user.profile_picture)

@views.route('/admin/dashboard')
@login_required
def dashboard():
    total_users = 0
    for _ in User.query.all():
        total_users += 1
    return render_template('admin/dashboard.html', total_users=total_users, users=User.query.all())

@views.route('/admin/team')
@login_required
def team():
    return render_template('admin/team.html')

@views.route('/admin/todolist')
@login_required
def todolist():
    return render_template('admin/todolist.html', all_tasks=Task.query.all())

@views.route('/settings')
@login_required
def settings_page():
    return render_template('settings/profile_picture.html')

@views.route('/settings/profile-picture')
@login_required
def profile_picture():
    print('profile picture page')
    return render_template('settings/profile_picture.html')

@views.route('/settings/color-scheme')
def color_scheme():
    return render_template('settings/color_scheme.html')

@views.route('/settings/username')
@login_required
def username():
    return render_template('settings/username.html')

@views.route('/settings/password')
@login_required
def password():
    return render_template('settings/password.html')