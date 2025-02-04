from . import db
from flask_login import UserMixin
from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer , primary_key = True)
    username =  db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120) , unique = True , nullable = False)
    password = db.Column(db.String(512) , nullable = False)

    def __rep__(self):
        return f'<USER {self.username}>'

class JobApplication(db.Model):
    id = db.Column(db.Integer , primary_key =  True)
    company_name = db.Column(db.String(100) , nullable = False)
    position = db.Column(db.String(100), nullable=False )
    status = db.Column(db.String(20), nullable = False,  default ='Applied')
    job_url = db.Column(db.String(200) )
    date_applied = db.Column(db.DateTime, default = datetime.utcnow)
    user_id = db.Column(db.Integer , db.ForeignKey('user.id'),nullable= False) 

    def __repr__(self):
        return f'<JobApplication {self.company_name} - {self.position}>'
