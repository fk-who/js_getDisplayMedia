const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const fullscreenElem = document.getElementById("fullscreen");
const fullwindowElem = document.getElementById("fullwindow");
const controlElems = document.querySelectorAll("p.controls");

// Options for getDisplayMedia()

var displayMediaOptions = {
  video: {
    cursor: "never" // "always" か "motion" か "never" のいずれか なぜか効かない？
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function(evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function(evt) {
  stopCapture();
}, false);

fullscreenElem.addEventListener("click", function(evt) {
  videoElem.requestFullscreen();
}, false);

fullwindowElem.addEventListener("click", function(evt) {
  videoElem.classList.toggle("fullwindow");
  controlElems.forEach(e=>e.classList.toggle("fullwindow"));
  shortcut.add("Esc", ()=>{
    videoElem.classList.toggle("fullwindow");
    controlElems.forEach(e=>e.classList.toggle("fullwindow"));
    shortcut.remove("Esc");
  });
}, false);

console.log = msg => logElem.innerHTML += `${msg}<br>`;
console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;

async function startCapture() {
  logElem.innerHTML = "";

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();

    // 追加 video要素クリックでpip切り替え
    videoElem.addEventListener("click", ()=>{
        if (window.document.pictureInPictureElement){
            window.document.exitPictureInPicture();
        }else{
            videoElem.requestPictureInPicture();
        }
    });
  } catch(err) {
    console.error("Error: " + err);
  }
}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];

  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}


// 追記 自動で動き出してほしい
startElem.click();