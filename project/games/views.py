from flask import Blueprint, redirect, render_template, request, url_for, flash
from project.models import Game, Genre

games_blueprint = Blueprint(
    'games',
    __name__,
    template_folder = 'templates'
)

@games_blueprint.route('/', methods=["GET"])
def index():
    from IPython import embed; embed()
    return render_template('games/index.html')
