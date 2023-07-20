'use strict';

let recorder;
let recordingData = [];
let recorderStream;

/**
 * Mixes multiple audio tracks and the first video track it finds
 */
function mixer(stream1, stream2) {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    if (stream1.getAudioTracks().length > 0)
        ctx.createMediaStreamSource(stream1).connect(dest);

    if (stream2.getAudioTracks().length > 0)
        ctx.createMediaStreamSource(stream2).connect(dest);

    let tracks = dest.stream.getTracks();
    tracks = tracks.concat(stream1.getVideoTracks()).concat(stream2.getVideoTracks());

    return new MediaStream(tracks)
}

/**
 * Start a new recording
 */
const record_start = document.getElementById('recordStart');
record_start.addEventListener('click', async () => {
    let gumStream, gdmStream;
    recordingData = [];

    try {
        gumStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        gdmStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "browser" }, audio: { channelCount: 2 } });

    } catch (e) {
        console.error("capture failure", e);
        return;
    }

    recorderStream = gumStream ? mixer(gumStream, gdmStream) : gdmStream;
    recorder = new MediaRecorder(recorderStream, { mimeType: 'video/webm' });

    recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
            recordingData.push(e.data);
        }
    };

    recorder.onstop = () => {
        recorderStream.getTracks().forEach(track => track.stop());
        gumStream.getTracks().forEach(track => track.stop());
        gdmStream.getTracks().forEach(track => track.stop());
    };

    recorderStream.addEventListener('inactive', () => {
        console.log('Capture stream inactive');
        stopCapture();
    });

    recorder.start();
    console.log("started recording");
    record_start.innerText = "Идёт запись";

    record_start.disabled = true;
    record_pause.disabled = false;
    record_stop.disabled = false;
    record_save.disabled = true;
});

/**
 * Stop recording
 */
const record_stop = document.getElementById('recordStop');
function stopCapture() {
    console.log("Stopping recording");
    recorder.stop();

    record_start.disabled = false;
    record_pause.disabled = true;
    record_stop.disabled = true;
    record_save.disabled = false;

    record_start.innerText = "Начать запись";
    record_pause.innerText = "Приостановить";
}
record_stop.addEventListener('click', stopCapture);

/**
 * Pause recording
 */
const record_pause = document.getElementById('recordPause');
record_pause.addEventListener('click', () => {
    if (recorder.state === 'paused') {
        recorder.resume();
        record_pause.innerText = "Приостановить";
    }
    else if (recorder.state === 'recording') {
        recorder.pause();
        record_pause.innerText = "Возобновить";
    } else {
        console.error(`recorder in unhandled state: ${recorder.state}`);
    }

    console.log(`recorder ${recorder.state === 'paused' ? "paused" : "recording"}`);
});

/**
 * Save the recording
 */
const record_save = document.getElementById('recordSave');
record_save.addEventListener('click', () => {
    const now = new Date();
    const timestamp = now.toISOString();
    const blob = new Blob(recordingData, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `Запись_${timestamp}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log(`${a.download} save option shown`);
    }, 100);
});
function notSupportsGetDisplayMedia() {
  var supportsGetDisplayMedia = typeof navigator.mediaDevices.getDisplayMedia !== 'undefined';
  return !supportsGetDisplayMedia;
}

if (notSupportsGetDisplayMedia()) {
  var fieldset = document.getElementById("recordFieldset");
  fieldset.remove();
}