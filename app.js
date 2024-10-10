let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let recorder, recordedChunks = [], isRecording = false;
let deck1Audio = new AudioContext();
let deck2Audio = new AudioContext();

let audioElement1 = new Audio();  // Audio for deck 1
let audioElement2 = new Audio();  // Audio for deck 2

// Volume control
let volumeControl1 = document.getElementById('volume1');
let volumeControl2 = document.getElementById('volume2');

// Disk elements
let disk1 = document.getElementById('disk1');
let disk2 = document.getElementById('disk2');

// Play buttons
let playButtonDeck1 = document.getElementById('playDeck1');
let playButtonDeck2 = document.getElementById('playDeck2');

// Playback state
let isPlayingDeck1 = false;
let isPlayingDeck2 = false;

// Setup media recorder for recording audio
navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
  let mediaRecorder = new MediaRecorder(stream);

  document.getElementById('recordButton').onclick = () => {
    if (isRecording) {
      mediaRecorder.stop();
      document.getElementById('recordButton').innerText = 'Start Recording';
    } else {
      mediaRecorder.start();
      document.getElementById('recordButton').innerText = 'Stop Recording';
    }
    isRecording = !isRecording;
  };

  mediaRecorder.ondataavailable = (e) => {
    recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = (e) => {
    let blob = new Blob(recordedChunks, { type: 'audio/ogg; codecs=opus' });
    let audioURL = window.URL.createObjectURL(blob);
    audioElement1.src = audioURL;  // Use the recorded audio for deck 1
    audioElement2.src = audioURL;  // And for deck 2
    recordedChunks = [];
  };
});

// Function to play or stop deck
function togglePlayback(deckNumber) {
  let audioElement = deckNumber === 1 ? audioElement1 : audioElement2;
  let playButton = deckNumber === 1 ? playButtonDeck1 : playButtonDeck2;
  let isPlaying = deckNumber === 1 ? isPlayingDeck1 : isPlayingDeck2;
  let disk = deckNumber === 1 ? disk1 : disk2;

  if (isPlaying) {
    audioElement.pause();
    playButton.innerText = 'Play';
    disk.style.animation = 'none';  // Stop disk spinning
  } else {
    audioElement.play();
    playButton.innerText = 'Stop';
    disk.style.animation = 'spin 2s linear infinite';  // Start disk spinning
  }

  if (deckNumber === 1) {
    isPlayingDeck1 = !isPlayingDeck1;
  } else {
    isPlayingDeck2 = !isPlayingDeck2;
  }
}

// Bind events to play buttons
playButtonDeck1.onclick = () => togglePlayback(1);
playButtonDeck2.onclick = () => togglePlayback(2);

// Handle volume control
volumeControl1.oninput = (e) => {
  audioElement1.volume = e.target.value;
};

volumeControl2.oninput = (e) => {
  audioElement2.volume = e.target.value;
};

// Scratch control with touch
disk1.addEventListener('mousedown', (e) => {
  audioElement1.playbackRate = 0.5;  // Simulating slowing down when touched
});
disk1.addEventListener('mouseup', (e) => {
  audioElement1.playbackRate = 1.0;  // Resume normal speed
});

disk2.addEventListener('mousedown', (e) => {
  audioElement2.playbackRate = 0.5;
});
disk2.addEventListener('mouseup', (e) => {
  audioElement2.playbackRate = 1.0;
});