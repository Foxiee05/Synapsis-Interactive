//*******************************
//**********INITIALIZE***********
//*******************************
let eyeballs = []; //eyes
let eyeballImg;
let irisImg;     

let blocks = []; //blocks background
let cols; let rows; 
let size = 17; let offset = 4;
let d = 70;

let rectY = 0; //Text at the beginning
let moving = false;
let speed = 0;
let acceleration = 0.5;
let beginString = '"Synapsis" by Foxiee.';
let nextString = 'Clicking everything you see is advisable.\nPress "M" to enable sound.';
let startTime;
let fadeState = 0; 
let opacity = 0; // Start with 0 opacity for fade-in
let elementsVisible = true;

// Textbox sequence variables
let textBoxStartTime = 0;
let showTextBox = false;
let currentTextBox = -1;
let textBoxOpacity = 0;
let textBoxFadeState = 0; // 0: fade in, 1: fully visible
let textBoxes = [
  {
    text: "Everything begins from observing.",
    x: 80,
    y: 155,
    w: 439,
    h: 89
  },
  {
    text: "You see.",
    x: 620,
    y: 197,
    w: 206,
    h: 89
  },
  {
    text: "You listen.",
    x: 397,
    y: 296,
    w: 206,
    h: 89
  },
  {
    text: "You feel.",
    x: 138,
    y: 355,
    w: 206,
    h: 89
  }
];

// Input box variables
let inputText = "";
let asciiChars = "";
let showInputBox = false;
let inputActive = false;
let inputCursorVisible = true;
let cursorBlinkTime = 0;

// Image sequence variables
let lampImg, cupImg, shoesImg, smileyImg;
let currentImage = null;
let enterCount = 0;
let aberrationOffset = 0;

// Blue overlay variables
let blueOverlayOpacity = 0;
let maxBlueOpacity = 100; // Maximum opacity for the blue overlay
let cumulativeTypingLength = 0;

// Rectangle animation variables
let rectAnimationActive = false;
let rectAnimationY = -700; // Start above the canvas
let rectAnimationSpeed = 0;
let rectAnimationAcceleration = 0.5;
let targetURL = '';

// Create a hidden input element for better text input
let hiddenInput;

// Audio variables
let bgm;
let enterSfx;
let imageSfx;
let textboxSfx;
let isEnterSfxPlaying = false; // Track enter SFX state

//*******************************
//**********PRELOADS***********
//*******************************
function preload() {
  try {
    eyeballImg = loadImage('Eyeball.png');
    irisImg = loadImage('Iris.png');
    stage1Background = loadImage('stage1Background.png');
    lampImg = loadImage('lamp.png');
    cupImg = loadImage('cup.png');
    shoesImg = loadImage('shoes.png');
    smileyImg = loadImage('smiley.png');
    
    // Load audio files
    bgm = loadSound('ambience-sound.mp3');
    enterSfx = loadSound('enter-sound.ogg');
    imageSfx = loadSound('stage1Image-sound.wav');
    textboxSfx = loadSound('textbox-sound.ogg');
  } catch (e) {
    console.error("Error loading images or sounds:", e);
  }
}

//*******************************
//**********SETUP***********
//*******************************
function setup() {
  const canvas = createCanvas(1000, 700);
  
  // Create a hidden input element for better text input handling
  hiddenInput = createInput('');
  hiddenInput.position(-1000, -1000); // Position off-screen
  hiddenInput.size(100, 20);
  hiddenInput.attribute('maxlength', '20'); // Limit input length
  hiddenInput.attribute('id', 'hidden-input'); // Add id for accessibility
  hiddenInput.attribute('name', 'user_input'); // Add name for accessibility
  
  // Ensure canvas retains focus for mouse events
  canvas.mousePressed(() => {
    select('canvas').elt.focus();
  });

  // Set audio volumes
  bgm.setVolume(1.0); // Increase volume for BGM
  enterSfx.setVolume(1.0); // Default volume for enter SFX
  imageSfx.setVolume(0.3); // Slightly louder volume for image SFX
  textboxSfx.setVolume(1.0); // Default volume for textbox SFX

  //******Blocks pattern creation******
  cols = width/size;
  rows = height/size;
  for (let i=0; i<cols; i++){
    blocks[i] = [];
    for (let j=0; j<rows; j++){
      blocks[i][j] = new Block(size/2 + i*size, size/2 + j*size, size, size);
    }
  }
  //******Blocks pattern creation end******
  
  // *****Eye grid configuration******
  const eyesPerRow = 7;
  const rowsTotal = 5;
  const eyeSize = 88; 
  
  // Calculate equal spacing for perfect grid distribution
  const horizontalSpacing = width / (eyesPerRow + 1);
  const verticalSpacing = height / (rowsTotal + 1);
  
  // Create grid of eyes
  for (let row = 0; row < rowsTotal; row++) {
    for (let col = 0; col < eyesPerRow; col++) {
      let x = horizontalSpacing + col * horizontalSpacing;
      let y = verticalSpacing + row * verticalSpacing;
      eyeballs.push(new Eyeball(x, y, eyeSize));
    }
  }
  //*****Eye grid configuration end******

  //******Beginning text creation******
  textAlign(CENTER, CENTER);
  textSize(32);
  startTime = millis();
  //******Beginning text creation end******
}

