let parametricCurve;
// let count = 0;

let recMode = false;

let can; 
// let fade = 0;
let fade, amount;

function setup() {
  can=createCanvas(windowWidth, windowHeight);
  can.parent("#bg")
  parametricCurve = new ParametricCurve(100); // Create an instance with 100 circles
  parametricCurve2 = new ParametricCurve2(100);
  parametricCurve3 = new ParametricCurve3(150);
  fade = 0
}

// Add this new function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  console.log (frameCount);

  
  translate(width / 2, height / 2);
  background('#fff');
  // if(frameCount < 133){

     frameRate(20);
    parametricCurve.update(); // Update positions
    parametricCurve.display(-1); // Display circles

  // }else if (frameCount < 266 ){
  //   frameRate(1);
  //   background(0);
  //   parametricCurve2.update();
  //   parametricCurve2.display();

  // }else if(frameCount < 399){
  //   frameRate(1);
  //   background(0);
  //   parametricCurve3.update();
  //   parametricCurve3.display();

  // }
  // else if (frameCount > 500){
  //   frameCount = 0; 
  // }
  recordit();
}


function keyPressed() {

  if (keyIsPressed === true) {
      let k = key;
      console.log("k is " + k);

      if (k == 's' || k == 'S') {
          console.log("Stopped Recording");
          recMode = false;
          noLoop();
      }

      if (k == ' ') {
          console.log("Start Recording");
          recMode = true;
          loop();
      }
  }
}

function recordit() {  // new version
if (recMode == true) {
    let ext = nf(frameCount, 4);
    saveCanvas(can, 'frame-' + ext, 'png');
    console.log("rec " + ext);
  }
}



class ParametricCurve {
  constructor(numCircles) {
    this.numCircles = numCircles;
    this.circles = [];
    this.t = -40; // Initial parameter value

    // Initialize circles with random colors
    for (let i = 0; i < this.numCircles; i++) {
      let size = this.x2(this.t - i) + 20; // Calculate size based on time
      let col = color(random(255), random(255), random(255), 50);
      this.circles.push({ x: 0, y: 0, size, col }); // Store circle properties in an object
    }
  }

  update() {
    for (let i = 0; i < this.numCircles; i++) {
      this.circles[i].x = this.x1(this.t + i) + this.circles[i].size / 2;
      this.circles[i].x = this.x2(this.t - i) + this.circles[i].size / 2;
      this.circles[i].y = this.y1(this.t - i) + this.circles[i].size / 2;
      this.circles[i].y = this.y2(this.t - i) + this.circles[i].size / 2;
    }
    this.t += 0.10; // Increment parameter
  }

  display(sz) {
    let count = 0;
    for (let circle of this.circles) {
      noStroke();
      fill(circle.col);
      push();
      translate(-20, -20)
      scale(sz)
      rotate(count)
      ellipse(circle.x, circle.y, circle.size, circle.size);
      
      pop();
      ellipse(circle.x/2, circle.y/2, circle.size/2, circle.size/2);
      count += .75;
    }
  }

  // Parametric equations
  x1(t) {
    return tan(t / 10) * 225 + 1/tan(t / 20) * 125 + 1/tan(t / 30) * 125;
  }

  y1(t) {
    return sin(t / 10) * 225 + sin(t / 20) * 125 + sin(t / 30) * 125;
  }

  x2(t) {
    return tan(t / 15) * 125 + tan(t / 25) * 125 + tan(t / 35) * 125;
  }

  y2(t) {
    return sin(t / 15) * 125 + sin(t / 25) * 125 + sin(t / 35) * 125;
  }
}

class ParametricCurve2 {
  constructor(numCircles) {
    this.numCircles = numCircles;
    this.circles = [];
    this.t = -40; // Initial parameter value

    // Initialize circles with random colors
    for (let i = 0; i < this.numCircles; i++) {
      let size = this.x2(this.t - i) + 20; // Calculate size based on time
      let col = color(random(255), random(255), random(255), 50);
      this.circles.push({ x: 0, y: 0, size, col }); // Store circle properties in an object
    }
  }

  update() {
    for (let i = 0; i < this.numCircles; i++) {
      this.circles[i].x = this.x1(this.t - i) + this.circles[i].size / 4;
      this.circles[i].x = this.x2(this.t - i) + this.circles[i].size / 4;
      this.circles[i].y = this.y1(this.t - i) + this.circles[i].size / 4;
      this.circles[i].y = this.y2(this.t - i) + this.circles[i].size / 4;
    }
    this.t += 0.10; // Increment parameter
  }

  display(sz) {
    let count = 0;
    for (let circle of this.circles) {
      noStroke();
      fill(circle.col);
      push();
      translate(-20, -20)
      scale(sz)
      rotate(count)
      ellipse(circle.x, circle.y, circle.size, circle.size);
      
      pop();
      push();
      translate(-10, -10)
      scale(-1)
      rotate(count)
      ellipse(circle.x, circle.y, circle.size, circle.size);
      
      pop();
      count += 1;
    }
  }

  // Parametric equations
  x1(t) {
    return cos(t / 10) * 225 + cos(t / 20) * 125 + cos(t / 30) * 125;
  }

  y1(t) {
    return sin(t / 10) * 225 + sin(t / 20) * 125 + sin(t / 30) * 125;
  }

  x2(t) {
    return cos(t / 15) * 125 + cos(t / 25) * 125 + cos(t / 35) * 125;
  }

  y2(t) {
    return sin(t / 15) * 125 + sin(t / 25) * 125 + sin(t / 35) * 125;
  }
}

class ParametricCurve3 {
  constructor(numCircles) {
    this.numCircles = numCircles;
    this.circles = [];
    this.t = -40; // Initial parameter value

    // Initialize circles with random colors
    for (let i = 0; i < this.numCircles; i++) {
      let size = this.x2(this.t - i) + 20; // Calculate size based on time
      let col = color(random(255), random(255), random(255), 100);
      this.circles.push({ x: 0, y: 0, size, col }); // Store circle properties in an object
    }
  }

  update() {
    for (let i = 0; i < this.numCircles; i++) {
      this.circles[i].x = this.x1(this.t - i) + this.circles[i].size / 4;
      this.circles[i].x = this.x2(this.t - i) + this.circles[i].size / 4;
      this.circles[i].y = this.y1(this.t - i) + this.circles[i].size / 4;
      this.circles[i].y = this.y2(this.t - i) + this.circles[i].size / 4;
    }
    this.t += 0.05; // Increment parameter
  }

  display(sz) {
    let count = 0;
    for (let circle of this.circles) {
      noStroke();
      fill(circle.col);
      push();
      translate(0, 0);
      scale(.03)
      rotate(count)
      ellipse(circle.x, circle.y, circle.size, circle.size);
      
      // pop();
      // push();
      // translate(-10, -10)
      // scale(0.5)
      // rotate(count)
      // ellipse(circle.x, circle.y, circle.size, circle.size);
      
      pop();
      count += .75;
    }
  }

  // Parametric equations
  x1(t) {
    return 1/cos(t / 10) * 225 + 1/cos(t / 20) * 125 + 1/cos(t / 30) * 100;
  }

  y1(t) {
    return sin(t / 10) * 225 + sin(t / 20) * 125 + sin(t / 30) * 100;
  }

  x2(t) {
    return 1/cos(t / 15) * 125 + 1/cos(t / 25) * 125 + 1/cos(t / 35) * 100;
  }

  y2(t) {
    return 1/sin(t / 15) * 125 + 1/sin(t / 25) * 125 + 1/sin(t / 35) * 100;
  }
}

