import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from dotenv import load_dotenv
import logging
from sqlalchemy import text

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initializing the extensions here
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = 'main.login'

def verify_db_connection(app):
    try:
        with app.app_context():
            # Get database connection and create a cursor
            conn = db.engine.connect()
            # Execute a simple query to really test the connection
            result = conn.execute(text("SELECT 1"))
            conn.close()
            logger.info("✅ Successfully connected to PostgreSQL database!")
            return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {str(e)}")
        # Log additional connection details (without sensitive info)
        logger.info(f"Database Host: {os.getenv('DB_HOST')}")
        logger.info(f"Database Name: {os.getenv('DB_NAME')}")
        logger.info(f"Database User: {os.getenv('DB_USER')}")
        return False

def create_tables(app):
    try:
        # Import models here to avoid circular imports
        from .models import User, JobApplication
        
        with app.app_context():
            # Create tables
            db.create_all()
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            logger.info(f"Tables after creation: {tables}")
            
            # Verify table schemas
            for table in tables:
                columns = [col['name'] for col in inspector.get_columns(table)]
                logger.info(f"Table {table} columns: {columns}")
                
        logger.info("✅ Database tables created successfully!")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {str(e)}")
        return False

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Log database URI (without password)
    db_uri = app.config['SQLALCHEMY_DATABASE_URI']
    safe_uri = db_uri.replace(os.getenv('DB_PASSWORD', ''), '****')
    logger.info(f"Database URI: {safe_uri}")

    # Configure CORS with specific origins and credentials
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    from .routes import main
    app.register_blueprint(main)

    @login_manager.user_loader
    def load_user(user_id):
        from .models import User
        return User.query.get(int(user_id))

    # Verify database connection and create tables
    if not verify_db_connection(app):
        logger.error("Failed to establish database connection. Please check your configuration.")
    else:
        create_tables(app)

    return app