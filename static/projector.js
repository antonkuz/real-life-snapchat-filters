var positions = []
var counter = 0

function setup() {
    createCanvas(windowWidth, windowHeight);
    createCanvas(windowWidth, windowHeight);
    background(0)
    
    //load images
    noLoop()
    frameRate(20)
}

function draw() {
    fill(0);
    rect(0,0,width,height);

    counter++
    // console.log("--------"+counter+"--------")
    // console.log("positions[0][2]="+positions[0][2])
    // console.log("positions[23][0]="+positions[23][0])
    // console.log("positions[35][1]="+positions[35][1])
    // console.log("positions[28][0]="+positions[28][0])
    // console.log("positions[39][1]="+positions[39][1])
    //drawing blush circles
    pop();
    noStroke();
    fill(255,102,102)
    //left center: x of 23, y of 35, radius distance between 27 and 25
    ellipse(positions[23][0],positions[35][1],positions[25][0]-positions[27][0]); 
    //right center: x of 28, y of 39, radius distance between 32 and 30
    ellipse(positions[28][0],positions[39][1],positions[32][0]-positions[30][0]); 

    push();
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
    // console.log("RECEIVED data")
    if (data["type"] == "positions") {
        positions = data["Positions"]
        readyToLoop = true
        redraw()
    }
}

function displayError(event) {
    console.log("Connection lost!")
}
