from flask import Blueprint, render_template, flash, redirect, url_for
from flask_login import login_required, current_user, logout_user
from .server.models import ChatGroup, Dev, User, Message, Task
from . import logger
from .utils import sm_priority_to_string

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
        logger.warning(f'{current_user.username} tried to access chat page while being banned')
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
                               user=current_user, group=group, current_chat_group=current_chat_group, members=members, 
                               groups=ChatGroup.query.all(), profile_picture=str(current_user.profile_picture),
                               active='active')
    else:
        # this can't be reached
        logger.enable_file_logging()
        logger.error(f'Unreachable error message has been reached by {current_user.username}')
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
    return redirect(url_for('views.moderation_page'))

@views.route('/admin/moderation')
@login_required
def moderation_page():
    return render_template('admin/moderation.html')

@views.route('/admin/team')
@login_required
def team_page():
    return render_template('admin/team.html', devs=Dev.query.all())

@views.route('/admin/todolist')
@login_required
def todolist():
    return render_template('admin/todolist.html', all_tasks=Task.query.all(), sm_priority_to_string=sm_priority_to_string)

@views.route('/settings')
@login_required
def settings_page():
    return render_template('settings/profile_picture.html')

@views.route('/settings/profile-picture')
@login_required
def profile_picture():
    return render_template('settings/profile_picture.html')

@views.route('/settings/color-scheme')
def color_scheme():
    return render_template('settings/color_scheme.html')

@views.route('/settings/password')
@login_required
def password():
    return render_template('settings/password.html')