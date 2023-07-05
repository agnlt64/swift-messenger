from flask_login import LoginManager
import secrets
import os

from .server import db
from .server import app

def create_app():
    from .server.auth import auth
    from .views import views
    from .server.settings import settings
    from .server.admin import admin
    from .server.models import User, ChatGroup, Message, Task
    
    app.config['SECRET_KEY'] = secrets.token_urlsafe(40)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    # Render error, fix later
    # try:
    #     with open('.config', 'r') as config_file:
    #         app.config['SQLALCHEMY_DATABASE_URI'] = config_file.read().split('\n')[0]
    # except FileNotFoundError:
    #     app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    db.init_app(app)

    login_manager = LoginManager(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'error'

    try:
        os.mkdir('app/static/files/')
        os.mkdir('app/static/files/pp')
    except FileExistsError:
        pass
    with app.app_context():
        db.create_all()

    @login_manager.user_loader
    def load_user(id: int):
        return User.query.get(id)

    app.register_blueprint(auth)
    app.register_blueprint(views)
    app.register_blueprint(settings)
    app.register_blueprint(admin)
    
    return app