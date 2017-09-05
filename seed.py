""" Seeds initial data """

from project.models import User, Game, Genre
from project import db

if __name__ == "__main__":
    """ SEED initial data for the databases """

    # Users
    User.query.delete()
    user = User("Brian", "dood@gmang.com", "1234")
    db.session.add(user)
    db.session.commit()
    print("SEED: Users")

    # GENRES
    Genre.query.delete()
    rpg = Genre("RPG")
    puzzle = Genre("Puzzle")
    db.session.add(rpg)
    db.session.add(puzzle)
    db.session.commit()
    print("SEED: Genres")

    # GAMES
    # may need to run Genre.query for the genres...or add them manually
    # instead of through __init__. in that case remove from init
    Game.query.delete()
    raid = Game("Raid!", "raid", "raid/raid.png", "RPG meets strategy in this never-ending monster murder simulator!")
    raid.genres.extend([rpg, puzzle])
    db.session.add(raid)
    db.session.commit()
    print("SEED: Games")
