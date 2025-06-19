from flask import Blueprint, request, jsonify
from db import users_collection, books_collection
from models import hash_password, verify_password
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId


routes = Blueprint('routes', __name__)

@routes.route('/register', methods=['POST'])
def register():
    data = request.json
    print("Received registration data:", data)

    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone')
    gender = data.get('gender')
    password = data.get('password')

    if users_collection.find_one({"username": username}):
        print("User already exists:", username)
        return jsonify({"msg": "User already exists"}), 400

    users_collection.insert_one({
        "username": username,
        "email": email,
        "phone": phone,
        "gender": gender,
        "password": hash_password(password)
    })

    print("User created:", username)
    return jsonify({"msg": "User created"}), 201

@routes.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    user = users_collection.find_one({"username": username})

    if not user or not verify_password(password, user['password']):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=username)

    return jsonify(access_token=access_token), 200


# Add book
@routes.route('/books', methods=['POST'])
@jwt_required()
def add_book():
    current_user = get_jwt_identity()
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')

    if not title or not author:
        return jsonify({'msg': 'Missing title or author'}), 422

    books_collection.insert_one({
        'title': title,
        'author': author,
        'username': current_user
    })

    return jsonify({'msg': 'Book added'}), 201

# Get books
@routes.route('/books', methods=['GET'])
@jwt_required()
def get_books():
    current_user = get_jwt_identity()
    books = list(books_collection.find({"username": current_user}))

    for book in books:
        book["_id"] = str(book["_id"])

    return jsonify(books), 200

# Update book
@routes.route('/books/<book_id>', methods=['PUT'])
@jwt_required()
def update_book(book_id):
    data = request.json
    books_collection.update_one(
        {"_id": ObjectId(book_id)},
        {"$set": {
            "title": data.get('title'),
            "author": data.get('author'),
            "description": data.get('description', '')
        }}
    )
    return jsonify({"msg": "Book updated"}), 200

# Delete book
@routes.route('/books/<book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    books_collection.delete_one({"_id": ObjectId(book_id)})
    return jsonify({"msg": "Book deleted"}), 200
