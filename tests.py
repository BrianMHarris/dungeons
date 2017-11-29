from project import app, db
from project.models import User, Game, Genre
from flask_testing import TestCase
import unittest
from flask_wtf.csrf import generate_csrf

class BaseTestCase(TestCase):

    def create_app(self):
      """use SQLite3 for testing since it's faster than using larger postgres DB"""
      app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///testing.db'
      return app

    def setUp(self):
        """create all the dummy data we'll need"""
        db.create_all()
        user = User("ExplodedZombie", "brianharrisdesign@gmail.com", "P@nd@$")
        db.session.add(user)
        rpg = Genre("RPG")
        puzzle = Genre("Puzzle")
        db.session.add(rpg)
        db.session.add(puzzle)
        raid = Game("Raid!", "ExplodedZombie", "raid", "raid.png", "RPG meets strategy in this never-ending monster murder simulator!", "2017-09-06")
        raid.genres.extend([rpg, puzzle])
        db.session.commit()

    def tearDown(self):
        db.drop_all()

    def test_index(self):
        """make sure the main page responds correctly"""
        response = self.client.get('/home/', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_show(self):
        """test viewing a profile"""
        response = self.client.get('/users/1/', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_create(self):
        """ test creating a new user """
        response = self.client.post('/users/signup', data=dict(username="TestName", email="test@test.com",
                                      password="test", password_confirm="test"))
        self.assertIn(b'TestName', response.data)

if __name__ == '__main__':
    unittest.main()
