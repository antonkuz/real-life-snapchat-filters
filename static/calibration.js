var detected_points = [];
$(window).on('load', function(){
    "use strict";

    // lets do some fun
    var video = document.getElementById('videoel');
    var canvas = document.getElementById('overlay');
    // try {
        var attempts = 0;
        var readyListener = function(event) {
            findVideoSize();
        };
        var findVideoSize = function() {
            if(video.videoWidth > 0 && video.videoHeight > 0) {
                video.removeEventListener('loadeddata', readyListener);
                onDimensionsReady(video.videoWidth, video.videoHeight);
            } else {
                if(attempts < 10) {
                    attempts++;
                    alert("failed attempt")
                    setTimeout(findVideoSize, 200);
                } else {
                    onDimensionsReady(640, 480);
                }
            }
        };
        var onDimensionsReady = function(width, height) {
            demo_app(width, height);
            compatibility.requestAnimationFrame(tick);
        };

        video.addEventListener('loadeddata', readyListener);

        compatibility.getUserMedia({video: true}, function(stream) {
            try {
                video.src = compatibility.URL.createObjectURL(stream);
            } catch (error) {
                video.src = stream;
            }
            setTimeout(function() {
                    video.play();
                }, 500);
        }, function (error) {
            $('#canvas').hide();
            $('#log').hide();
            $('#no_rtc').html('<h4>WebRTC not available.</h4>');
            $('#no_rtc').show();
        });
    // } catch (error) {
    //     $('#canvas').hide();
    //     $('#log').hide();
    //     $('#no_rtc').html('<h4>Something goes wrong...</h4>');
    //     $('#no_rtc').show();
    // }

    var ctx,canvasWidth,canvasHeight;
    var img_u8, corners;

    function demo_app(videoWidth, videoHeight) {
        canvasWidth  = canvas.width;
        canvasHeight = canvas.height;
        ctx = canvas.getContext('2d');

        ctx.fillStyle = "rgb(0,255,0)";
        ctx.strokeStyle = "rgb(0,255,0)";

        img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8_t | jsfeat.C1_t);

        corners = [];
        var i = 640*480;
        while(--i >= 0) {
            corners[i] = new jsfeat.keypoint_t(0,0,0,0);
        }

        // YAPE detector needs init first
        jsfeat.yape.init(canvasWidth, canvasHeight, 5, 1);
    }

    function tick() {
        compatibility.requestAnimationFrame(tick);
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            ctx.drawImage(video, 0, 0, 640, 480);
            var imageData = ctx.getImageData(0, 0, 640, 480);

            jsfeat.imgproc.grayscale(imageData.data, 640, 480, img_u8);

            jsfeat.imgproc.box_blur_gray(img_u8, img_u8, 2, 0);
            detected_points = [];
            var count = jsfeat.yape.detect(img_u8, corners, 5);
            
            //convert corners to normal array
            for(var i = 0; i < count; i++) {
              detected_points[i] = [corners[i].x, corners[i].y];
            }
            // console.log(detected_points.length)
            // render result back to canvas
            var data_u32 = new Uint32Array(imageData.data.buffer);
            render_corners(corners, count, data_u32, 640);

            ctx.putImageData(imageData, 0, 0);
        }
    }

    function render_corners(corners, count, img, step) {
        var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
        for(var i=0; i < count; ++i)
        {
            var x = corners[i].x;
            var y = corners[i].y;
            var off = (x + y * step);
            img[off] = pix;
            img[off-1] = pix;
            img[off+1] = pix;
            img[off-step] = pix;
            img[off+step] = pix;
        }
    }

    $(window).on('unload', function() {
        video.pause();
        video.src=null;
    });
});




function sendPositions() {
  var positions = {"Positions": detected_points}
  console.log(positions)
	$.ajax({
        type : "POST",
        url: "post_positions",
        data: JSON.stringify(positions),
        contentType: 'application/json; charset=utf-8',
        success: function(e) {
            console.log(e)
        }
    })
}