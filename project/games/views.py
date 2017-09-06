from flask import Blueprint, redirect, render_template, request, url_for, flash
from project.models import Game, Genre

games_blueprint = Blueprint(
    'games',
    __name__,
    template_folder = 'templates'
)

@games_blueprint.route('/', methods=["GET"])
def index():
    return redirect(url_for('games.view', page=1))

@games_blueprint.route('/view/<int:page>', methods=["GET"])
def view(page):
    limit_per_page = 10
    games_list = Game.query.paginate(1 + page * limit_per_page - limit_per_page,
                                limit_per_page, False)
    return render_template('games/index.html', games_list=games_list)

@games_blueprint.route('/<title>', methods=["GET"])
def show(title):
    return render_template('games/{}.html'.format(title))

