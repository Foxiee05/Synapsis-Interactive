//*******************************
//**********INITIALIZATION***********
//*******************************
let chladniParticles = []; // chladni pattern
let numChladni = 2200;
let m = 7;
let n = 5;
let minMN = 2;
let maxMN = 8;
let changePattern = true;
let margin = 20;
let w1, w2, h1, h2;
let patternScale = 1;

let blinkingParticles = []; // clicking Blink
let numBlinking = 50;

// Opening rectangle animation variables
let openingRectActive = true;
let openingRectY = 0;
let openingSpeed = 0;
let openingAcceleration = 0.5;

// Typewriter effect variables
let textContent = "You’re trying to form a thought, and it’s hard. You need ideas, not just any ideas, but something original, something that feels like it came from the deepest part of you. Yet nothing feels original anymore... so is originality even that important? Still, you want something that’s yours. Something that reflects you, your style, your voice, your contradictions. You don’t want to be a copy of what you see. You want your creation to feel special, to feel like it couldn’t have come from anyone else. But again, nothing is truly original. You need inspiration from others to create, and that's okay, even necessary. Now you're trying to ideate what you're going to make. It's not fully formed yet, but it's here: flickering, fragile, like a signal trying to break through static. The earliest shape of your idea is vague, it might even be bad. But it's not the end. You can still find another idea. Something good. Something that makes your dopamine spike and makes you want to bring it to life. You're digging through everything in your head. There seems to be too much, and yet nothing at all. It feels like a storm of thoughts, a whirlwind of fragments that refuse to settle. You try to grab one, but it slips away. You chase another, and it dissolves. You're not sure if you're thinking or just spiraling. Oh! It's brainstorming. You're brainstorming. Will it take long? You don't know. You're just trying your best. An idea, an idea, an idea! You're still digging for the best one you can think of. You chase it like a shadow, always just out of reach, always shifting shape. You sketch it in your mind, erase it, redraw it, doubt it. You wonder if the pursuit itself is the art. Maybe the struggle is the point. Maybe the chaos is the canvas. You scroll through memories, fragments of dreams, half-heard conversations, colors that once made you feel something. You try to stitch them together, hoping they'll form a pattern that feels like truth. But truth is slippery. And your mind is loud. You start to feel the pressure. The need to make something good. Something worthy. But who decides what's worthy? You? Them? The invisible audience you imagine watching your every move? You want to impress, but you also want to rebel. You want to be understood, but not predictable. You want to be bold, but not reckless. You pause. You breathe. You stare at the blank space in front of you. It's intimidating. But it's also full of possibility. You realize the idea doesn't have to be perfect. It just has to be real. So you write one word. Then another. You sketch one line. Then a curve. You hum a tune. Then a rhythm. And suddenly, the storm quiets. Not because you've found the idea, but because you've started. And starting is everything.";
let fontSize = 16;
let lineHeight = 19;
let letters = [];
let repulsionRadius = 50;
let maxDisplacement = 30;
let startX = 46;
let startY = 120;
let textW = 908;
let textH = 558;
let currentCharacter = 0;
let typewriterStartTime;

// Image sequence variables
let thoughtImages = [];
let currentImageIndex = 0;
let lastImageSwitchTime;
let imageOpacity = 0;
let imageX = 330;
let imageY = 180;
let imageSize = 340;
let isHovering = false;

// Underlay image variable
let underlayImage;

// Button variables
let showButton = false;
let buttonOpacity = 0;
let buttonX = 417;
let buttonY = 57;
let buttonWidth = 166;
let buttonHeight = 25;

// Closing rectangle animation variables
let rectAnimationActive = false;
let rectAnimationY = -700; // Start above the canvas
let rectAnimationSpeed = 0;
let rectAnimationAcceleration = 0.5;
let targetURL = '';

// Audio variables
let bgm;
let typewriterSfx;
let clickSfx;
let isMuted = false;
let bgmFadeStartTime;

