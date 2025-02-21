from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'signature_db'
}

# Route to receive and store the signature
@app.route('/save-signature', methods=['POST'])
def save_signature():
    # Get the signature data from the request
    data = request.get_json()
    signature_data = data.get('signature')
    

    if signature_data:
        # Clean the base64 data (remove the prefix 'data:image/png;base64,')
        signature_data = signature_data.split(",")[1]
        
        # Convert the base64 string to an image
        img_data = base64.b64decode(signature_data)
        image = Image.open(BytesIO(img_data))
        # Save the image as a file (optional)
        image.save("signature.png")

        # Store the image data into the MySQL database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Query to insert the base64 data into the database
        query = "INSERT INTO signatures (signature) VALUES (%s)"
        cursor.execute(query, (signature_data,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Signature saved successfully!"}), 200

    return jsonify({"error": "No signature data provided."}), 400

if __name__ == '__main__':
    app.run(debug=True)
