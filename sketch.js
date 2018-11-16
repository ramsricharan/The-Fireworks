var fireworks = [];
var explodeSound;
var myVolume = 1;
var muteButton;


function preload() {
  explodeSound = loadSound('assets/sounds/explode.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(30);

  // Create mute button 
  muteButton = createButton('Sound : OFF');
  muteButton.position(5, 5);
  muteButton.mousePressed(muteButtonPressed);
}

function draw() {
  background(0, 30);

  // Generate new fireworks less often
  if (random(2) < 0.1) {
    fireworks.push(new Firework());
  }

  // Update and show each firework that we have
  for (var i = fireworks.length - 1; i > 0; i--) {
    fireworks[i].update();
    fireworks[i].show();

    // Remove the firework from memory if finished
    if (fireworks[i].isFinished) {
      fireworks.splice(i, 1);
    }
  }

}



function muteButtonPressed() {
  if (myVolume === 0) {
    myVolume = 1;
    muteButton.html('Sound : OFF');
  } else {
    myVolume = 0;
    muteButton.html('Sound : ON');
  }

}




function Firework() {

  this.particles = [];

  this.isFinished = false;
  this.isExploded = false;
  let gravity = createVector(0, 0.2);
  this.x = random(width);
  this.y = height;
  this.firework = new particle(this.x, this.y, true, 255, 150, 0);


  // Apply physics
  this.update = function() {

    if (!this.isExploded) {
      this.firework.update();
      this.firework.applyForce(gravity);

      if (this.firework.vel.y >= 0) {
        this.isExploded = true;
        this.explode();
      }
    } else {
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
        this.particles[i].applyForce(gravity);
      }
    }
  }

  // Show the firework
  this.show = function() {
    if (!this.isExploded) {
      this.firework.show();
    }

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
      if (this.particles[i].done()) {
        this.isFinished = true;
      }
    }
  }


  this.explode = function() {

    // Play sound

    //var panning = map(this.firework.pos.x, 0, width, -1, 1);
    //explodeSound.pan(panning, 0);
    explodeSound.setVolume(myVolume);
    explodeSound.play();

    var tempR = random(255);
    var tempG = random(255);
    var tempB = random(255);

    for (var i = 0; i <= 100; i++) {
      this.particles.push(new particle(this.firework.pos.x, this.firework.pos.y, false, tempR, tempG, tempB));
    }
  }

}




function particle(x, y, firework, R, G, B) {

  this.lifespan = 255;
  this.firework = firework;
  this.R = R;
  this.G = G;
  this.B = B;

  this.pos = createVector(x, y);
  this.acc = createVector(0, 0);

  if (this.firework) {
    var temp = height / 90 * -1;
    this.vel = createVector(random(-1, 1), random(temp * 2, temp));
  } else {
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(15.20));
  }



  this.applyForce = function(force) {
    this.acc.add(force);
  }


  this.update = function() {
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }


  this.show = function() {

    if (!this.firework) {
      strokeWeight(3);
      stroke(this.R, this.G, this.B, this.lifespan);
    } else {
      strokeWeight(2);
      stroke(this.R, this.G, this.B);
    }


    point(this.pos.x, this.pos.y);
  }


  this.done = function() {
    return (this.lifespan < 0)
  }

}
