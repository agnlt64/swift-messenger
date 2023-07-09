from flask_login import LoginManager
import secrets
import os

from .server import db
from .server import app

def create_app():
    from .views import views
    from .api import api
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
    login_manager.login_view = 'views.login'
    login_manager.login_message_category = 'error'

    try:
        os.mkdir('app/client/static/files/')
        os.mkdir('app/client/static/files/pp')
    except FileExistsError:
        pass

    create_database('db.sqlite3')

    @login_manager.user_loader
    def load_user(id: int):
        return User.query.get(id)

    app.register_blueprint(api)
    app.register_blueprint(views)
    
    return app

def create_database(db_name):
    if not os.path.exists(f'instance/{db_name}'):
        with app.app_context():
            db.create_all()