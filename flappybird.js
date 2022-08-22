var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var interval;

function gameOverFunc() {
	clearInterval(interval);
}

function distanceSquared(x1, y1, x2, y2) {
	return (x1 - x2) ** 2 + (y1 - y2) ** 2
}

class Bird {
	constructor() {
		this.velocity = 0;
		this.pointX = 350;
		this.pointY = 250;
		this.gameOver = false;
	}

	drawPoint() {
		ctx.clearRect(0, 0, 1000, 500);
		ctx.beginPath();
		ctx.arc(this.pointX, this.pointY, 20, 0, 2 * Math.PI);
		ctx.fillStyle = "#fefe33";
		ctx.fill();
		//ctx.strokeStyle = "#fefe33";
		ctx.stroke();
	}

	changeVelocity() {
		this.velocity += 0.005 * 1000;
	}

	determineNewY() {
		this.pointY += this.velocity * 0.005;
	}

	isBirdOutOfCanvas() {
		if((this.pointY > 480) || (this.pointY < 20)) {
			gameOverFunc();
		}
	}
}

class Barrier {
	constructor(y) {
		this.x = 1020;
		this.y = y;
	}

	move() {
		this.x -= 1;
	}

	draw() {
		ctx.fillStyle = "#006600";
		ctx.fillRect(this.x - 15, 0, 30, this.y);
		ctx.fillRect(this.x - 15, this.y + 120, 30, 500 - 120 - this.y);
	}

	hitByBirdFromSide(centerX, centerY) {
		return ((((centerX + 20 > this.x - 15) & (centerX < this.x)) | ((centerX - 20 < this.x + 15) & (centerX > this.x))) & ((centerY < this.y) | (centerY > this.y + 120)))
	}

	hitByBirdInside(centerX, centerY) {
		return ((centerX > this.x - 15) & (centerX < this.x + 15) & ((centerY - 20 < this.y) | (centerY + 20 > this.y + 120)))
	}

	hitByBirdOnEdge(centerX, centerY) {
		return ((distanceSquared(centerX, centerY, this.x - 15, this.y) < 400) | (distanceSquared(centerX, centerY, this.x + 15, this.y) < 400) | (distanceSquared(centerX, centerY, this.x - 15, this.y + 120) < 400) | (distanceSquared(centerX, centerY, this.x + 15, this.y + 120) < 400))
	}

	hitByBird(centerX, centerY) {
		return (this.hitByBirdFromSide(centerX, centerY) | this.hitByBirdInside(centerX, centerY) | this.hitByBirdOnEdge(centerX, centerY))
	}

	isGameOver(bird) {
		if (this.hitByBird(bird.pointX, bird.pointY)) {
			gameOverFunc();
		}
	}
}

var barriers = [new Barrier(Math.floor(Math.random() * 381))];
var myBird = new Bird();

function game() {
	myBird.changeVelocity();
	myBird.determineNewY();
	myBird.drawPoint();
	myBird.isBirdOutOfCanvas();
	for (let b = 0; b < barriers.length; b++) {
		barriers[b].move();
		barriers[b].draw();
		barriers[b].isGameOver(myBird);
	}
	if (barriers[0].x < -20) {
		barriers.shift();
	}
}

function barrierNew() {
	barriers.push(new Barrier(Math.floor(Math.random() * 401)));
}

function keyDown(event) {
	if(event.keyCode == 38) {
		myBird.velocity = -350;
	}
}

document.addEventListener('keydown', keyDown);

game()

interval = setInterval(game, 5);
setInterval(barrierNew, 2000);
