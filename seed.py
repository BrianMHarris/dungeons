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
    raid = Game("Raid!", "ExplodedZombie", "raid", "raid.png", "RPG meets strategy in this never-ending monster murder simulator!")
    raid.genres.extend([rpg, puzzle])
    game2 = Game("Game 2", "ExplodedZombie", "", "", "Game 2")
    game2.genres.extend([rpg, puzzle])
    game3 = Game("Game 3", "ExplodedZombie", "", "", "Game 3")
    game3.genres.extend([rpg, puzzle])
    game4 = Game("Game 4", "ExplodedZombie", "", "", "Game 4")
    game4.genres.extend([rpg, puzzle])
    game5 = Game("Game 5", "ExplodedZombie", "", "", "Game 5")
    game5.genres.extend([rpg, puzzle])
    game6 = Game("Game 6", "ExplodedZombie", "", "", "Game 6")
    game6.genres.extend([rpg, puzzle])
    game7 = Game("Game 7", "ExplodedZombie", "", "", "Game 7")
    game7.genres.extend([rpg, puzzle])
    game8 = Game("Game 8", "ExplodedZombie", "", "", "Game 8")
    game8.genres.extend([rpg, puzzle])
    game9 = Game("Game 9", "ExplodedZombie", "", "", "Game 9")
    game9.genres.extend([rpg, puzzle])
    game10 = Game("Game 10", "ExplodedZombie", "", "", "Game 10")
    game10.genres.extend([rpg, puzzle])
    game11 = Game("Game 11", "ExplodedZombie", "", "", "Game 11")
    game11.genres.extend([rpg, puzzle])
    db.session.add(raid)
    db.session.commit()
    print("SEED: Games")
