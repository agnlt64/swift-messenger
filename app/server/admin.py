from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import current_user, login_required
from . import db
from .models import Task, User

admin = Blueprint('admin', __name__)

@admin.route('/admin')
@login_required
def admin_page():
    if current_user.username != 'antonin':
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