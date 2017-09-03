from project import db, bcrypt
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'


    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    email = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    image_url = db.Column(db.Text)

    def __init__(self, email, username, password):
        self.username = username
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('UTF-8')
