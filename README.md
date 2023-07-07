# SwiftMessengr

You can access SwiftMessengr here: [swiftmessengr.com](swiftmessengr.com). Be careful, every info that you may enter will probably erased since this app is in its early stage of development.

## Warning
In order to run properly, the app needs a config file named `.config` in the root directory of the app (`app/.config`) containing the PostgreSQL URL of your database. If the app doesn't find the config file, it will look for the `DATABASE_URL` environment variable, which should also be containing a PostreSQL URL. Not doing one of the above will result in a crash and the app will simply not run. Howerver, this feature is currently disabled and the database will be created at the root of the app in `instance/db.sqlite3`

## Dependencies
The app needs `flask`, `flask-login`, `flask-socketio` and `flask-sqlalchemy` to work properly. In the `requirements.txt` file, the `flask` version is 2.2.5, which is not the latest, to avoid problems with Render, the hosting platform for this project. It is the same thing for `Werkzeug` (a `flask` dependency), the version is 2.2.3 to avoid problems. You need to manually change the `Werkzeug` version since it is automatically installed with `flask`.

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