//*******************************
//**********PRELOADS***********
//*******************************
function preload() {
  //***********Load thought images***********
  for (let i = 1; i <= 16; i++) {
    thoughtImages.push(loadImage(`thought${i}.png`));
  }
  //***********Load thought images end***********

  //***********Load underlay image***********
  underlayImage = loadImage('stage2-underlayBG.png');
  //***********Load underlay image end***********

  //***********Load audio files***********
  try {
    bgm = loadSound('LavenderTown.mp3');
    typewriterSfx = loadSound('typewriter.mp3');
    clickSfx = loadSound('click-stage2.ogg');
  } catch (e) {
    console.error("Error loading sounds:", e);
  }
  //***********Load audio files end***********
}

//*******************************
//**********SETUP***********
//*******************************
function setup() {
  createCanvas(1000, 700);
  pixelDensity(2);
  w1 = margin;
  w2 = width - margin;
  h1 = margin;
  h2 = height - margin;
  
  //***********Create Chladni pattern particles***********
  for (let i = 0; i < numChladni; i++) {
    chladniParticles.push(new ChladniParticle());
  }
  //***********Create Chladni pattern particles end***********
  
  //***********Create blinking particles***********
  for (let x = 0; x < width; x += 25) {
    for (let y = 0; y < height; y += 25) {
      if (x % 100 == 0 && y % 100 == 0 && random() < 0.7) {
        blinkingParticles.push(new BlinkingParticle({
          p: createVector(x, y),
          v: p5.Vector.random2D().mult(random(1.5, 2.5)),
          live: int(random(15, 35))
        }));
      }
    }
  }
  //***********Create blinking particles end***********
  
  //***********Setup typewriter effect***********
  textSize(fontSize);
  textFont('Courier');
  textAlign(LEFT, TOP);
  typewriterStartTime = millis() + 2000; // Start typewriter effect 2 seconds after setup
  
  // Convert text to array of words
  let words = textContent.split(' ');
  let currentX = startX;
  let currentY = startY;
  let lines = [];
  let currentLine = [];
  
  // Organize words into justified lines
  for (let word of words) {
    let wordWidth = word.length * fontSize * 0.55;
    
    if (currentX + wordWidth <= startX + textW) {
      currentLine.push(word);
      currentX += wordWidth + fontSize * 0.55;
    } else {
      lines.push(currentLine);
      currentLine = [word];
      currentX = startX + wordWidth + fontSize * 0.55;
      currentY += lineHeight;
      
      if (currentY + fontSize > startY + textH) {
        break;
      }
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  // Justify lines
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let lineWidth = 0;
    for (let word of line) {
      lineWidth += word.length * fontSize * 0.55 + fontSize * 0.55;
    }
    lineWidth -= fontSize * 0.55;
    
    let extraSpace = textW - lineWidth;
    let spacePerGap = line.length > 1 ? extraSpace / (line.length - 1) : 0;
    
    currentX = startX;
    currentY = startY + i * lineHeight;
    
    for (let j = 0; j < line.length; j++) {
      let word = line[j];
      for (let k = 0; k < word.length; k++) {
        let char = word[k];
        letters.push({
          char: char,
          x: currentX,
          y: currentY,
          homeX: currentX,
          homeY: currentY
        });
        currentX += fontSize * 0.55;
      }
      if (j < line.length - 1) {
        letters.push({
          char: ' ',
          x: currentX,
          y: currentY,
          homeX: currentX,
          homeY: currentY
        });
        currentX += fontSize * 0.55 + spacePerGap;
      }
    }
  }
  //***********Setup typewriter effect end***********
  
  //***********Setup image sequence***********
  lastImageSwitchTime = typewriterStartTime; // Start image sequence with typewriter effect
  //***********Setup image sequence end***********
  
  //***********Setup audio***********
  // All sounds are on by default (isMuted = false)
  bgm.setVolume(0); // Start with volume 0 for fade-in
  typewriterSfx.setVolume(1.0);
  clickSfx.setVolume(1.0);
  // Attempt to resume audio context and start BGM
  getAudioContext().resume().then(() => {
    if (!isMuted) {
      bgm.loop();
      bgmFadeStartTime = millis();
    }
  }).catch(err => {
    console.error("Error resuming audio context:", err);
  });
  //***********Setup audio end***********
}

//*******************************
//**********DRAW***********
//*******************************
function draw() {
  background(0, 0, 0, 100);
  
  // Reset cursor to default at the start of each frame
  cursor(ARROW);
  
  if (changePattern) {
    randomPatterns();
    changePattern = false;
  }
  
  // Update and display Chladni particles
  for (let i = 0; i < chladniParticles.length; i++) {
    chladniParticles[i].update();
    chladniParticles[i].display();
  }
  
  // Update and display blinking particles
  for (let i = 0; i < blinkingParticles.length; i++) {
    blinkingParticles[i].update();
    blinkingParticles[i].draw();
  }
  
  // Filter out dead blinking particles
  blinkingParticles = blinkingParticles.filter(p => p.live > -100);
  
  //***********Handle BGM fade-in***********
  if (!isMuted && bgm.isPlaying()) {
    let elapsedTime = millis() - bgmFadeStartTime;
    if (elapsedTime < 3000) {
      let volume = map(elapsedTime, 0, 3000, 0, 0.7); // Fade in over 3 seconds to 70% volume
      bgm.setVolume(volume);
    } else {
      bgm.setVolume(0.7); // Ensure 70% volume after fade-in
    }
  }
  //***********Handle BGM fade-in end***********
  
  //INSTRUCTIONS MUTE AND KEYBOARD*************
  push();
  fill(255);
  noStroke();
  textFont('Courier');
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, BOTTOM);
  text("Press 'M' to mute/unmute.", 170, 30);
  text("Press 1/2/3 to change stage", 626, 30);
  pop();
  //INSTRUCTIONS MUTE AND KEYBOARD END*************
  
  // Handle opening rectangle animation
  if (openingRectActive) {
    fill(0);
    noStroke();
    rect(0, openingRectY, width, height);
    openingSpeed += openingAcceleration;
    openingRectY -= openingSpeed;
    if (openingRectY <= -height) {
      openingRectActive = false;
    }
  }
  
  //***********Draw typewriter effect***********
  push();
  fill(200, 220, 240);
  noStroke();
  textSize(fontSize);
  textFont('Courier');
  textAlign(LEFT, TOP);
  
  let elapsedTime = millis();
  if (elapsedTime < typewriterStartTime) {
    pop();
    return; // Don't draw typewriter effect until 2 seconds have passed
  }
  
  // Start typewriter sound when typewriter effect begins
  if (!isMuted && !typewriterSfx.isPlaying() && floor(currentCharacter) < letters.length) {
    typewriterSfx.loop();
  }
  
  if (currentCharacter < letters.length) {
    currentCharacter += random(0.2, 0.8); // Random speed for typewriter effect
  }
  
  // Stop typewriter sound when effect ends
  if (floor(currentCharacter) >= letters.length && typewriterSfx.isPlaying()) {
    typewriterSfx.stop();
  }
  
  for (let i = 0; i < Math.min(floor(currentCharacter), letters.length); i++) {
    let letter = letters[i];
    let d = dist(mouseX, mouseY, letter.x, letter.y);
    
    if (d < repulsionRadius) {
      let angle = atan2(letter.y - mouseY, letter.x - mouseX);
      let displacement = map(d, 0, repulsionRadius, maxDisplacement, 0);
      letter.x = letter.homeX + cos(angle) * displacement;
      letter.y = letter.homeY + sin(angle) * displacement;
    } else {
      letter.x = lerp(letter.x, letter.homeX, 0.1);
      letter.y = lerp(letter.y, letter.homeY, 0.1);
    }
    
    text(letter.char, letter.x, letter.y);
  }
  
  // Check if typewriter effect is complete to show button
  if (floor(currentCharacter) >= letters.length && !showButton) {
    showButton = true;
  }
  pop();
  //***********Draw typewriter effect end***********
  
  //***********Draw underlay image with circular mask when mouse is pressed***********
  if (mouseIsPressed) {
    push();
    // Create a mask graphics buffer
    let mask = createGraphics(width, height);
    mask.background(0, 0, 0, 0); // Transparent background (alpha 0)
    mask.fill(255); // Opaque for visible area
    mask.noStroke();
    mask.circle(mouseX, mouseY, 150); // 150x150 circle centered at mouse
    
    // Get the mask as a p5.Image
    let maskImg = mask.get();
    
    // Create a copy of the underlay image to avoid modifying the original
    let maskedImage = underlayImage.get();
    maskedImage.mask(maskImg);
    
    // Draw the masked image centered on the canvas
    image(maskedImage, (width - underlayImage.width) / 2, (height - underlayImage.height) / 2);
    
    // Clean up
    mask.remove();
    pop();
  }
  //***********Draw underlay image end***********
  
  //***********Draw image sequence***********
  push();
  let currentTime = millis();
  if (currentTime >= typewriterStartTime) {
    // Update image index every 1 second
    if (currentTime - lastImageSwitchTime >= 1000) {
      currentImageIndex = (currentImageIndex + 1) % thoughtImages.length;
      lastImageSwitchTime = currentTime; // Update last switch time
    }
    
    // Handle opacity for fade-in and hover effects
    let isCurrentlyHovering = isMouseOverImage();
    
    if (isCurrentlyHovering && !isHovering) {
      // Start fading out
      isHovering = true;
    } else if (!isCurrentlyHovering && isHovering) {
      // Start fading back in
      isHovering = false;
    }
    
    if (isHovering) {
      // Fade out to 30% opacity (76.5 in p5.js) in ~0.5 seconds
      imageOpacity = max(imageOpacity - 255 / 30, 76.5); // 255/30 ≈ 8.5 per frame at 60fps
    } else {
      // Fade in to 100% opacity in ~0.5 seconds if below 255, otherwise maintain or continue initial fade-in
      if (imageOpacity < 255) {
        let timeSinceStart = currentTime - typewriterStartTime;
        if (timeSinceStart < 25000) {
          // Initial 25-second fade-in, time-based
          imageOpacity = map(timeSinceStart, 0, 25000, 0, 255);
        } else {
          // Quick fade-in after hover
          imageOpacity = min(imageOpacity + 255 / 30, 255); // 0.5 seconds
        }
      }
    }
    
    // Draw current image with current opacity
    tint(255, imageOpacity);
    image(thoughtImages[currentImageIndex], imageX, imageY, imageSize, imageSize);
    noTint();
  }
  pop();
  //***********Draw image sequence end***********
  
  //***********Draw button***********
  if (showButton) {
    push();
    // Handle button fade-in
    if (buttonOpacity < 255) {
      buttonOpacity += 255 / 60; // Fade in over ~1 second (60 frames at 60fps)
      buttonOpacity = min(buttonOpacity, 255);
    }
    
    // Check if mouse is over button
    let isButtonHovered = isMouseOverButton();
    if (isButtonHovered) {
      cursor(HAND);
    }
    
    // Draw button with hover effect
    if (isButtonHovered) {
      fill(255, buttonOpacity); // White fill on hover
      stroke(255, buttonOpacity);
      strokeWeight(1);
      rect(buttonX, buttonY, buttonWidth, buttonHeight);
      fill(0, buttonOpacity); // Black text on hover
      noStroke();
      textFont('Courier');
      textSize(16);
      textAlign(CENTER, CENTER);
      text("go next stage", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    } else {
      fill(0, buttonOpacity); // Black fill by default
      stroke(255, buttonOpacity);
      strokeWeight(1);
      rect(buttonX, buttonY, buttonWidth, buttonHeight);
      fill(255, buttonOpacity); // White text by default
      noStroke();
      textFont('Courier');
      textSize(16);
      textAlign(CENTER, CENTER);
      text("go next stage", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    }
    pop();
  }
  //***********Draw button end***********
  
  // Handle closing rectangle animation
  if (rectAnimationActive) {
    rectAnimationSpeed += rectAnimationAcceleration;
    if (rectAnimationY + rectAnimationSpeed >= 0) {
      rectAnimationY = 0;
      fill(0);
      noStroke();
      rect(0, rectAnimationY, width, height);
      window.location.href = targetURL;
    } else {
      rectAnimationY += rectAnimationSpeed;
      fill(0);
      noStroke();
      rect(0, rectAnimationY, width, height);
    }
  }
}

//*******************************
//**********CHLADNI FUNCTIONS***********
//*******************************
function chladni(x, y) {
  x = (x + 1) / 2;
  y = (y + 1) / 2;
  
  // Apply scaling to create a denser pattern
  return sin(n * PI * x * patternScale) * sin(m * PI * y * patternScale) + 
         sin(m * PI * x * patternScale) * sin(n * PI * y * patternScale);
}

function randomPatterns() {
  do {
    m = floor(random(minMN, maxMN));
    n = floor(random(minMN, maxMN));
  } while (abs(m - n) > 3 || m === n);
  
  // Adjust pattern scale for density
  patternScale = random(2, 3);
  
  for (let i = 0; i < chladniParticles.length; i++) {
    chladniParticles[i].velocity.add(p5.Vector.random2D().mult(0.5));
    chladniParticles[i].velocity.limit(chladniParticles[i].maxSpeed);
  }
}

//*******************************
//**********CLICKING BLINK FUNCTIONS***********
//*******************************
function mousePressed() {
  changePattern = true;
  
  // Play click sound if not muted
  if (!isMuted) {
    clickSfx.play();
  }
  
  // Add new blinking particles on mouse click
  for (let i = 0; i < 5; i++) {
    blinkingParticles.push(new BlinkingParticle({
      p: createVector(mouseX + random(-20, 20), mouseY + random(-20, 20)),
      v: p5.Vector.random2D().mult(random(1.5, 3)),
      live: int(random(20, 40)),
      w: random(4, 12),
      h: random(3, 8)
    }));
  }
  
  // Handle button click
  if (showButton && isMouseOverButton()) {
    targetURL = 'stage3.html';
    rectAnimationActive = true;
  }
}

//*******************************
//**********IMAGE SEQUENCE FUNCTIONS***********
//*******************************
function isMouseOverImage() {
  return mouseX > imageX && mouseX < imageX + imageSize && 
         mouseY > imageY && mouseY < imageY + imageSize;
}

//*******************************
//**********BUTTON FUNCTIONS***********
//*******************************
function isMouseOverButton() {
  return mouseX > buttonX && mouseX < buttonX + buttonWidth && 
         mouseY > buttonY && mouseY < buttonY + buttonHeight;
}

//*******************************
//**********KEY PRESSED FUNCTIONS***********
//*******************************
function keyPressed() {
  // Trigger closing rectangle animation on main keyboard 1 key
  if (keyCode === 49) { // keyCode for main keyboard '1' key
    targetURL = 'index.html';
    rectAnimationActive = true;
    console.log("Main keyboard 1 pressed, starting closing animation");
    return false; // Prevent default behavior
  }

  // Trigger closing rectangle animation on main keyboard 3 key
  if (keyCode === 51) { // keyCode for main keyboard '3' key
    targetURL = 'stage3.html';
    rectAnimationActive = true;
    console.log("Main keyboard 3 pressed, starting closing animation");
    return false; // Prevent default behavior
  }

  // Toggle all sounds on 'M' key press
  if (key.toUpperCase() === 'M') {
    if (!isMuted) {
      // Mute all sounds
      bgm.pause();
      typewriterSfx.pause();
      clickSfx.pause();
      isMuted = true;
    } else {
      // Unmute all sounds
      isMuted = false;
      getAudioContext().resume().then(() => {
        bgm.play(); // Resume BGM from paused position
        bgm.setVolume(0); // Reset volume for fade-in
        bgmFadeStartTime = millis();
        // Resume typewriter sound if typewriter effect is active
        let elapsedTime = millis();
        if (elapsedTime >= typewriterStartTime && floor(currentCharacter) < letters.length) {
          typewriterSfx.play(); // Resume typewriter sound
        }
      }).catch(err => {
        console.error("Error resuming audio context:", err);
      });
      // Click sound will play on next mouse press
    }
    return false;
  }
}