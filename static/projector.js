var positions = []
var transformation_matrix = [[1,0], [0,1]];
var face_array = [];
//the points in the calibration image are at 
//var calib_points = [[200,300], [600,300]];
var calib_points = [[200, 400, 600], [300, 300, 400]];
// var lastTime = new Date().getTime();

var x_offset = 0
var y_offset = 0

var maskOrder = 0

$(document).keypress(function(e) {
    if(e.which == 13) {
        maskOrder += 1
    }
});

$(document).keydown(function(e) {
    switch(e.which) {
        case 38: // up
            y_offset -= 5
            break;
        case 40: //down
            y_offset += 5
            break;
        case 37: //left
            x_offset -= 5
            break;
        case 39: //right
            x_offset += 5
            break;
        default:
    }
});

function setup() {
    createCanvas(windowWidth, windowHeight);
    createCanvas(windowWidth, windowHeight);
    background(0)
    
    //load images
    // white_mask = loadImage("./static/white_mask.png");
    left_flower = loadImage("./static/left_flower.png");
    right_flower = loadImage("./static/right_flower.png");
    nose = loadImage("./static/nose.png");
    mask = loadImage("./static/mask.png");
    mouth = loadImage("./static/mouth.png");
    deer = loadImage("./static/deer.png")
    tiger = loadImage("./static/tiger.png")
    rudolph = loadImage("./static/rudolph.png")


    noLoop()
    frameRate(20)
}

function draw() {
    switch(maskOrder%3) {
        case 0:
            drawMaskOne()
            break
        case 1:
            drawMaskTwo()
            break
        case 2:
            drawMaskThree()
            break
        default:
    }
}

function drawMaskTwo() {
    fill(0);
    rect(0,0,width,height);
    rotation = degrees(atan((positions[33][0]-positions[7][0])/(positions[7][1]-positions[33][1])));

    //drawing blush circles
    push();
    imageMode(CENTER);
    faceCenterX = positions[62][0];
    faceCenterY = positions[62][1];
    faceRotation = rotation;
    faceSizeX = dist(positions[1][0],positions[1][1],positions[13][0],positions[13][1]);
    faceSizeY = dist(positions[7][0],positions[7][1],positions[33][0],positions[33][1])+dist(positions[33][0],positions[33][1],positions[62][0],positions[62][1]);
    translate(faceCenterX, faceCenterY);
    rotate(radians(faceRotation));
    image(tiger, 0, 0, faceSizeX*1.2, faceSizeY*1.4);
    pop();
}

function drawMaskThree() {
    fill(0);
    rect(0,0,width,height);
    rotation = degrees(atan((positions[33][0]-positions[7][0])/(positions[7][1]-positions[33][1])));

    //drawing blush circles
    push();
    imageMode(CENTER);
    faceCenterX = positions[62][0];
    faceCenterY = positions[62][1];
    faceRotation = rotation;
    faceSizeX = dist(positions[1][0],positions[1][1],positions[13][0],positions[13][1]);
    faceSizeY = dist(positions[7][0],positions[7][1],positions[33][0],positions[33][1])+dist(positions[33][0],positions[33][1],positions[62][0],positions[62][1]);
    translate(faceCenterX, faceCenterY);
    rotate(radians(faceRotation));
    image(deer, 0, 0, faceSizeX*4, faceSizeY*3);
    pop();

    push();
    imageMode(CENTER);
    noseCenterX = positions[62][0];
    noseCenterY = positions[62][1];
    noseRotation = rotation;
    noseScaleFactor = dist(positions[37][0],positions[37][1],positions[41][0],positions[41][1]);;
    translate(noseCenterX, noseCenterY);
    rotate(radians(noseRotation));
    image(rudolph, 0, 0, noseScaleFactor*1.5, noseScaleFactor*1.5);
    pop();
}

