class ChladniParticle {
  constructor() {
    this.position = createVector(random(w1, w2), random(h1, h2));
    this.velocity = p5.Vector.random2D().mult(0.3);
    this.maxSpeed = 1;
    this.size = 1;
  }
  
  edges() {
    if (this.position.x > w2) this.position.x = w1;
    else if (this.position.x < w1) this.position.x = w2;
    
    if (this.position.y > h2) this.position.y = h1;
    else if (this.position.y < h1) this.position.y = h2;
  }
  
  update() {
    this.edges();
    
    let x = map(this.position.x, w1, w2, -1, 1);
    let y = map(this.position.y, h1, h2, -1, 1);
    
    let val = chladni(x, y);
    
    let h = 0.01;
    let dx = (chladni(x + h, y) - chladni(x - h, y)) / (2 * h);
    let dy = (chladni(x, y + h) - chladni(x, y - h)) / (2 * h);
    
    let force = createVector(-dy, dx);
    let intensity = 0.5 + 0.5 * cos(val * PI);
    force.normalize();
    force.mult(0.15 * intensity); 
    
    this.velocity.add(force);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
  }
  
  display() {
    stroke(150); 
    strokeWeight(this.size);
    point(this.position.x, this.position.y);
  }
}