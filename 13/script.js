console.clear();

let drops = [],
	 droplets = [];

let spawnTimeRate = 25;

function setup() {
	createCanvas(innerWidth, innerHeight);
}

function draw() {
	background(0);

	drops.forEach((drop, index) => {
		drop.update();
		if (drop.destroyed) {
			let n = floor(random(8, 15));
			for (let i = 0; i < n; i++) {
				droplets.push(
					new Droplets(drop.position.x, drop.position.y, {
						velocity: p5.Vector.random2D().setMag(random(8, 10)),
						gravity: createVector(0, 0.1),
						radius: random(6, 8),
						timeToLive: 180,
						friction: 0.2,
					})
				);
			}
			drops.splice(index, 1);
		}
	});

	droplets.forEach((droplet, index) => {
		droplet.update();
		if (droplet.timeToLive <= 0) droplets.splice(index, 1);
	});

	if (frameCount % spawnTimeRate == 0) {
		drops.push(new Drop(random(width), random(-100, -200)));
		spawnTimeRate = floor(random(45, 100));
	}
}

function windowResized() {
	drops = [];
	droplets = [];
	resizeCanvas(innerWidth, innerHeight);
}


class Drop {
	constructor(x, y, options = {}) {
		this.velocity = options.velocity || createVector(random(0, 0), random(-2, 2));
		this.position = options.position || createVector(x, y);
		this.gravity = options.gravity || createVector(0, 0.65);
		this.friction = options.friction || 0.45;
		this.radius = options.radius || floor(random(30, 40));
		this.decreaseInRadius = options.decreaseInRadius || 10;
		this.value = String.fromCharCode(0x30a0 + round(random(0, 96)));
		this.destroyed = false;
		this.angle = random(TWO_PI);
		this.color = options.color || "#00ff00";
	}

	draw() {
		push();
		translate(this.position.x, this.position.y);
		rotate(this.angle);
		fill(this.color);
		noStroke();
		textSize(this.radius);
		text(this.value, -this.radius / 2, this.radius / 4);
		pop();
	}

	update() {
		if (this.radius <= 0) this.destroyed = true;

		this.position.add(this.velocity);
		this.velocity.add(this.gravity);

		this.draw();
		this.edge();
		this.angle += 0.05;
	}

	edge() {
		if (this.position.y + this.radius / 2 >= height) {
			this.velocity.y *= -1 * this.friction;
			this.radius -= this.decreaseInRadius;
			this.break(floor(random(2)));
		}
	}

	break(n) {
		for (let i = 0; i < n; i++) {
			droplets.push(
				new Droplets(this.position.x, this.position.y, {
					velocity: createVector(
						random(-5, 5),
						[random(-15, -10), random(10, 15)][floor(random(2))]
					),
					gravity: createVector(0, 0.4),
					radius: random(6, 10),
					timeToLive: 200,
					friction: 0.75,
				})
			);
		}
	}
}

class Droplets extends Drop {
	constructor(x, y, options = {}) {
		super(x, y, options);
		this.timeToLive = options.timeToLive;
	}
	update() {
		this.color = color(this.color);
		this.color.setAlpha(this.timeToLive);

		this.position.add(this.velocity);
		this.velocity.add(this.gravity);
		super.draw();
		this.edge();
		this.timeToLive -= 1;
		this.angle -= 0.1;
	}
	edge() {
		if (this.position.y + this.radius >= height) {
			this.velocity.y = -this.velocity.y * this.friction;
		}
	}
}