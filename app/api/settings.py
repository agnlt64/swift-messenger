from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from ..server import db
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