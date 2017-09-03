from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms import validators

class UserSignupForm(FlaskForm):
    username = StringField('User Name', validators=[validators.DataRequired()])
    email = StringField("Email", validators=[validators.Email(message="Please enter a valid email")])
    password = StringField('Password', validators=[validators.DataRequired()])
    password_confirm = StringField('Confirm Password', validators=[validators.DataRequired()])

class UserLoginForm(FlaskForm):
    username = StringField('User Name', validators=[validators.DataRequired()])
    password = StringField('Password', validators=[validators.DataRequired()])

class UserForm(FlaskForm):
    username = StringField('User Name', validators=[validators.DataRequired()])
    email = StringField("Email", validators=[validators.Email(message="Please enter a valid email")])
    image_url = StringField('Image URL', [validators.Length(validators.DataRequired())])
