from flask import Blueprint, redirect, render_template, request, url_for, flash
from project.users.forms import UserLoginForm

home_blueprint = Blueprint(
    'home',
    __name__,
    template_folder = 'templates'
)

@home_blueprint.route('/', methods=["GET"])
def index():
    login_form = UserLoginForm()
    return render_template('home/index.html', login_form=login_form)
