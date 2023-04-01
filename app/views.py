from flask import Blueprint, render_template, request, flash
from flask_login import login_required, current_user
from .models import ChatGroup
from . import db

views = Blueprint('views', __name__)

@views.get('/')
def index():
    return render_template('index.html')

@views.route('/chat/', methods=['GET', 'POST'])
@login_required
def chat():
    if request.method == 'POST':
        chat_group_name = request.form.get('room-name')
        chat_group = ChatGroup.query.filter_by(name=chat_group_name).first()
        chat_group_picture = request.form.get('new-image')
        if chat_group:
            flash('The chat group already exists!', category='error')
        else:
            chat_group = ChatGroup(name=chat_group_name, user=current_user.username, image=chat_group_picture)
            db.session.add(chat_group)
            db.session.commit()
    return render_template('chat.html', user=current_user.username, groups=ChatGroup.query.all())