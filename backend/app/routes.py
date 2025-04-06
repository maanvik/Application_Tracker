from flask import Blueprint, jsonify, request
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import desc, text
import logging
from . import db
from .models import User, JobApplication

logger = logging.getLogger(__name__)
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return jsonify({"message": "Welcome to the Application Tracker API!"})

@main.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        if not all(key in data for key in ['username', 'email', 'password']):
            return jsonify({'message': 'Missing required fields'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'Username already taken'}), 400
        
        user = User(
            username=data['username'],
            email=data['email'],
            password=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
    
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@main.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not all(key in data for key in ['email', 'password']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password, data['password']):
            login_user(user)
            return jsonify({
                'message': 'Logged in successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }), 200
        
        return jsonify({'message': 'Invalid credentials'}), 401
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

@main.route('/api/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


@main.route('/api/user', methods=['GET', 'PUT'])
@login_required
def handle_user():
    if request.method == 'GET':
        return jsonify({
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'created_at': current_user.created_at.isoformat()
        })

    elif request.method == 'PUT':
        data = request.get_json()
        new_username = data.get('username')

        if not new_username:
            return jsonify({'message': 'Username is required'}), 400

        # Check if the new username already exists (and is not the current user)
        existing = User.query.filter_by(username=new_username).first()
        if existing and existing.id != current_user.id:
            return jsonify({'message': 'Username already taken'}), 409

        current_user.username = new_username
        db.session.commit()
        return jsonify({'message': 'Username updated successfully'})



@main.route('/api/applications/stats')
@login_required
def application_stats():
    try:
        applications = JobApplication.query.filter_by(user_id=current_user.id).all()
        return jsonify({
            'applications': [app.to_dict() for app in applications]
        }), 200
    except Exception as e:
        logger.error(f"Error fetching application stats: {str(e)}")
        return jsonify({'message': f'Failed to fetch stats: {str(e)}'}), 500

@main.route('/api/applications', methods=['GET', 'POST'])
@login_required
def applications():
    if request.method == 'POST':
        try:
            data = request.json
            logger.info(f"Received application data: {data}")
            
            application = JobApplication(
                company_name=data['company_name'],
                position=data['position'],
                job_url=data.get('job_url'),
                user_id=current_user.id
            )
            
            db.session.add(application)
            db.session.commit()
            logger.info(f"Successfully saved application with id: {application.id}")
            
            return jsonify(application.to_dict()), 201
        except Exception as e:
            logger.error(f"Error adding application: {str(e)}")
            db.session.rollback()
            return jsonify({'message': f'Failed to add application: {str(e)}'}), 500

    # GET request
    try:
        applications = JobApplication.query.filter_by(user_id=current_user.id).all()
        return jsonify({
            'applications': [app.to_dict() for app in applications]
        }), 200
    except Exception as e:
        logger.error(f"Error fetching applications: {str(e)}")
        return jsonify({'message': f'Failed to fetch applications: {str(e)}'}), 500

@main.route('/api/applications/<int:id>', methods=['PUT', 'DELETE'])
@login_required
def manage_application(id):
    application = JobApplication.query.filter_by(id=id, user_id=current_user.id).first()
    
    if not application:
        return jsonify({'message': 'Application not found'}), 404

    if request.method == 'PUT':
        try:
            data = request.json
            if 'company_name' in data:
                application.company_name = data['company_name']
            if 'position' in data:
                application.position = data['position']
            if 'status' in data:
                application.status = data['status']
            if 'job_url' in data:
                application.job_url = data['job_url']
            
            db.session.commit()
            return jsonify(application.to_dict()), 200
        except Exception as e:
            logger.error(f"Error updating application: {str(e)}")
            db.session.rollback()
            return jsonify({'message': f'Update failed: {str(e)}'}), 500

    elif request.method == 'DELETE':
        try:
            db.session.delete(application)
            db.session.commit()
            return jsonify({'message': 'Application deleted successfully'}), 200
        except Exception as e:
            logger.error(f"Error deleting application: {str(e)}")
            db.session.rollback()
            return jsonify({'message': f'Delete failed: {str(e)}'}), 500

@main.route('/api/test-db', methods=['GET'])
def test_db():
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({'message': 'Database connection successful'}), 200
    except Exception as e:
        logger.error(f"Database connection test failed: {str(e)}")
        return jsonify({'message': f'Database connection failed: {str(e)}'}), 500