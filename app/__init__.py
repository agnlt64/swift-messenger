from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_login import LoginManager
import secrets
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

db = SQLAlchemy()
DB_NAME = 'database.sqlite3'

def create_app():
    from .auth import auth
    from .views import views
    from .models import User, ChatGroup, Message, Task
    
    app.config['SECRET_KEY'] = secrets.token_urlsafe(40)
    try:
        with open('.config', 'r') as config_file:
            app.config['SQLALCHEMY_DATABASE_URI'] = config_file.read().split('\n')[0]
    except FileNotFoundError:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    db.init_app(app)
        
    login_manager = LoginManager(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'error'

    try:
        os.mkdir('app/static/files/')
    except FileExistsError:
        pass
    with app.app_context():
        db.create_all()

    @login_manager.user_loader
    def load_user(id: int):
        return User.query.get(id)

    app.register_blueprint(auth)
    app.register_blueprint(views)
    
    return app