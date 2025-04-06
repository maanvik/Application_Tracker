from flask import Blueprint, jsonify, request
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import desc
from . import db
from .models import User, JobApplication
from .forms import RegistrationForm, LoginForm, JobApplicationForm

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return jsonify({"message": "Welcome to the Application Tracker API!"})

@main.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Validate input data
        if not all(key in data for key in ['username', 'email', 'password']):
            return jsonify({'message': 'Missing required fields'}), 400

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'Username already taken'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            password=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
    
    except Exception as e:
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
            'email': current_user.email
        }), 200

    elif request.method == 'PUT':
        data = request.get_json()
        new_username = data.get('username')

        if not new_username:
            return jsonify({'message': 'Username is required'}), 400

        existing_user = User.query.filter_by(username=new_username).first()
        if existing_user and existing_user.id != current_user.id:
            return jsonify({'message': 'Username already taken'}), 400

        current_user.username = new_username
        db.session.commit()

        return jsonify({'message': 'Username updated successfully'}), 200



@main.route('/api/applications/stats')
@login_required
def application_stats():
    # Get all applications for the current user without pagination
    applications = JobApplication.query.filter_by(user_id=current_user.id).all()
    
    applications_list = [{
        'id': app.id,
        'company_name': app.company_name,
        'position': app.position,
        'status': app.status,
        'job_url': app.job_url,
        'date_applied': app.date_applied.isoformat()
    } for app in applications]
    
    return jsonify({'applications': applications_list}), 200

@main.route('/api/applications', methods=['GET', 'POST'])
@login_required
def applications():
    if request.method == 'POST':
        data = request.json
        application = JobApplication(
            company_name=data['company_name'],
            position=data['position'],
            job_url=data['job_url'],
            user_id=current_user.id
        )
        db.session.add(application)
        db.session.commit()
        return jsonify({'message': 'Application added successfully'}), 201
    
    # GET request
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    sort_by = request.args.get('sort_by', 'date_applied')
    sort_order = request.args.get('sort_order', 'desc')
    filter_by = request.args.get('filter_by')
    filter_value = request.args.get('filter_value')

    query = JobApplication.query.filter_by(user_id=current_user.id)

    if filter_by and filter_value:
        query = query.filter(getattr(JobApplication, filter_by).ilike(f'%{filter_value}%'))

    if sort_order == 'desc':
        query = query.order_by(desc(getattr(JobApplication, sort_by)))
    else:
        query = query.order_by(getattr(JobApplication, sort_by))

    paginated_apps = query.paginate(page=page, per_page=per_page, error_out=False)
    
    applications = [{
        'id': app.id,
        'company_name': app.company_name,
        'position': app.position,
        'status': app.status,
        'job_url': app.job_url,
        'date_applied': app.date_applied.isoformat()
    } for app in paginated_apps.items]

    return jsonify({
        'applications': applications,
        'total_pages': paginated_apps.pages,
        'current_page': paginated_apps.page,
        'total_items': paginated_apps.total
    }), 200

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
            return jsonify({'message': 'Application updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Update failed: {str(e)}'}), 500

    elif request.method == 'DELETE':
        try:
            db.session.delete(application)
            db.session.commit()
            return jsonify({'message': 'Application deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Delete failed: {str(e)}'}), 500