//*******************************
//**********DRAW***********
//*******************************
function draw() {
  background(stage1Background);

  // ******Draw blocks pattern******
  for (let i=0; i<cols; i++){
    for (let j=0; j<rows; j++){
      blocks[i][j].display(offset, d);
    }
  }
  //******Draw blocks pattern end******

  // ******Draw and update all eyeballs******
  for (let eyeball of eyeballs) {
    eyeball.update();
    eyeball.draw();
  }
  // ******Draw and update all eyeballs end******

  // Draw blue overlay with difference blend mode (OVER the eyes)
  if (blueOverlayOpacity > 0) {
    push();
    blendMode(DIFFERENCE);
    fill(0, 89, 255, blueOverlayOpacity);
    noStroke();
    rect(0, 0, width, height);
    pop();
    blendMode(BLEND); // Reset blend mode
  }

  // Reset cursor to default at start of draw
  cursor('default');


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
  

  // ******Draw and handle beginning text******
  if (elementsVisible) {
    noStroke();
    fill(0);
    rectMode(CORNER);
    rect(0, rectY, width, height);
    
    // Check if mouse is over the rectangle
    if (mouseX >= 0 && mouseX <= width && mouseY >= rectY && mouseY <= rectY + height) {
      cursor('pointer');
      console.log("Hovering over initial rectangle, mouseX:", mouseX, "mouseY:", mouseY, "rectY:", rectY);
    }
    
    // Handle text fading transitions
    let elapsed = millis() - startTime;
    
    if (fadeState === 0) {
      opacity += 3;
      if (opacity >= 255) {
        opacity = 255;
        if (elapsed > 3000) {
          fadeState = 1; 
        }
      }
    }
    
    if (fadeState === 1) {
      opacity -= 3; 
      if (opacity <= 0) {
        opacity = 0;
        fadeState = 2; 
        startTime = millis();
      }
    }
    
    if (fadeState === 2) {
      opacity += 3;
      if (opacity >= 255) {
        opacity = 255;
        fadeState = 3;
      }
    }
    
    textFont('Courier');
    textSize(24);
    
    if (fadeState === 0 || fadeState === 1) {
      fill(255, 255, 255, opacity);
      text(beginString, width/2, rectY + height/2);
    } else {
      fill(255, 255, 255, opacity);
      text(nextString, width/2, rectY + height/2);
    }
    
    if (moving) {
      speed += acceleration;
      rectY -= speed;
      
      if (rectY <= -height) {
        elementsVisible = false;
        moving = false;
        speed = 0;
        cursor('default'); 
        textBoxStartTime = millis();
      }
    }
  }
  // ******Draw and handle beginning text end******

  // ******Draw and handle textbox sequence******
  if (!showTextBox && currentTextBox === -1 && millis() - textBoxStartTime > 3000 && textBoxStartTime > 0) {
    showTextBox = true;
    currentTextBox = 0;
    textBoxOpacity = 0;
    textBoxFadeState = 0;
  }
  
  if (showTextBox && currentTextBox >= 0 && currentTextBox < textBoxes.length) {
    handleTextBoxFadeIn();
    displayCurrentTextBox();
  }
  // ******Draw and handle textbox sequence end******

  // Draw input box if it should be shown
  if (showInputBox) {
    drawInputContainer();
    
    // Handle cursor blinking
    if (millis() - cursorBlinkTime > 500) {
      inputCursorVisible = !inputCursorVisible;
      cursorBlinkTime = millis();
    }
    
    // Change cursor when hovering over input or button
    if (isMouseOverInput()) {
      cursor('text');
    } else if (isMouseOverButton()) {
      cursor(HAND);
    }
  }

  // Draw current image with aberration if it exists
  if (currentImage) {
    drawImageWithAberration();
  }



  // Handle closing rectangle animation
  if (rectAnimationActive) {
    rectAnimationSpeed += rectAnimationAcceleration;
    if (rectAnimationY + rectAnimationSpeed >= 0) {
      rectAnimationY = 0;
      fill(0);
      rect(0, 0, width, height);
      window.location.href = targetURL;
    } else {
      rectAnimationY += rectAnimationSpeed;
      fill(0);
      rect(0, rectAnimationY, width, height);
    }
  }
}

