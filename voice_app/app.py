from flask import Flask, render_template, request, jsonify
import speech_recognition as sr
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'audio_data' not in request.files:
        return jsonify({'error': 'No audio file'}), 400

    file = request.files['audio_data']
    filename = secure_filename("recorded.wav")
    file_path = os.path.join("static", filename)
    file.save(file_path)

    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio)
            return jsonify({'text': text})
        except sr.UnknownValueError:
            return jsonify({'text': 'Could not understand'})
        except sr.RequestError:
            return jsonify({'text': 'Speech API error'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
