from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import current_user, login_required, login_user
from werkzeug.security import generate_password_hash
from . import db
from .models import Task, User
import datetime

admin = Blueprint('admin', __name__)

roles_available = [
    'admin',
    'user',
    'banned'
]

@admin.route('/admin')
@login_required
def admin_page():
    if current_user.role != 'admin':
        return redirect(url_for('views.chat'))
    return render_template('admin/admin.html', profile_picture=current_user.profile_picture)

@admin.route('/admin/dashboard')
@login_required
def dashboard():
    total_users = 0
    for user in User.query.all():
        total_users += 1
    return render_template('admin/dashboard.html', total_users=total_users, users=User.query.all())

@admin.route('/admin/team')
@login_required
def team():
    return render_template('admin/team.html')

@admin.route('/admin/todolist')
@login_required
def todolist():
    return render_template('admin/todolist.html', all_tasks=Task.query.all())

@admin.route('/admin/todolist/add', methods=['POST'])
@login_required
def add_todolist():
    name = request.form.get('name')
    task = Task(name=name)
    db.session.add(task)
    db.session.commit()
    return redirect(url_for('admin.todolist'))

@admin.route('/admin/todolist/delete/<id>', methods=['POST'])
@login_required
def delete_task(id):
    Task.query.filter_by(id=id).delete()
    db.session.commit()
    return redirect(url_for('admin.todolist'))

@admin.route('/admin/todolist/update/<id>', methods=['POST'])
@login_required
def update_task(id):
    task_to_update = Task.query.filter_by(id=id).first()
    new_name = request.form.get('new-name')
    task_to_update.name = new_name
    db.session.commit()
    return redirect(url_for('admin.todolist'))

@admin.route('/admin/update/role/<id>', methods=['POST'])
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
    return redirect(url_for('admin.admin_page'))

@admin.route('/admin/create-user', methods=['POST'])
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
    return redirect(url_for('admin.admin_page'))