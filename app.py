from project import app # import app from __init__.py in the project folder
from project import config

if __name__ == '__main__':
    app.run(debug=config.DEBUG, port=3000)
