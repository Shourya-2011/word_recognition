let mediaRecorder;
let audioChunks = [];

function startRecording() {
    document.getElementById('status').innerText = 'Recording...';

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('audio_data', audioBlob, 'recorded.wav');

            fetch('/upload-audio', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById('output').innerText = data.text;
                document.getElementById('status').innerText = 'Press to record...';
            });
        });

        setTimeout(() => {
            mediaRecorder.stop();
        }, 4000); // Record for 4 seconds
    });
}
