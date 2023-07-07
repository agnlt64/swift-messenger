from flask import Blueprint
from .auth import auth
from .chat import chat
from .settings import settings
from .admin import admin

api = Blueprint('api', __name__, url_prefix='/api')

api.register_blueprint(auth)
api.register_blueprint(chat)
api.register_blueprint(admin)
api.register_blueprint(settings)