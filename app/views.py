from flask import Blueprint, render_template, request, flash
from flask_login import login_required, current_user

from . import db
from .models import ChatGroup

views = Blueprint('views', __name__)

@views.get('/')
def index():
    return render_template('index.html')

@views.route('/chat/', methods=['GET', 'POST'])
@login_required
def chat():
    if request.method == 'POST':
        chat_group_name = request.form.get('room-name')
        chat_group = ChatGroup.query.filter_by(user=current_user).first()
        if chat_group:
            flash('The chat group already exists!')
        else:
            chat_group = ChatGroup(name=chat_group_name, user=current_user.username)
            db.session.add(chat_group)
            db.session.commit()
    return render_template('chat.html', user=current_user)