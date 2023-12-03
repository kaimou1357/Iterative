from app.main import bp
from app import app
from flask import request, jsonify
from flask_login import login_user, logout_user

@bp.route('/api/sign-up', methods=['POST'])
def sign_up():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Check if the email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'status': 'error', 'message': 'Email already exists. Please choose a different email.'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, password=hashed_password)
    user.settings = UserSettings()
    
    db.session.add(user)
    db.session.commit()
    
    login_user(user, remember=True)

    is_guest_sign_up = len(session.get('projects', [])) > 0

    migrate_guest_projects_to_db(user)

    response = jsonify({'status': 'success'})
    return response


@bp.route('/api/guest-auth', methods=['POST'])
def guest_auth():
    logging.debug(f"guest logging in")
    # Here, create an instance of the GuestUser with the UUID
    guest_user = GuestUser()
    guest_user.setup()
    logging.debug(f"guest_user.id: {guest_user.id}")

    login_user(guest_user, remember=False)

    return jsonify({'status': 'success'})

@bp.route('/api/sign-in', methods=['POST'])
def sign_in():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user, remember=True)
         # Print session data for debugging
        migrate_guest_projects_to_db(user)


        response = jsonify({'status': 'success'})
        return response
    else:
        return jsonify({'status': 'failure', 'message': 'Sign In Unsuccessful. Please check email and password'})

@bp.route('/api/sign-out', methods=['POST'])
def sign_out():
    logout_user()
    response = jsonify({'status': 'success'})
    return response