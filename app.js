const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const videoFile = document.getElementById("videoFile");
const playButton = document.getElementById("playButton");
const muteButton = document.getElementById("muteButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const sampleButton = document.getElementById("sampleButton");

const SAMPLE_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const updatePlayState = () => {
  playButton.textContent = video.paused ? "Play" : "Pause";
};

const updateMuteState = () => {
  muteButton.textContent = video.muted ? "Unmute" : "Mute";
};

const showOverlay = () => {
  overlay.classList.remove("hidden");
};

const hideOverlay = () => {
  overlay.classList.add("hidden");
};

const setVideoSource = (source) => {
  video.src = source;
  video.load();
  hideOverlay();
  updatePlayState();
};

videoFile.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) {
    return;
  }
  const url = URL.createObjectURL(file);
  setVideoSource(url);
});

sampleButton.addEventListener("click", () => {
  setVideoSource(SAMPLE_VIDEO);
  video.play();
});

playButton.addEventListener("click", async () => {
  if (video.paused) {
    await video.play();
  } else {
    video.pause();
  }
});

muteButton.addEventListener("click", () => {
  video.muted = !video.muted;
  updateMuteState();
});

fullscreenButton.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

video.addEventListener("play", updatePlayState);
video.addEventListener("pause", updatePlayState);
video.addEventListener("volumechange", updateMuteState);

window.addEventListener("keydown", (event) => {
  if (event.target.matches("input")) {
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  if (event.key.toLowerCase() === "m") {
    video.muted = !video.muted;
  }
  if (event.key.toLowerCase() === "f") {
    fullscreenButton.click();
  }
});

video.addEventListener("loadedmetadata", () => {
  updateMuteState();
  updatePlayState();
});

video.addEventListener("ended", showOverlay);

updateMuteState();
updatePlayState();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
