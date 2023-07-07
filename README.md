# SwiftMessengr

You can access SwiftMessengr here: [swiftmessengr.com](swiftmessengr.com). Be careful, every info that you may enter will probably erased since this app is in its early stage of development.

## Warning
In order to run properly, the app needs a config file named `.config` in the root directory of the app (`app/.config`) containing the PostgreSQL URL of your database. If the app doesn't find the config file, it will look for the `DATABASE_URL` environment variable, which should also be containing a PostreSQL URL. Not doing one of the above will result in a crash and the app will simply not run. Howerver, this feature is currently disabled and the database will be created at the root of the app in `instance/db.sqlite3`

## Dependencies
The app needs `flask`, `flask-login`, `flask-socketio` and `flask-sqlalchemy` to work properly. In the `requirements.txt` file, the `flask` version is 2.2.5, which is not the latest, to avoid problems with Render, the hosting platform for this project. It is the same thing for `Werkzeug` (a `flask` dependency), the version is 2.2.3 to avoid problems. You need to manually change the `Werkzeug` version since it is automatically installed with `flask`. You will have to change the versions each time you run the `pip freeze` command.

## API
The API available for this application is very simple. All the routes begin with `/api`, e.g `/api/auth/login`.  
All available endpoints:  
```
# Authentication API
/api/auth/login -> checks the user credentials and login
/api/auth/sign-up -> registers an user in the database and automatically logs the user in

# Admin API
/api/admin/todolist/add -> adds a task in the admin todolist
/api/admin/todolist/delete/<task id> -> deletes a task with its unique id
/api/admin/todolist/update/<task id> -> updates a task with its unique id
/api/admin/update/role/<user id> -> updates the role of the user with its unique id
/api/admin/create/user -> creates an user within the admin interface

# Chat API
/api/chat/create -> creates a new chat group
/api/chat/group/<chat id> -> accesses a chat group with its unique id
/api/chat/send -> sends a message

# Settings API
/api/settings/update/profile-picture -> updates the profile picture of the current user (no need to specify the unique id)
```

## Run on macOS/Linux
```console
git clone https://github.com/ABFStudio/swift-messenger.git
cd chat-app
python3 -m venv .env
source .env/bin/activate
pip install -r requirements.txt
python main.py
```

## Run on Windows
```console
git clone https://github.com/ABFStudio/swift-messenger.git
cd chat-app
python -m venv .env
.env\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```