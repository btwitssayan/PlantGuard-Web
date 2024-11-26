from flask import Flask, render_template, request, jsonify
import requests
import json


app = Flask(__name__)

url = "https://web-production-0cb7.up.railway.app/predict/"

def detect(file):
    file = {"file": file}
    response = requests.post(url, files=file)
    result = json.loads(response.text)['class_name']
    return result

# Configurations
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST', 'GET'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file and allowed_file(file.filename):
        result = detect(file)
        return render_template('index.html', prediction=result)
    else:
        return jsonify({'error': 'File type not allowed'}), 400

@app.route('/developers')
def developers():
    return render_template('developers.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        # Process the form data here
        # For example, you can save it to a database or send an email
        return render_template('contact.html', success=True)
    return render_template('contact.html')  

@app.route('/terms')
def terms():
    return jsonify({'error':'Kaya karega Terms or Conditions Dak k BKL' }), 400

if __name__ == '__main__':
    app.run()