//*******************************
//**********ADDITIONAL FUNCTIONS***********
//*******************************
function mousePressed() {
  if (elementsVisible) {
    if (mouseX >= 0 && mouseX <= width && mouseY >= rectY && mouseY <= rectY + height) {
      moving = true;
      console.log("Clicked initial rectangle");
    }
  } else if (showTextBox && currentTextBox >= 0 && currentTextBox < textBoxes.length) {
    if (textBoxFadeState === 1) {
      let box = textBoxes[currentTextBox];
      if (mouseX > box.x && mouseX < box.x + box.w && 
          mouseY > box.y && mouseY < box.y + box.h) {
        currentTextBox++;
        console.log("Clicked textbox", currentTextBox);
        
        // Play textbox sound once per click if not muted
        if (bgm.isPlaying()) textboxSfx.play();
        
        if (currentTextBox >= textBoxes.length) {
          showTextBox = false;
          currentTextBox = -1;
          textBoxStartTime = 0;
          textBoxFadeState = 0;
          cursor('default');
          
          // Show input box after clicking the last textbox
          showInputBox = true;
        } else {
          textBoxFadeState = 0;
          textBoxOpacity = 0;
        }
      }
    }
  }
  
  // Handle input box click
  if (showInputBox) {
    if (isMouseOverInput()) {
      inputActive = true;
      inputCursorVisible = true;
      cursorBlinkTime = millis();
      
      // Show lamp.png when input box is first clicked
      if (enterCount === 0 && !currentImage) {
        currentImage = lampImg;
        if (bgm.isPlaying()) imageSfx.play();
      }
    } else if (isMouseOverButton()) {
      submitInput();
    } else {
      inputActive = false;
      select('canvas').elt.focus();
    }
  }
}

function keyPressed() {
  // Handle ALL keys when input is active to show random symbols
  if (showInputBox && inputActive) {
    if (keyCode === ENTER) {
      submitInput();
      return false;
    } else if (keyCode === BACKSPACE) {
      inputText = inputText.substring(0, inputText.length - 1);
      hiddenInput.value(inputText);
      updateInputDisplay();
      // Update blue overlay opacity with faster progression
      blueOverlayOpacity = map(cumulativeTypingLength + (inputText.length * 3), 0, 50, 0, maxBlueOpacity);
      redraw();
      return false;
    } else if (key.length === 1) {
      inputText += key;
      hiddenInput.value(inputText);
      updateInputDisplay();
      // Update blue overlay opacity with faster progression
      blueOverlayOpacity = map(cumulativeTypingLength + (inputText.length * 3), 0, 50, 0, maxBlueOpacity);
      redraw();
      return false;
    }
  }
  
  // Trigger closing rectangle animation on main keyboard 2 key
  if (keyCode === 50) { // keyCode for main keyboard '2' key (above Tab)
    targetURL = 'stage2.html';
    rectAnimationActive = true;
    console.log("Main keyboard 2 pressed, starting closing animation");
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
    if (bgm.isPlaying()) {
      bgm.stop();
      enterSfx.stop();
      imageSfx.stop();
      textboxSfx.stop();
      isEnterSfxPlaying = false;
    } else {
      bgm.loop();
      if (isEnterSfxPlaying) {
        enterSfx.loop();
      }
      // imageSfx and textboxSfx will play when triggered by image appearance or textbox click
    }
    return false;
  }
  
  return true;
}

//*******************************
//**********INPUT BOX FUNCTIONS***********
//*******************************
function submitInput() {
  console.log("Input text: " + inputText);
  console.log("ASCII characters: " + asciiChars);
  
  // Add the current input length to cumulative total with faster progression
  cumulativeTypingLength += inputText.length * 3; // Multiply by 3 for faster progression
  
  inputText = "";
  asciiChars = "";
  hiddenInput.value('');
  
  enterCount++;
  
  // Change images immediately without fade animation
  if (enterCount === 1) {
    currentImage = cupImg;
    if (bgm.isPlaying()) imageSfx.play();
  } else if (enterCount === 2) {
    currentImage = shoesImg;
    if (bgm.isPlaying()) imageSfx.play();
  } else if (enterCount === 3) {
    currentImage = smileyImg;
    if (bgm.isPlaying()) imageSfx.play();
  } else if (enterCount >= 4) {
    // Start rectangle animation instead of immediate redirect
    targetURL = 'stage2.html'; // Assuming original redirect for submit is stage2.html
    rectAnimationActive = true;
  }
  
  // Update blue overlay based on cumulative typing with faster progression
  blueOverlayOpacity = map(cumulativeTypingLength, 0, 50, 0, maxBlueOpacity); // Reduced range to 50 for faster progression
  
  // Toggle enter SFX once per click
  if (bgm.isPlaying()) {
    if (enterSfx.isPlaying()) {
      enterSfx.stop();
      isEnterSfxPlaying = false;
    } else {
      enterSfx.play();
      isEnterSfxPlaying = true;
    }
  }
  
  inputActive = false;
  select('canvas').elt.focus();
  redraw();
}

