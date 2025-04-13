from . import db
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy.sql import func

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    applications = db.relationship('JobApplication', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class JobApplication(db.Model):
    __tablename__ = 'job_applications'

    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Applied')
    job_url = db.Column(db.String(200))
    date_applied = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<JobApplication {self.company_name} - {self.position}>'

    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'position': self.position,
            'status': self.status,
            'job_url': self.job_url,
            'date_applied': self.date_applied.isoformat(),
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }