from flask import Blueprint, redirect, url_for, request, flash
from flask_login import login_required, login_user
from werkzeug.security import generate_password_hash

from ..server import db
from ..server.models import Task, User

import datetime
import json

admin = Blueprint('admin', __name__, url_prefix='/admin')

roles_available = [
    'admin',
    'user',
    'banned'
]

@admin.route('/todolist/add', methods=['POST'])
@login_required
def add_todolist():
    raw_data = json.loads(request.data.decode('utf-8'))
    name = raw_data['task_name']
    description = raw_data['task_description']
    priority = raw_data['priority']
    task = Task(name=name, description=description, priority=priority)
    db.session.add(task)
    db.session.commit()
    return redirect(url_for('views.todolist'))

@admin.route('/todolist/delete/<id>', methods=['POST'])
@login_required
def delete_task(id):
    Task.query.filter_by(id=id).delete()
    db.session.commit()
    return redirect(url_for('views.todolist'))

@admin.route('/todolist/update/<id>', methods=['POST'])
@login_required
def update_task(id):
    task_to_update = Task.query.filter_by(id=id).first()
    raw_data = json.loads(request.data.decode('utf-8'))
    new_name = raw_data['task_name']
    new_description = raw_data['task_description']
    new_priority = raw_data['priority']
    task_to_update.name = new_name
    task_to_update.description = new_description
    task_to_update.priority = new_priority
    db.session.commit()
    return redirect(url_for('views.todolist'))

@admin.route('/update/role/<id>', methods=['POST'])
@login_required
def update_role(id):
    user = User.query.filter_by(id=id).first()
    role = request.form.get('role')
    if role not in roles_available:
        flash(f'Role {role} does not exist!', category='error')
        return redirect(url_for('admin.admin_page'))
    user.role = request.form.get('role')
    db.session.commit()
    flash(f'User {user.username} is now {user.role}!', category='success')
    return redirect(url_for('views.admin_page'))

@admin.route('/create/user', methods=['POST'])
@login_required
def create_user():
    username = request.form.get('name')
    password = request.form.get('password')
    confirm = request.form.get('password')
    user = User.query.filter_by(username=username).first()
    if user:
        flash('User already exists!', category='error')
    elif len(username) < 2:
            flash('Your name must be at least 2 characters!', category='error')
    elif len(password) < 10 and password != 'admin':
        flash('Your password must be at least 10 characters long!', category='error')
    elif password != confirm:
        flash('Passwords do not match!', category='error')
    else:
        now = datetime.datetime.now()
        if now.month < 10:
            month = '0' + str(now.month)
        else:
            month = now.month
        new_user = User(username=username, password=generate_password_hash(password, method='sha256'), profile_picture='media/default.png', join_date=f'{now.day}/{month}/{now.year}')
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user, remember=True)
        flash('Account created!', category='success')
    return redirect(url_for('views.admin_page'))