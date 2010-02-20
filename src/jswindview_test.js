

function assert(caller,msg, expected, actual) {
	if (expected != actual) {
		print("fail: " + caller + " " +  msg + ": expected: " 
				+ expected + " actual: " + actual)
	}
}

function angleHelper(angle, expectedX, expectedY) {
	var p = new Point(0,0);
	p.move(10, angle);
	assert(arguments.callee.name, "angle: " + angle, 
			expectedX, Math.round(p.x));
	assert(arguments.callee.name, "angle: " + angle, 
			expectedY, Math.round(p.y));
}

function testMove() {

	angleHelper(45,7,-7);
	angleHelper(90, 10, 0);
	angleHelper(135,7,7);
	angleHelper(225,-7,7);
	angleHelper(315,-7,-7);

}

testMove();

