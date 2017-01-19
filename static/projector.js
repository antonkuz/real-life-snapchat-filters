var transformation_matrix = [[1,0], [0,1]];
var face_array = [];
//the points in the calibration image are at 
var calib_points = [[200,300], [600,300]];

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
    var detected_points = data["data"];
    console.log(data);
    if (data["type"] == "calibration"){
    	new_array = [];
    	for(var i = 0; i < detected_points.length; i++){
    		// if detected[i] is not in new_array, add it
    		var isUnique = true
    		for (var j = 0; j < new_array.length; j++) {
    			if (detected_points[i][0] == new_array[j][0] && detected_points[i][1] == new_array[j][1]) {
    				isUnique = false
    			}
    		}
    		if (isUnique) {
    			new_array.push(detected_points[i])
    		} 
    	}
    	console.log("new array size = "+new_array.length)

		var inv_calib_points = numeric.inv(calib_points);
		var inv_transform = numeric.dot(inv_calib_points, new_array);
		transformation_matrix = numeric.inv(inv_transform);
    }
    else if (data["type"] == "positions"){
    	face_array = data;
    }
	else {
		console.log("Didn't recognize"+data["type"]);
	}
}

function displayError(event) {
    console.log("Connection lost!")
}