from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_socketio import SocketIO, send
from flask_login import LoginManager
from os import path
import secrets

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

db = SQLAlchemy()
DB_NAME = 'database.sqlite3'

@socketio.on('message')
def handle_message(message: str):
    send(message, broadcast=True)

def create_app():
    from .auth import auth
    from .views import views
    from .models import User
    
    app.config['SECRET_KEY'] = secrets.token_urlsafe(40)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)
    
    if not path.exists(f'instance/{DB_NAME}'):
        with app.app_context():
            db.create_all()
        
    login_manager = LoginManager(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'error'
    
    @login_manager.user_loader
    def load_user(id: int):
        return User.query.get(id)
        
    app.register_blueprint(auth)
    app.register_blueprint(views)
    
    return app, socketio