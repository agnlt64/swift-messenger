from flask import Blueprint, redirect, url_for, request, flash
from flask_login import current_user
from werkzeug.utils import secure_filename
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