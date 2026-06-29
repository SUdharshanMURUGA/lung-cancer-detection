from flask import Flask, render_template, request
import os
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc
import seaborn as sns
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json
from flask import Flask, render_template, request, jsonify, redirect
from datetime import datetime

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load the trained model
model = load_model("myfinal50_localmodel.h5")

# Define the classes
class_names = ["Adenocarcinoma", "Large cell carcinoma", "Normal", "Squamous cell carcinoma"]

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/predict')
def predict():
    remember='predict.html'
    return render_template("predict.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/result')
def result():
    remember='result.html'
    return render_template("result.html")

@app.route('/contact')
def contact():
    return render_template("contact.html")

@app.route('/history')
def history():
    # Read prediction history from JSON file
    with open('prediction_history.json', 'r') as file:
        prediction_history = [json.loads(line) for line in file]

    return render_template('history.html', prediction_history=prediction_history)

# Define a custom Jinja2 filter to mimic the behavior of enumerate
def custom_enumerate(iterable, start=0):
    return enumerate(iterable, start=start)

# Register the custom filter with the Flask app
app.jinja_env.filters['custom_enumerate'] = custom_enumerate

@app.route('/delete_prediction', methods=['POST'])
def delete_prediction():
    index = int(request.form['index']) - 1  # Adjust index to match Python's 0-based indexing
    # Read prediction history from JSON file
    with open('prediction_history.json', 'r') as file:
        prediction_history = [json.loads(line) for line in file]

    # Remove the prediction entry at the specified index
    del prediction_history[index]

    # Write the updated prediction history back to the JSON file
    with open('prediction_history.json', 'w') as file:
        for prediction in prediction_history:
            json.dump(prediction, file)
            file.write('\n')

    # Redirect back to the history page
    return redirect('/history')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part'
        
        # Get the uploaded file from the request
        file = request.files['file']
        
        if file.filename == '':
                return render_template("predict.html")
        
        # Save the uploaded file
        file_path = os.path.join('static/uploads', file.filename)
        file.save(file_path)

        # Load and preprocess the image
        img = image.load_img(file_path, target_size=(350, 350))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        
        # Make predictions
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions)

        # Get the class name
        class_name = class_names[predicted_class]
        confidence_percentage = round(np.max(predictions) * 100,2)

        graph=["Normal","Large cell carcinoma","Squamous cell carcinoma","Adenocarcinoma"]
        for i in range(len(graph)):
            if class_name==graph[i]:
                img_src = '/static/img/'+str(i)+'.png'
                x_src='/static/uploads/'+file.filename
                # return render_template('result.html', img_src=img_src)
            else:
                continue

        # Delete the uploaded file
        #os.remove(file_path)
        current_datetime = datetime.now().strftime("Date: %Y-%m-%d Time: %H:%M:%S")

        with open('prediction_history.json', 'a') as file:
        # Convert confidence_percentage to a native Python float before serializing to JSON
            json.dump({'datetime': current_datetime,'result': class_name, 'probability' : f'Probability: {confidence_percentage:.2f}%', 'image_data': x_src}, file)
            file.write('\n')

        return render_template("result.html", class_name=class_name,img_src=img_src,x_src=x_src,confidence_percentage=confidence_percentage)

@app.route('/send_email', methods=['POST'])
def sendmail():

    name = request.form['name']
    email = request.form['email']
    message = request.form['message']

    sender_email = "paperpresentationrevoitz@gmail.com"
    password = 'bauzzkhmpwjxpjwi'
    recipient_email = "sudharshan10002@gmail.com"  # Set the recipient email address

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = "Feedback from Contact Form"

        body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, password)
        server.send_message(msg)
        print("Sent to {}".format(recipient_email))
        server.quit()
        return render_template("contact.html",success_message="Mail Sent Successfully")
    except Exception as e:
        print(e)
        return render_template("contact.html",success_message="Failed to Send Mail")


if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')
