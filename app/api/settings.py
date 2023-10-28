from flask import Blueprint, redirect, url_for, request, flash
from flask_login import current_user
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

import base64
import json

from ..server import db
from ..utils import sm_parse_raw_image, sm_save_file
from .. import logger, UPLOAD_PREFIX

settings = Blueprint('settings', __name__, url_prefix='/settings')

@settings.route('/update/profile-picture', methods=['POST'])
def update_profile_picture():
    raw_data = json.loads(request.data.decode('utf-8'))
    image_data = sm_parse_raw_image(raw_data)
    filename = secure_filename(image_data[0])
    file_content = base64.b64decode(image_data[1])
    sm_save_file(UPLOAD_PREFIX + 'pp/' + filename, file_content)
    current_user.profile_picture = f'files/pp/{filename}'
    db.session.commit()
    flash('Profile picture updated successfully!', category='success')
    return redirect(url_for('views.settings_page'))

@settings.route('/update/password', methods=['POST'])
def update_password():
    raw_credentials = json.loads(request.data.decode('utf-8'))
    old_password = base64.b64decode(raw_credentials['old_password']).decode('utf-8')
    new_password = base64.b64decode(raw_credentials['new_password']).decode('utf-8')
    confirm_new_password = base64.b64decode(raw_credentials['confirm_new_password']).decode('utf-8')
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