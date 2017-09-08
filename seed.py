""" Seeds initial data """

from project.models import User, Game, Genre
from project import db

# wipes all data
def seed_none():
    # Users
    User.query.delete()
    # GENRES
    Genre.query.delete()
    # GAMES
    Game.query.delete()
    db.session.commit();
    print("seed_none: Complete")

def seed_all():
    # Users
    User.query.delete()
    user = User("ExplodedZombie", "brianharrisdesign@gmail.com", "P@nd@$")
    db.session.add(user)
    db.session.commit()
    print("seed_all: Users")

    # GENRES
    Genre.query.delete()
    rpg = Genre("RPG")
    puzzle = Genre("Puzzle")
    db.session.add(rpg)
    db.session.add(puzzle)
    db.session.commit()
    print("seed_all: Genres")

    # GAMES
    # may need to run Genre.query for the genres...or add them manually
    # instead of through __init__. in that case remove from init
    # extend adds references to the join table which in turn adds the model to the db session
    Game.query.delete()
    raid = Game("Raid!", "ExplodedZombie", "raid", "raid.png", "RPG meets strategy in this never-ending monster murder simulator!", "2017-09-06")
    raid.genres.extend([rpg, puzzle])
    game2 = Game("Game 2", "ExplodedZombie", "1", "", "Game 2", "2017-09-06")
    game2.genres.extend([rpg, puzzle])
    game3 = Game("Game 3", "ExplodedZombie", "2", "", "Game 3", "2017-09-06")
    game3.genres.extend([rpg, puzzle])
    game4 = Game("Game 4", "ExplodedZombie", "3", "", "Game 4", "2017-09-06")
    game4.genres.extend([rpg, puzzle])
    game5 = Game("Game 5", "ExplodedZombie", "4", "", "Game 5", "2017-09-06")
    game5.genres.extend([rpg, puzzle])
    game6 = Game("Game 6", "ExplodedZombie", "5", "", "Game 6", "2017-09-06")
    game6.genres.extend([rpg, puzzle])
    game7 = Game("Game 7", "ExplodedZombie", "6", "", "Game 7", "2017-09-06")
    game7.genres.extend([rpg, puzzle])
    game8 = Game("Game 8", "ExplodedZombie", "7", "", "Game 8", "2017-09-06")
    game8.genres.extend([rpg, puzzle])
    game9 = Game("Game 9", "ExplodedZombie", "8", "", "Game 9", "2017-09-06")
    game9.genres.extend([rpg, puzzle])
    game10 = Game("Game 10", "ExplodedZombie", "9", "", "Game 10", "2017-09-06")
    game10.genres.extend([rpg, puzzle])
    game11 = Game("Game 11", "ExplodedZombie", "10", "", "Game 11", "2017-09-06")
    game11.genres.extend([rpg, puzzle])
    db.session.commit()
    print("seed_all: Games")

def seed_final():
    User.query.delete()
    user = User("ExplodedZombie", "brianharrisdesign@gmail.com", "P@nd@$")
    db.session.add(user)
    db.session.commit()
    print("seed_all: Users")

    # GENRES
    Genre.query.delete()
    rpg = Genre("RPG")
    puzzle = Genre("Puzzle")
    db.session.add(rpg)
    db.session.add(puzzle)
    db.session.commit()
    print("seed_all: Genres")

    Game.query.delete()
    raid = Game("Raid!", "ExplodedZombie", "raid", "raid.png", "RPG meets strategy in this never-ending monster murder simulator!", "2017-09-06")
    raid.genres.extend([rpg, puzzle])
    db.session.add(raid)
    db.session.commit()
    print("seed_all: Games")


if __name__ == "__main__":
    """ SEED initial data for the databases """
    seed_final()



