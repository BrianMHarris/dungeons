import os

class Config():
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'postgres://localhost/dungeons-database'

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
