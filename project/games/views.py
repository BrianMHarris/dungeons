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
    games_list = Game.query.paginate(page,
                                limit_per_page, False)
    start = (page - 1) * limit_per_page + 1
    end = start + len(games_list.items) - 1
    return render_template('games/index.html', page=page, games_list=games_list, start=start, end=end)

@games_blueprint.route('/<title>', methods=["GET"])
def show(title):
    return render_template('games/{}.html'.format(title))

