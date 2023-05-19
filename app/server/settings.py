from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from . import db
import os

settings = Blueprint('settings', __name__)

@settings.route('/settings')
@login_required
def settings_page():
    return render_template('settings/settings.html', profile_picture=current_user.profile_picture, user=current_user.username)

@settings.route('/settings/update/pp', methods=['POST', 'GET'])
@login_required
def update_profile_picture():
    if request.method == 'POST':
        image = request.files.get('image-file')
        image_name = secure_filename(image.filename)
        image.save(os.path.join('app/static/files/pp', image_name))
        current_user.profile_picture = f'files/pp/{image_name}'
        db.session.commit()
        return redirect(url_for('settings.settings_page'))
    return render_template('settings/profile_picture.html')

@settings.route('/settings/update/color-scheme', methods=['GET', 'POST'])
def update_color_scheme():
    return render_template('settings/color_scheme.html')