from flask import Blueprint, redirect, render_template, request, url_for, flash
from project.models import User
from project.users.forms import UserSignupForm, UserLoginForm, UserForm
from project import db, bcrypt
from functools import wraps
from flask_login import login_user, logout_user, current_user, login_required
from sqlalchemy.exc import IntegrityError

users_blueprint = Blueprint(
    'users',
    __name__,
    template_folder = 'templates'
)

# decorator for making sure the current user is authorized
def ensure_correct_user(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if kwargs.get('id') != current_user.id:
            from IPython import embed; embed()
            flash("Not Authorized", "alert-danger")
            return redirect(url_for('users.index'))
        return fn(*args, **kwargs)
    return wrapper

# NOTE: index is currently used as a login/signup controller
@users_blueprint.route('/', methods=["GET", "POST"])
def index():
    new_user = False
    form_new = UserSignupForm(request.form)
    if current_user.is_authenticated == False:  # If the user doesn't exist or hasn't logged in
        new_user = True
    else:
        return redirect(url_for('users.show', id=current_user.id))
    # make sure to send a signup / login form for the invisible modal to hold
    return render_template('users/index.html', new_user=new_user, form_new=form_new)

@users_blueprint.route('/signup', methods=["POST"])
def signup():
    # Post a new user and redirect
    form = UserSignupForm(request.form)
    if form.validate():
        try:
            new_user = User(form.data['username'], form.data['email'], form.data['password'])
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user) # replaces need for setting session id
            flash("Profile Created", "alert-success")
        except IntegrityError as e:
            flash("Username already taken", "alert-warning")
    else:
        flash("Invalid form", "alert-danger")
    return redirect(url_for('users.index'))

@users_blueprint.route('/login', methods=["POST"])
def login():
    # arrive here from the signup login modal based on which button you choose
    # if just signed up we want to definitely log in!
    # not a full page reload, use default values for anything not covered in the form!
    form = UserLoginForm(request.form)
    if form.validate():
        found_user = User.query.filter_by(username=form.data['username']).first()
        if found_user:
            authenticated_user = bcrypt.check_password_hash(found_user.password, form.data['password'])
            if authenticated_user:
                flash("Login successful!", "alert-success")
                login_user(remember_me=True)
    if form.is_submitted():
        flash("Username and Password do not match our records. Pleast Try again.", "alert-warning")
    return redirect(url_for('home.index'))

@users_blueprint.route('/logout')
def logout():
    logout_user();
    flash("Logged Out", "alert-info")
    return redirect(url_for('home.index'), code=302)

@users_blueprint.route('/<int:id>/edit')
@login_required
@ensure_correct_user
def edit(id):
    user = User.query.get_or_404(id)
    form = UserForm(obj=user)
    return render_template('users/edit.html', id=id, form=form)

@users_blueprint.route('/<int:id>/delete', methods=['GET', 'DELETE'])
@login_required
@ensure_correct_user
def delete(id):
    user = User.query.get_or_404(id)
    # if they choose to delete their account, make them log in to confirm
    if request.method == b"DELETE":
        form_login = UserLoginForm(request.form)
        if bcrypt.check_password_hash(user.password, form_login.password.data):
            db.session.delete(user)
            db.session.commit()
            logout_user()
            flash("Profile Deleted", "alert-warning")
            return redirect(url_for('root'))
        else:
            flash("Password incorrect", "alert-danger")
    # just in case they didn't actually delete
    form_login = UserLoginForm()
    return render_template('users/delete.html', id=id, form_login=form_login)

@users_blueprint.route('/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
@login_required
def show(id):
    user = User.query.get_or_404(id)
    # if authenticated let them view the user
    # if they are trying to patch and authorized, do the work, show their updated profile
    authorized = current_user.id == id
    if request.method == b'PATCH':
        form = UserForm(request.form)
        user.username = form.username.data
        user.email = form.email.data
        user.image_url = form.image_url.data
        db.session.add(user)
        db.session.commit()
        flash("Profile Updated", "alert-info")
        return redirect(url_for('users.show', id=id))
    # if they choose to delete their account, make them log in to confirm
    # if request.method == b"Delete":
    #     form = UserLoginForm(request.form)
    #     if bcrypt.check_password_hash(user.password, form.password.data):
    #         db.session.delete(user)
    #         db.session.commit()
    #         logout_user()
    #         return redirect(url_for('root'))
    # if they are not authorized, just show them them the limited profile, no edit
    return render_template('users/show.html', id=id, user=user, authorized=authorized)
