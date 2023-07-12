from flask import Blueprint, redirect, url_for, request, flash
from flask_login import current_user
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from ..server import db
from ..server.models import User
import os

settings = Blueprint('settings', __name__, url_prefix='/settings')

@settings.route('/update/profile-picture', methods=['POST'])
def update_profile_picture():
    image = request.files.get('image-file')
    image_name = secure_filename(image.filename)
    image.save(os.path.join('app/client/static/files/pp', image_name))
    current_user.profile_picture = f'files/pp/{image_name}'
    db.session.commit()
    flash('Profile picture updated successfully!', category='success')
    return redirect(url_for('views.settings_page'))

@settings.route('/update/username', methods=['POST'])
def update_username():
    new_name = request.form.get('username')
    user = User.query.filter_by(username=new_name).first()
    if user:
        flash('Username already taken', category='error')
    else:
        current_user.username = new_name
        db.session.commit()
        flash('Username updated successfully!', category='success')
    return redirect(url_for('views.username'))

@settings.route('/update/password', methods=['POST'])
def update_password():
    old_password = request.form.get('old-password')
    new_password = request.form.get('new-password')
    confirm_new_password = request.form.get('confirm-new-password')
    if check_password_hash(current_user.password, old_password):
        if len(new_password) < 10:
            flash('Your password must be at least 10 characters long!', category='error')
        elif new_password != confirm_new_password:
            flash('Passwords do not match!', category='error')
        else:
            current_user.password = generate_password_hash(new_password)
            db.session.commit()
            flash('Password updated successfully!', category='success')
    else:
        flash('Current password is incorrect!', category='error')
    return redirect(url_for('views.password'))