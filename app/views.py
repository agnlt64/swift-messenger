from flask import Blueprint, render_template
from flask_login import login_required, current_user

views = Blueprint('views', __name__)

@views.get('/')
def index():
    return render_template('index.html')

@views.get('/chat/')
@login_required
def chat():
    return render_template('chat.html', user=current_user)