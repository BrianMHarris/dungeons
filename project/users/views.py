from flask import Blueprint, redirect, render_template, request, url_for, flash
from project.models import User
from project import app, db




users_blueprint = Blueprint(
    'users',
    __name__,
    template_folder = 'templates'
)


@app.route('/', methods=["GET", "POST"])
def index():
    return render_template('users/index.html')
