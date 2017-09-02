from flask import Blueprint, redirect, render_template, request, url_for, flash
from project.models import User
from project import db

users_blueprint = Blueprint(
    'users',
    __name__,
    template_folder = 'templates'
)

# NOTE: None of the following routes should redirect

@users_blueprint.route('/', methods=["GET", "POST"])
def index():
    # View the user information if just a get, pass authorization to toggle edit button, etc
    # Post a new user and redirect if post request
    # make sure to send a signup / login form for the invisible modal to hold
    return render_template('users/index.html')

@users_blueprint.route('/signup')
def signup():
    # arrive here from the signup login modal based on which button you choose
    # creates a new user and sends you to login automatically
    # if the session has an id, redirect!
    pass

@users_blueprint.route('/login')
def login():
    # arrive here from the signup login modal based on which button you choose
    # if just signed up we want to definitely log in!
    # not a full page reload, use default values for anything not covered in the form!
    pass

@users_blueprint.route('/<int:id>/edit')
def edit(id):
    # find the user and populate the form, display it!
    # this is possible redirect...
    return render_template('users/edit.html', id=id)

@users_blueprint.route('/<int:id>')
def show(id):
    # if authenticated let them view the user
    # if they are trying to patch and authorized, do the work, send them to index
    # if they are not authorized, just show them them the limited profile
    #   this is a full page reload
    return render_template('users/index.html')
