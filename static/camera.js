var vid = document.getElementById('videoel');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');

var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

var counter = 0

function enablestart() {
	var startbutton = document.getElementById('startbutton');
	startbutton.value = "start";
	startbutton.disabled = null;
}

var insertAltVideo = function(video) {
	if (supports_video()) {
		if (supports_ogg_theora_video()) {
			video.src = "./media/cap12_edit.ogv";
		} else if (supports_h264_baseline_video()) {
			video.src = "./media/cap12_edit.mp4";
		} else {
			return false;
		}
		//video.play();
		return true;
	} else return false;
}
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

var videoSelector = {video : true};

if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
	var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
	if (chromeVersion < 20) {
		videoSelector = "video";
	}
};

navigator.getUserMedia(videoSelector, function( stream ) {
	if (vid.mozCaptureStream) {
		vid.mozSrcObject = stream;
	} else {
		vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
	}
	vid.play();
}, function() {
	alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
});

vid.addEventListener('canplay', enablestart, false);

function startVideo() {
	// start video
	vid.play();
	// start tracking
	ctrack.start(vid);
	// start loop to draw face
	drawLoop();
}

function drawLoop() {
	requestAnimFrame(drawLoop);
	overlayCC.clearRect(0, 0, 800, 600);
	//psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
	if (ctrack.getCurrentPosition()) {
		ctrack.draw(overlay);
		// alert(counter)
		counter++
		var positions = {"data": ctrack.getCurrentPosition()}
		console.log(JSON.stringify(positions))
		chat.send(JSON.stringify(positions))
	}
}

var chat = new WebSocket("ws://"+window.location.host+"/ws_camera")
chat.onmessage = receiveMessage
chat.onerror = displayError
chat.onclose = displayError
chat.onopen = startSending

function receiveMessage(evt) {
    data = JSON.parse(evt.data)
    alert(data)
}

function displayError(event) {
    console.log("Connection lost!")
}

function startSending(evt) {
	console.log("socket established")
}
