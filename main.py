from app import create_app

if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(app, debug=True, host='127.0.0.1', port='8080')