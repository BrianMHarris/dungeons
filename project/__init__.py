from flask import Flask
from flask_modus  import Modus
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__)


# settings for Flask to connect to postgres
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://localhost/dungeons-database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# allows user to use their session
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

csrf = CSRFProtect(app)
modus = Modus(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
# redirect the user if they try to access a private route
login_manager.login_view = "users.login"
login_manager.login_message = "Please log in."

# import and register blueprints for our resources
from project.users.views import users_blueprint
app.register_blueprint(users_blueprint, url_prefix='/users')

@app.route('/')
def root():
    return "Go home, you're drunk"

from project.models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
