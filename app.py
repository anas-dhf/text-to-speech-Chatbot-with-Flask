from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import speech_recognition as sr
import os

app = Flask(__name__)

genai.configure(api_key="please place an api key here") # Don't forget to put your API key!
model = genai.GenerativeModel('gemini-pro')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    user_input = request.json['message']
    response = model.generate_content(user_input)
    return jsonify({"response": response.text})

@app.route('/record_audio', methods=['POST'])
def record_audio():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        audio = r.listen(source)
    try:
        text = r.recognize_google(audio)
        return jsonify({"text": text})
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results; {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)