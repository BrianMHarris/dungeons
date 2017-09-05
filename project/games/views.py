from flask import Blueprint, redirect, render_template, request, url_for, flash
from project.models import Game, Genre

games_blueprint = Blueprint(
    'games',
    __name__,
    template_folder = 'templates'
)

@games_blueprint.route('/', methods=["GET"])
def index():
    return render_template('games/index.html')

@games_blueprint.route('/<title>', methods=["GET"])
def show(title):
    return render_template('games/{}.html'.format(title))