function drawInputContainer() {
  fill(0); 
  stroke(255); 
  strokeWeight(1); 
  rect(292, 522 - 46, 416, 89);
  
  fill(255); 
  noStroke();
  textFont('Courier');
  textSize(16);
  textAlign(LEFT, TOP);
  text("What do you see?", 292 + 14, 522 - 46 + 20);
  
  fill('#2042FE'); 
  noStroke();
  rect(292 + 14, 522, 278, 25);
  
  fill(255); 
  textFont('Courier');
  textSize(16);
  textAlign(LEFT, CENTER);
  text(asciiChars, 292 + 14 + 5, 522 + 12.5);
  
  if (inputActive && inputCursorVisible) {
    let textW = textWidth(asciiChars);
    stroke(255);
    strokeWeight(1);
    line(292 + 14 + 5 + textW, 522 + 5, 292 + 14 + 5 + textW, 522 + 20);
  }
  
  // Draw enter button with hover effect
  if (isMouseOverButton()) {
    fill(255); // White fill on hover
    stroke(255);
    strokeWeight(1);
    rect(292 + 14 + 278 + 20, 522, 88, 25);
    fill(0); // Black text on hover
    noStroke();
    textAlign(CENTER, CENTER);
    text("enter", 292 + 14 + 278 + 20 + 44, 522 + 12.5);
  } else {
    fill(0);
    stroke(255);
    strokeWeight(1);
    rect(292 + 14 + 278 + 20, 522, 88, 25);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("enter", 292 + 14 + 278 + 20 + 44, 522 + 12.5);
  }
}

function isMouseOverInput() {
  return mouseX > 292 + 14 && mouseX < 292 + 14 + 278 && 
         mouseY > 522 && mouseY < 522 + 25;
}

function isMouseOverButton() {
  return mouseX > 292 + 14 + 278 + 20 && mouseX < 292 + 14 + 278 + 20 + 88 && 
         mouseY > 522 && mouseY < 522 + 25;
}

function updateInputDisplay() {
  asciiChars = "";
  const asciiSymbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/`~";
  
  for (let i = 0; i < inputText.length; i++) {
    const randomIndex = Math.floor(Math.random() * asciiSymbols.length);
    asciiChars += asciiSymbols.charAt(randomIndex);
  }
}

//*******************************
//**********TEXTBOX FUNCTIONS***********
//*******************************
function displayCurrentTextBox() {
  let box = textBoxes[currentTextBox];
  
  stroke(255, textBoxOpacity);
  strokeWeight(1);
  fill(0, textBoxOpacity);
  rect(box.x, box.y, box.w, box.h);
  
  fill(255, textBoxOpacity);
  noStroke();
  textFont('Courier');
  textSize(16);
  textAlign(CENTER, CENTER);
  text(box.text, box.x + box.w/2, box.y + box.h/2);
  
  if (textBoxFadeState === 1 && 
      mouseX > box.x && mouseX < box.x + box.w && 
      mouseY > box.y && mouseY < box.y + box.h) {
    cursor(HAND);
  }
}

function handleTextBoxFadeIn() {
  if (textBoxFadeState === 0) {
    textBoxOpacity += 10;
    if (textBoxOpacity >= 255) {
      textBoxOpacity = 255;
      textBoxFadeState = 1;
    }
  }
}

//*******************************
//**********IMAGE FUNCTIONS***********
//*******************************
function drawImageWithAberration() {
  // Random glitch effect - change offset randomly each frame
  if (frameCount % 3 === 0) { // Change every 3 frames for quick glitch
    aberrationOffset = random(-8, 8);
  }
  
  let xPos = width/2 - currentImage.width/2 -5;
  let yPos = 60;
  
  // Draw the base image first
  image(currentImage, xPos, yPos);
  
  // Draw tint layers with reduced opacity (30%)
  tint(255, 0, 0, 30); // ~30% opacity
  image(currentImage, xPos + aberrationOffset, yPos);
  
  tint(0, 255, 0, 30); // ~30% opacity
  image(currentImage, xPos, yPos + random(-2, 2));
  
  tint(0, 0, 255, 30); // ~30% opacity
  image(currentImage, xPos - aberrationOffset, yPos);
  
  noTint();
}

// Handle input from the hidden input element
function handleInput() {
  if (showInputBox && inputActive) {
    inputText = hiddenInput.value();
    updateInputDisplay();
    // Update blue overlay opacity with faster progression
    blueOverlayOpacity = map(cumulativeTypingLength + (inputText.length * 3), 0, 50, 0, maxBlueOpacity);
    redraw();
  }
}