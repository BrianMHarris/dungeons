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

GameGenre = db.Table('game_genres',
                    db.Column('id',
                            db.Integer,
                            primary_key=True),
                    db.Column('game_id',
                            db.Integer,
                            db.ForeignKey('games.id', ondelete="cascade")),
                    db.Column('genre_id',
                            db.Integer,
                            db.ForeignKey('genres.id', ondelete="cascade")))

class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, unique=True)
    image_url = db.Column(db.Text)
    genre = db.relationship("Genre",
                            secondary=GameGenre,
                            backref=db.backref('games'))
    description = db.Column(db.Text)

class Genre(db.Model):
    __tablename__ = 'genres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True)
