class Block {
  constructor(x, y){
    this.x = x; 
    this.y = y; 
    this.angle = 0;
    this.color = 70;
    this.isHovered = false;
  }
  
  display(offset, d){
    push();
    noFill();
    strokeWeight(0.5);
    stroke(this.color);
    translate(this.x, this.y);
    this.mouseHover(d);
    
    // Draw circle when not hovered, square when hovered
    if (this.isHovered) {
      // Draw rotating square when hovered
      rotate(this.angle);
      rect(0, 0, size-offset, size-offset);
    } else {
      // Draw circle when not hovered
      circle(0, 0, size-offset*2);
    }
    
    pop();
  }
  
  mouseHover(d){
    let distance = dist(mouseX, mouseY, this.x, this.y);
    if (distance < d){
      this.isHovered = true;
      this.angle += 0.1;
      this.color = 255;
    } else {
      this.isHovered = false;
      if (this.angle > 0 && this.angle <= 10) {
        this.angle += 0.1;
      } else if (this.angle > 10){
        this.angle = 0;
      }
      
      if (this.color > 70){
        this.color -= 3; 
      } else {
        this.color = 70;
      }
    }
  }
}