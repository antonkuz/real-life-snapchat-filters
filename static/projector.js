function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  fill(0);
  rect(0,0,width,height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

var chat = new WebSocket("ws://"+window.location.host+"/ws_projector")
chat.onmessage = receiveMessage
chat.onerror = displayError
chat.onclose = displayError

function receiveMessage(evt) {
    data = JSON.parse(evt.data)
    console.log(data)
}

function displayError(event) {
    console.log("Connection lost!")
}