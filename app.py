# app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes import routes

app = Flask(__name__)
CORS(app)  # allow React frontend to talk to Flask backend

# JWT config
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # CHANGE THIS!!
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

jwt = JWTManager(app)

# Register Blueprint
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)
