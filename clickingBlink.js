class BlinkingParticle {
  constructor(args) {
    let def = {
      p: createVector(0, 0),
      v: p5.Vector.random2D().mult(1),
      a: createVector(0, 0),
      w: random(5, 20),
      h: random(4, 15),
      live: int(random(10, 30)),
      xsinMult: random(1, 3),
      generation: 0,
      angle: random(TWO_PI),
      spinSpeed: random(-0.05, 0.05)
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }
  
  update() {
    this.p.add(this.v);
    this.live--;
    this.angle += this.spinSpeed;
    
    // Different movement pattern
    this.v.x += sin(this.p.x / this.xsinMult) * 0.2;
    this.v.y += cos(this.p.y / 15) * 0.15;
    
    if (this.live == 0 && this.generation < 4) {
      blinkingParticles.push(new BlinkingParticle({
        p: this.p.copy(),
        v: this.v.copy().rotate(random(-1, 1)),
        generation: this.generation + 1,
        w: this.w * 0.8,
        h: this.h * 0.8
      }));

      if (random() < 0.1) {
        push();	
        translate(this.p.x, this.p.y);
        stroke(255, 150);
        noFill();
        strokeWeight(1);
        rotate(this.angle);
        
        // Rectangular pattern instead of circular
        for (let i = 0; i < 4; i++) {
          rotate(PI / 2);
          line(8, 0, 20, 0);
          line(0, -5, 0, 5);
        }
        
        if (random() < 0.2) {
          rectMode(CENTER);
          rect(0, 0, 30, 30);
        }
        pop();
      }
    }
    
    this.w *= 0.99;
    this.h *= 0.99;
    this.v.mult(0.995);
  }
  
  draw() {
    push();
    translate(this.p.x, this.p.y);
    rotate(this.angle);
    
    noStroke();
    
    // White color with varying opacity
    let alpha = map(this.live, 0, 30, 50, 255);
    fill(255, alpha);
    
    // Always use rectangles
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    
    // Glow effect - also rectangular
    blendMode(ADD);
    fill(255, 8);
    rect(0, 0, this.w * 3, this.h * 3, this.w / 2);
    
    pop();
  }
}