function drawMaskOne() {
    fill(0);
    rect(0,0,width,height);
    rotation = degrees(atan((positions[33][0]-positions[7][0])/(positions[7][1]-positions[33][1])));

    //drawing blush circles
    push();
    imageMode(CENTER);
    faceCenterX = positions[62][0];
    faceCenterY = positions[62][1];
    faceRotation = rotation;
    faceSizeX = dist(positions[1][0],positions[1][1],positions[13][0],positions[13][1]);
    faceSizeY = dist(positions[7][0],positions[7][1],positions[33][0],positions[33][1])+dist(positions[33][0],positions[33][1],positions[62][0],positions[62][1]);
    translate(faceCenterX, faceCenterY);
    rotate(radians(faceRotation));
    image(mask, 0, 0, faceSizeX*2, faceSizeY*1.5);
    pop();

    push();
    //var positions[#][x0y1] = 60
    //image(white_mask, 60, 60, 300, 400) //(white_mask, positions[1][0], positions[21][1]-(positions[62][1]-positions[33][1]), positions[13][0]-positions[1][0], (positions[7][1]-positions[21][1])+(positions[62][1]-positions[33][1]));
    imageMode(CENTER);
    leftEyeCenterX = positions[27][0]-5;
    leftEyeCenterY = positions[27][1];
    leftEyeRotation = rotation;
    leftEyeSize = dist(positions[23][0],positions[23][1],positions[25][0],positions[25][1]);
    translate(leftEyeCenterX, leftEyeCenterY);
    rotate(radians(leftEyeRotation));
    image(left_flower, 0, 0, leftEyeSize*2.7, leftEyeSize*2.7); //(left_flower, positions[1][0], positions[21][1]-(positions[25][0]-positions[27][0]), positions[42][0]-positions[0][0], positions[42][0]-positions[0][0]);
    //image(right_flower, 335, 165, 130, 130); //(right_flower, positions[43][0], positions[17][1]-(positions[32][0]-positions[30][0]), positions[14][0]-positions[43][0], positions[14][0]-positions[43][0]);
    //image(nose,215,200,70,70); //(nose, positions[35][0], positions[41][1], positions[39][0]-positions[35][1], positions[39][0]-positions[35][1]);
    pop();

    push();
    imageMode(CENTER);
    rightEyeCenterX = positions[32][0]+5;
    rightEyeCenterY = positions[32][1];
    rightEyeRotation = rotation
    rightEyeSize = dist(positions[30][0],positions[30][1],positions[28][0],positions[28][1]); //Default size = 100 x 100 px. Therefore 130 x 130 px
    translate(rightEyeCenterX, rightEyeCenterY);
    rotate(radians(rightEyeRotation));
    image(right_flower, 0, 0, rightEyeSize*2.7, rightEyeSize*2.7);
    pop();

    push();
    imageMode(CENTER);
    noseCenterX = positions[62][0];
    noseCenterY = positions[62][1];
    noseRotation = rotation;
    noseScaleFactor = dist(positions[37][0],positions[37][1],positions[41][0],positions[41][1]);;
    translate(noseCenterX, noseCenterY);
    rotate(radians(noseRotation));
    image(nose, 0, 0, noseScaleFactor*1.5, noseScaleFactor*1.5);
    pop();

    push();
    imageMode(CENTER);
    mouthCenterX = (positions[60][0]+positions[57][0])/2;
    mouthCenterY = (positions[60][1]+positions[57][1])/2;
    mouthRotation = rotation;
    mouthSize = dist(positions[44][0],positions[44][1],positions[50][0],positions[50][1]);
    translate(mouthCenterX, mouthCenterY+7);
    rotate(radians(mouthRotation));
    image(mouth, 0, 0, mouthSize*2, mouthSize*0.8);
    pop();
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
    if (data["type"] == "calibration"){
        var detected_points = data["Positions"];
    	var new_array = [];
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

		//var inv_detected_points = numeric.inv(new_array);
		//transformation_matrix = numeric.dot(inv_detected_points, calib_points);
        // transpose new_array
        new_array = numeric.transpose(new_array)
        new_array.push([1, 1, 1])
        transformation_matrix = numeric.dot(calib_points, numeric.inv(new_array));
    }
    else if (data["type"] == "positions"){
    	var raw_positions = data["Positions"]
        
        // ATTEMPT 1
        //var lin_crop_matrix = [[1,0],[0,1],[0,0]];
        //var trans_crop_matrix = [[0],[0],[1]];
        //var just_lin = numeric.dot(transformation_matrix, lin_crop_matrix);
        //var just_trans = numeric.dot(transformation_matrix, trans_crop_matrix);

        // ATTEMPT 2
        // var raw_pos_trans = numeric.transpose(raw_positions);
        // var ones = numeric.rep([raw_positions.length], 1);
        // raw_pos_trans.push(ones);
        // var positions_trans = numeric.dot(transformation_matrix, raw_pos_trans);
        // positions = numeric.transpose(positions_trans);

        //for (var i = 0; i < positions.length; i++) {
        //    positions[i][0] += just_trans[0];
        //    positions[i][1] += just_trans[1];
        //}

        positions = numeric.dot(raw_positions, transformation_matrix);
        
        // HACK
        for (var i = 0; i < positions.length; i++) {
            positions[i][0] += x_offset
            positions[i][1] += y_offset
        }
        redraw()
    }
	else {
		console.log("Didn't recognize "+data["type"]);
	}
}

function displayError(event) {
    console.log("Connection lost!")
}
