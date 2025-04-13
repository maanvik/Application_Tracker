from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, URLField
from wtforms.validators import DataRequired, Email, EqualTo, Length, URL, Optional

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class JobApplicationForm(FlaskForm):
    company_name = StringField('Company Name', validators=[DataRequired(), Length(max=100)])
    position = StringField('Position', validators=[DataRequired(), Length(max=100)])
    job_url = URLField('Job URL', validators=[Optional(), URL()])
    submit = SubmitField('Add Application')