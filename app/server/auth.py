from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
import datetime
from . import db

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                return redirect(url_for('views.chat'))
            else:
                flash('Incorrect password!', category='error')
        else:
            flash('User not found!', category='error')
    return render_template('login.html')


@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        confirm = request.form.get('confirm')
        user = User.query.filter_by(username=username).first()
        if user:
            flash('Username already taken!', category='error')
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
            return redirect(url_for('views.chat'))
    return render_template('signup.html')


@auth.route('/logout')
@login_required
def logout():
    flash('Logged out successfully!', category='success')
    logout_user()
    return redirect(url_for('auth.login'))