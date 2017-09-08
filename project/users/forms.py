from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms import validators

class UserSignupForm(FlaskForm):
    username = StringField('username', default="username *", validators=[validators.DataRequired()])
    email = StringField("email", default="your@email.com *", validators=[validators.Email(message="Please enter a valid email")])
    password = StringField('password', default="password *", validators=[validators.DataRequired()])
    password_confirm = StringField('confirm', default="confirm *", validators=[validators.DataRequired()])

class UserLoginForm(FlaskForm):
    username = StringField('username', validators=[validators.DataRequired()])
    password = StringField('password', validators=[validators.DataRequired()])

class UserForm(FlaskForm):
    username = StringField('username', validators=[validators.DataRequired()])
    email = StringField("email", validators=[validators.Email(message="Please enter a valid email")])
    image_url = StringField('avatar (URL)', [validators.Length(validators.DataRequired())])
