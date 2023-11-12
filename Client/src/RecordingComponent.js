import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AudioRecorderPolyfill from 'audio-recorder-polyfill';
import { API_BASE_URL } from './config';

window.MediaRecorder = AudioRecorderPolyfill;

const RecordingComponent = ({ onTranscription, isDisabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  let mediaRecorder = useRef(null);
  let audioChunks = useRef([]);
  const [error, setError] = useState(null);

  const initializeRecorder = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.addEventListener('dataavailable', event => {
            console.log("Data available:", event.data);
            audioChunks.current.push(event.data);
          });
  
          mediaRecorder.current.addEventListener('stop', async () => {
            console.log("Stopped. Chunks:", audioChunks.current);
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

            const formData = new FormData();
            formData.append('audio', audioBlob);
            try {
                const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const transcript = response.data.transcript;
                onTranscription(transcript);
            } catch (error) {
                console.error('Transcription failed:', error);
                setError('Transcription failed.');
            }

            // Reset audio chunks for next recording
            audioChunks.current = [];
          });
      })
      .catch(error => {
        console.error('Media recording failed:', error);
        setError('Failed to access the microphone. Please enable microphone access in your browser settings.');
      });
  };

  const startRecording = () => {
    if (!mediaRecorder.current) {
      initializeRecorder();
    }

    if (mediaRecorder.current && mediaRecorder.current.state !== 'recording') {
        mediaRecorder.current.start();
        setIsRecording(true);
        setError(null);
      }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop();
        setIsRecording(false);
      }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const clearError = () => {
    setError(null);
  };


  return (
    <>
      <button type="button" className="btn btn-secondary ms-2" onClick={toggleRecording} disabled={isDisabled}>
        {isRecording ? 'Stop' : 'Record'}
      </button>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show ms-2" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={clearError}></button>
        </div>
      )}
    </>
  );
};

export default RecordingComponent;
