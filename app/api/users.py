from flask import Blueprint, request, redirect, url_for
import json

from ..server.models import User
from .. import db

users = Blueprint('users', __name__, url_prefix='/users')

@users.route('/all')
def get_all_users():
    all_users_models = User.query.all()
    all_users = []
    for user in all_users_models:
        all_users.append({
            'id': user.id,
            'name': user.username,
            'role': user.role,
            'profile_picture': user.profile_picture,
            'chat_groups': user.chat_groups,
            'join_date': user.join_date
        })
    return json.dumps(all_users)

@users.route('/member/<name>')
def get_user_by_name(name):
    return User.query.filter_by(name=name).first()

@users.route('/delete/<name>', methods=['DELETE'])
def delete_user(name):
    User.query.filter_by(username=name).delete()
    db.session.commit()
    return redirect(url_for(request.referrer))
    