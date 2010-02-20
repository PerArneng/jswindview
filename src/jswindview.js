var compassToDegrees = {
	"N":  0, "NNE": 23, "NE": 45, "ENE": 68,
	"E": 90, "ESE":113, "SE":135, "SSE":158,
	"S":180, "SSW":203, "SW":225, "WSW":248,
	"W":270, "WNW":293, "NW":315, "NNW":338
};

function JSWindView(canvasId, imageId, compassDirection) {
	
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
	this.img = document.getElementById(imageId);

	var direction = this.convertDirection(compassDirection)
	if (!direction)
		direction = 0;

	this.field = new PointField(-10, -10, 530, 530, 1.0, direction);
	
}

JSWindView.prototype.convertDirection = function(compassDirection) {
	var degrees = compassToDegrees[compassDirection];
	
	// change so that the wind blows from the
	// specified direction (invert degrees)	
	if (degrees >= 180) {
		degrees = degrees - 180
	} else {
		degrees = degrees + 180
	}

	return degrees;
}

JSWindView.prototype.setDirection = function(compassDirection) {
	var newDirection = this.convertDirection(compassDirection);
	this.field.direction = newDirection
}

JSWindView.prototype.setSpeed = function(speed) {
	this.field.setSpeed(speed)
}

JSWindView.prototype.draw = function() {
	var c = this.context;

	c.save();
	c.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);

	this.field.update();
	this.field.draw(c);

	c.restore();

}


JSWindView.prototype.start = function() {

	window.setInterval(
		function(jsww) {
			jsww.draw();
		} 
		, 50, this);

}

function Point(x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.move = function(speed, angle) {
	var quad = Math.floor(angle / 90);	
	var quadAngle = angle - (quad*90);	
	var radians = quadAngle * (Math.PI / 180);

	var hypotenuse = speed;
	var opposite = Math.abs(Math.sin(radians) * hypotenuse)
	var adjacent = Math.abs(Math.cos(radians) * hypotenuse)

	var dx = 0
	var dy = 0

	if (quad == 0) {
		dy = dy - adjacent
		dx = dx + opposite
	} else if (quad == 1) {
		dy = dy + opposite
		dx = dx + adjacent
	} else if (quad == 2) {
		dy = dy + adjacent
		dx = dx - opposite
	} else if (quad == 3) {
		dy = dy - opposite
		dx = dx - adjacent
	}

	this.x = this.x + dx;
	this.y = this.y + dy;

}

function PointField(x, y, width, height, speed, direction) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.direction = direction;
	this.speed = (speed/200.0);
	this.points = [];

	var index = 0;
	for (x=0;x<10;x++) {
		for (y=0;y<10;y++) {
			if (Math.random() > 0.6)
				this.points[index++] = new Point(x/10.0,y/10.0)
		}
	}
}

PointField.prototype.setSpeed = function(speed) {
	this.speed = (speed/200.0)
}

PointField.prototype.update = function() {
	for (var i in this.points) {
		var p = this.points[i]
		p.move(this.speed, this.direction);
		if (p.x < 0) p.x = 1
		if (p.x > 1) p.x = 0
		if (p.y < 0) p.y = 1
		if (p.y > 1) p.y = 0
	}
} 

PointField.prototype.draw = function(ctx) {
	ctx.save();

	for (var i in this.points) {
		var p = this.toPixel(this.points[i])
		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		ctx.lineTo(p.x+1, p.y+1);
		ctx.closePath();
		ctx.stroke();	
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	}

	ctx.restore();
}

PointField.prototype.toPixel = function(p) {
	return new Point(p.x * this.width + this.x,
					 p.y * this.height + this.y)
}




