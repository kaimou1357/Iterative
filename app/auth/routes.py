from app.auth import bp
from app.models.user import User
from app.models.user_settings import UserSettings
from flask import request, jsonify, session, current_app
from flask_login import login_user, logout_user, current_user
from app.extensions import db, login_manager
from flask_bcrypt import Bcrypt

@bp.route('/api/sign-up', methods=['POST'])
def sign_up():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Check if the email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'status': 'error', 'message': 'Email already exists. Please choose a different email.'}), 400

    bcrypt = Bcrypt(current_app)
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, password=hashed_password)
    user.settings = UserSettings()
    
    db.session.add(user)
    db.session.commit()
    
    login_user(user, remember=True)

    response = jsonify({'status': 'success'})
    return response

@bp.route('/api/sign-in', methods=['POST'])
def sign_in():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = User.query.filter_by(email=email).first()
    bcrypt = Bcrypt(current_app)
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user, remember=True)
        
        response = jsonify({'status': 'success'})
        return response
    else:
        return jsonify({'status': 'failure', 'message': 'Sign In Unsuccessful. Please check email and password'})

@bp.route('/api/sign-out', methods=['POST'])
def sign_out():
    logout_user()
    response = jsonify({'status': 'success'})
    return response

@bp.route('/api/auth-status', methods=['GET'])
def auth_status():
    response_data = {
        'isAuthenticated': current_user.is_authenticated,
        'isGuest': False
    }
    
    response = jsonify(response_data)
    return response
    
# Login Manager Init
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized"}), 401