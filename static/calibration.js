var positions = {"Positions": [
  [1, 2],
  [3, 4],
  [5, 6]
]}

function sendPositions() {
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