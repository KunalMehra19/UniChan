from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import hashlib

app = Flask(__name__)
CORS(app)

def getdb():
    conn=mysql.connector.connect(
            host='infinitylooper19.mysql.pythonanywhere-services.com',  # PythonAnywhere MySQL host
            user='infinitylooper19',                                    # Your PythonAnywhere MySQL username
            password='kunal123',                                 # Your MySQL password
            database='infinitylooper19$moodle'
    )
    return conn



def generate_tripcode(password):
    salt = hashlib.sha256(password.encode('utf-8')).hexdigest()[:16]
    salted_password = password + salt
    hash_object = hashlib.sha256(salted_password.encode('utf-8'))
    full_hash = hash_object.hexdigest()
    short_hash = full_hash[:8]
    
    return short_hash



@app.route('/initiate')
def initiate():
    conn=getdb()
    curr=conn.cursor()
    curr.execute("CREATE DATABASE IF NOT EXISTS infinitylooper19$moodle;")

        # Use the moodle database
    curr.execute("USE infinitylooper19$moodle;")

        # Create the users table
    curr.execute('''
            CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            thread TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            content TEXT NOT NULL,
            tripcode VARCHAR(255) NOT NULL
        );

        ''')
    
    return {"message":"database initiated successfully! "},200

@app.route('/<thread>')
def show(thread):
    conn = getdb()
    curr = conn.cursor()
    curr.execute('SELECT * FROM posts WHERE thread = %s', (thread,))
    rows = curr.fetchall()
    columns = [desc[0] for desc in curr.description]  # Get column names
    conn.close()

    # Convert rows to a list of dictionaries
    results = [dict(zip(columns, row)) for row in rows]
    return jsonify(results)


@app.route('/post', method=['POST'])
def post():
    conn = getdb()
    curr = conn.cursor()

    data = request.get_json()

    thread = data.get('thread')
    timestamp = data.get('timestamp')
    content = data.get('content')
    tripcode = data.get('tripcode')

    hashed_tripcode=generate_tripcode(tripcode)


    values=(thread,timestamp,content,hashed_tripcode)
    curr.execute('''INSERT INTO posts (thread,timestamp,content,tripcode) VALUES(%s,%s,%s,%s)''',values)

    conn.commit()
    curr.close()
    conn.close()


    return {"message":"posted successfully! "},200





if __name__ == '__main__':
    app.run()