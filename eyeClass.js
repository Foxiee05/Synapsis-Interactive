class Eyeball {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.irisSize = 55; 
    this.maxMovement = (this.diameter/2) - (this.irisSize/2);
    
    // Vector implementation
    this.position = createVector(x, y);
    this.irisPosition = createVector(x, y);
    this.mousePosition = createVector(0, 0);
    this.rotationAngle = 0; // Store rotation angle
    
    // Create a graphics buffer for masking
    this.maskBuffer = createGraphics(this.diameter, this.diameter);
    this.createMask();
  }
  
  createMask() {
    // Create a circular mask in the buffer
    this.maskBuffer.clear();
    this.maskBuffer.ellipseMode(CENTER);
    this.maskBuffer.fill(255); // White = visible
    this.maskBuffer.noStroke();
    this.maskBuffer.circle(this.diameter/2, this.diameter/2, this.diameter);
  }
  
  update() {
    // Update mouse position vector
    this.mousePosition.set(mouseX, mouseY);
    
    // Calculate direction vector from eye to cursor
    let direction = p5.Vector.sub(this.mousePosition, this.position);
    
    // Calculate rotation angle based on cursor position
    this.rotationAngle = atan2(direction.y, direction.x);
    
    // Scale movement based on distance
    let scaledMovement = min(this.maxMovement, direction.mag() * 0.25);
    
    // Limit the magnitude
    if (direction.mag() > 0) {
      direction.setMag(scaledMovement);
    }
    
    // Update iris position
    this.irisPosition = p5.Vector.add(this.position, direction);
  }
  
  draw() {
    // Save current drawing state
    push();
    
    // Create clipping mask for the eyeball
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(this.position.x, this.position.y, this.diameter/2, 0, TWO_PI);
    drawingContext.clip();
    
    // Draw eyeball image inside the circular mask
    imageMode(CENTER);
    image(eyeballImg, this.position.x, this.position.y, this.diameter, this.diameter);
    
    // Restore clipping mask
    drawingContext.restore();
    
    // Draw iris with rotation
    this.drawRotatedIris();
    
    // Restore drawing state
    pop();
  }
  
  drawRotatedIris() {
    push();
    
    // Move to iris position
    translate(this.irisPosition.x, this.irisPosition.y);
    
    // Rotate based on cursor position
    rotate(this.rotationAngle);
    
    // Draw iris image centered at rotation point
    imageMode(CENTER);
    image(irisImg, 0, 0, this.irisSize, this.irisSize);
    
    pop();
  }
}