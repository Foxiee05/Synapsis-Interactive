//*******************************
//**********INITIALIZATION***********
//*******************************
let currentArea = 'visual'; // Current display area (visual or auditory)

let stamps = []; // Array to store stamp images for drawing area
let stampIcons = []; // Array to store stamp icon images
let selectedStamp = null; // Index of currently selected stamp
let stampSize = 60; // Size for placed stamps, controlled by slider
let showInstruction = true; // Flag to show instruction text
let placedStamps = []; // Array to store placed stamps' data
let stampPositions = [
  { x: 53, y: 223 },  // Stamp1 position
  { x: 168, y: 223 }, // Stamp2 position
  { x: 281, y: 223 }, // Stamp3 position
  { x: 391, y: 223 }, // Stamp4 position
  { x: 53, y: 308 },  // Stamp5 position
  { x: 168, y: 308 }, // Stamp6 position
  { x: 281, y: 308 }, // Stamp7 position
  { x: 391, y: 308 }  // Stamp8 position
];
let iconSize = 60; // Fixed size for stamp icons
let minSize = 20; // Min slider value for stampSize
let maxSize = 120; // Max slider value for stampSize


let sliderX = 51; // Slider position x
let sliderY = 445; // Slider position y
let sliderW = 398; // Slider width
let draggingSlider = false; // Flag for slider dragging


let visualBtnX = 117; // Visual button x
let visualBtnY = 101; // Visual button y
let visualBtnW = 101; // Visual button width
let visualBtnH = 25; // Visual button height


let auditoryBtnX = 260; // Auditory button x
let auditoryBtnY = 101; // Auditory button y
let auditoryBtnW = 115; // Auditory button width
let auditoryBtnH = 25; // Auditory button height


let generateBtnX = 53; // Generate button x
let generateBtnY = 500; // Generate button y
let generateBtnW = 198; // Generate button width
let generateBtnH = 25; // Generate button height


let clearBtnX = 163; // Clear button x
let clearBtnY = 550; // Clear button y
let clearBtnW = 162; // Clear button width
let clearBtnH = 25; // Clear button height


let saveBtnX = 250; // Save button x
let saveBtnY = 600; // Save button y
let saveBtnW = 215; // Save button width
let saveBtnH = 25; // Save button height


let enterSound; // Sound for buttons and stamp clicks
let clickSound; // Sound for placing stamps
let bgm; // Background music for visual area
let fadeStartTime; // Time when fade-in starts
let isFadingIn = false; // Flag for fade-in effect
let muted = false; // Flag for mute state


let notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']; // Musical notes
let freqs = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88]; // Frequencies for notes
let keys = ['A', 'W', 'S', 'E', 'D', 'F', 'T', 'G', 'Y', 'H', 'U', 'J']; // Keyboard keys for notes
let positions = [
  {x: 44 + 60, y: 179 + 60},   // C
  {x: 168 + 60, y: 345 + 60},  // C♯
  {x: 259 + 60, y: 168 + 60},  // D
  {x: 455 + 60, y: 245 + 60},  // D♯
  {x: 44 + 60, y: 551 + 60},   // E
  {x: 301 + 60, y: 557 + 60},  // F
  {x: 553 + 60, y: 551 + 60},  // F♯
  {x: 834 + 60, y: 551 + 60},  // G
  {x: 834 + 60, y: 383 + 60},  // G♯
  {x: 690 + 60, y: 220 + 60},  // A
  {x: 859 + 60, y: 70 + 60},   // A♯
  {x: 499 + 60, y: 65 + 60}    // B
];
let buttons = []; // Array to store musical note buttons
let osc; // Oscillator for sound
let env; // Envelope for sound shaping
let soundRecorder; // Recorder for audio
let soundFile; // File for saving audio
let activeIndex = -1; // Index of currently active note
let pressStart = 0; // Time when note is pressed
let audioStarted = false; // Flag for audio context
let keyToIndex = {}; // Map of keys to note indices
let isRecording = false; // Flag for recording state
let recordButtonX = 690; 
let recordButtonY = 435; 
let isHovering = false; // Flag for record button hover

// Opening rectangle animation variables
let openingRectActive = true;
let openingRectY = 0;
let openingSpeed = 0;
let openingAcceleration = 0.5;

// Closing rectangle animation variables
let rectAnimationActive = false;
let rectAnimationY = -700; // Start above the canvas
let rectAnimationSpeed = 0;
let rectAnimationAcceleration = 0.5;
let targetURL = '';




//*******************************
//**********PRELOADS***********
//*******************************
function preload() {
  //***********Load stamp images***********
  for (let i = 1; i <= 8; i++) {
    if (i === 4) {
      stamps.push(loadImage('Stamp4.png')); // Stamp for drawing area
      stampIcons.push(loadImage('Stamp4-img.png')); // Icon for selection
    } else {
      let img = loadImage(`Stamp${i}.png`);
      stamps.push(img);
      stampIcons.push(img);
    }
  }
//***********Load stamp images end***********

  //***********Load sounds***********
  enterSound = loadSound('enter-sound-stage3.ogg');
  clickSound = loadSound('click-stage3.ogg');
  bgm = loadSound('omori.mp3');
  //***********Load sounds end***********
}

//*******************************
//**********SETUP***********
//*******************************
function setup() {
  createCanvas(1000, 700); // Create 1000x700 canvas
  textFont('Courier'); // Set font for all text
  //***********Initialize musical note buttons***********
  for (let i = 0; i < notes.length; i++) {
    buttons.push({
      x: positions[i].x,
      y: positions[i].y,
      label: notes[i],
      freq: freqs[i],
      key: keys[i]
    });
  }
//***********Initialize musical note buttons end***********


  //***********Create key to index map***********
  for (let i = 0; i < buttons.length; i++) {
    keyToIndex[buttons[i].key] = i;
  }
//***********Create key to index map end***********


  //***********Initialize oscillator and envelope***********
  osc = new p5.Oscillator('sawtooth');
  env = new p5.Envelope();
  env.setADSR(0.005, 0.2, 0.6, 0.8);
  osc.amp(0);
//***********Initialize oscillator and envelope end***********


  //***********Initialize sound recorder***********
  soundRecorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
  osc.connect(); // Connect oscillator to master output
// ***********Initialize sound recorder end***********


  //***********Start BGM for visual area***********
  if (currentArea === 'visual' && bgm) {
    bgm.setVolume(0); // Start at volume 0
    bgm.loop(); // Set to loop
    fadeStartTime = millis(); // Record start time for fade-in
    isFadingIn = true; // Enable fade-in
  }
  //***********Start BGM for visual area end***********
}


//*******************************
//**********DRAW***********
//*******************************
function draw() {
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
    return; // Don't draw anything else during closing animation
  }

  background(0);
  cursor(ARROW); // Reset cursor to default at the start of every frame

  //***********Handle BGM fade-in***********
  if (isFadingIn && currentArea === 'visual' && bgm && !muted) {
    let elapsed = (millis() - fadeStartTime) / 1000; // Time in seconds
    let fadeDuration = 2; // 2 seconds fade-in
    if (elapsed < fadeDuration) {
      let volume = (elapsed / fadeDuration) * 0.8; // Linearly increase to 0.8
      bgm.setVolume(volume);
    } else {
      bgm.setVolume(0.8); // Cap at 0.8
      isFadingIn = false; // Stop fade-in
    }
  }

  //***********Draw instructions for mute and keyboard***********
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
  //***********Instructions end***********


  if (currentArea === 'visual') {
    //***********Check hover and draw VISUAL button***********
    let visualHover = mouseX >= visualBtnX && mouseX <= visualBtnX + visualBtnW && mouseY >= visualBtnY && mouseY <= visualBtnY + visualBtnH;
    if (visualHover) cursor(HAND);
    stroke(255);
    strokeWeight(1);
    fill(currentArea === 'visual' ? 255 : 0);
    rect(visualBtnX, visualBtnY, visualBtnW, visualBtnH);
    fill(currentArea === 'visual' ? 0 : 255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Visual', visualBtnX + visualBtnW / 2, visualBtnY + visualBtnH / 2);
    //***********Check VISUAL button end***********


    //***********Check hover and draw AUDITORY button***********
    let auditoryHover = mouseX >= auditoryBtnX && mouseX <= auditoryBtnX + auditoryBtnW && mouseY >= auditoryBtnY && mouseY <= auditoryBtnY + auditoryBtnH;
    if (auditoryHover) cursor(HAND);
    stroke(255);
    strokeWeight(1);
    fill(currentArea === 'auditory' ? 255 : 0);
    rect(auditoryBtnX, auditoryBtnY, auditoryBtnW, auditoryBtnH);
    fill(currentArea === 'auditory' ? 0 : 255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Auditory', auditoryBtnX + auditoryBtnW / 2, auditoryBtnY + auditoryBtnH / 2);
    //***********Check AUDITORY button end***********


    //***********Draw stamp variations text***********
    fill(255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Stamp variations', 252, 200);
    //***********Draw stamp variations text end***********


    //***********Check hover and draw stamp icons***********
    for (let i = 0; i < 8; i++) {
      let pos = stampPositions[i];
      let stampHover = mouseX >= pos.x && mouseX <= pos.x + iconSize && mouseY >= pos.y && mouseY <= pos.y + iconSize;
      if (stampHover) cursor(HAND);
      image(stampIcons[i], pos.x, pos.y, iconSize, iconSize);
      if (selectedStamp === i) {
        noFill();
        stroke(255);
        strokeWeight(1);
        rect(pos.x, pos.y, iconSize, iconSize);
      }
    }
    //***********Check hover and draw stamp icons end***********

    //***********Draw stamp size text***********
    fill(255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Stamp's size", 250, 422);
    //***********Draw stamp size text end***********


    //***********Check hover and draw size slider***********
    let thumbX = map(stampSize, minSize, maxSize, sliderX, sliderX + sliderW);
    let overSlider = dist(mouseX, mouseY, thumbX, sliderY) < 12.5;
    if (overSlider) cursor(HAND);
    stroke(255);
    strokeWeight(1);
    line(sliderX, sliderY, sliderX + sliderW, sliderY);
    fill(255);
    noStroke();
    ellipse(thumbX, sliderY, 25, 25);
    //***********Check hover and draw size slider end***********



    //***********Check hover and draw generate random button***********
    let generateHover = mouseX >= generateBtnX && mouseX <= generateBtnX + generateBtnW && mouseY >= generateBtnY && mouseY <= generateBtnY + generateBtnH;
    if (generateHover) cursor(HAND);
    stroke(255);
    strokeWeight(1);
    fill(generateHover ? 255 : 0);
    rect(generateBtnX, generateBtnY, generateBtnW, generateBtnH);
    fill(generateHover ? 0 : 255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Generate random', generateBtnX + generateBtnW / 2, generateBtnY + generateBtnH / 2);
    //***********Check generate random button end***********



    //***********Check hover and draw clear canvas button***********
    let clearHover = mouseX >= clearBtnX && mouseX <= clearBtnX + clearBtnW && mouseY >= clearBtnY && mouseY <= clearBtnY + clearBtnH;
    if (clearHover) cursor(HAND);
    stroke(255);
    strokeWeight(1);
    fill(clearHover ? 255 : 0);
    rect(clearBtnX, clearBtnY, clearBtnW, clearBtnH);
    fill(clearHover ? 0 : 255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Clear canvas', clearBtnX + clearBtnW / 2, clearBtnY + clearBtnH / 2);
    //***********Check clear canvas button end***********



    //***********Check hover and draw save creation button***********
    let saveHover = mouseX >= saveBtnX && mouseX <= saveBtnX + saveBtnW && mouseY >= saveBtnY && mouseY <= saveBtnY + saveBtnH;
    if (saveHover) cursor(HAND);
    stroke(255);
    strokeWeight(1);
    fill(saveHover ? 255 : 0);
    rect(saveBtnX, saveBtnY, saveBtnW, saveBtnH);
    fill(saveHover ? 0 : 255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Save your creation', saveBtnX + saveBtnW / 2, saveBtnY + saveBtnH / 2);
    //***********Check save creation button end***********



    //***********Check hover for drawing area***********
    let overDrawing = mouseX >= 500 && mouseX <= 950 && mouseY >= 101 && mouseY <= 651;
    if (overDrawing && selectedStamp !== null) cursor(HAND);
    //***********Check hover for drawing area end***********


    //***********Draw drawing area***********
    fill(0);
    stroke(255);
    strokeWeight(1);
    rect(500, 101, 450, 550);
    for (let stamp of placedStamps) {
      image(stamps[stamp.index], stamp.x, stamp.y, stamp.size, stamp.size);
    }
    if (showInstruction && placedStamps.length === 0) {
      fill(255);
      noStroke();
      textAlign(CENTER);
      textSize(16);
      text("You can create whatever you want.\nThis is your canvas", 725, 376);
    }
  } else {
    //***********AUDITORY AREA***********
    let visualHover = mouseX >= visualBtnX && mouseX <= visualBtnX + visualBtnW && mouseY >= visualBtnY && mouseY <= visualBtnY + visualBtnH;
    if (visualHover) cursor(HAND);
    stroke(255);
    strokeWeight(1);
    fill(currentArea === 'visual' ? 255 : 0);
    rect(visualBtnX, visualBtnY, visualBtnW, visualBtnH);
    fill(currentArea === 'visual' ? 0 : 255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Visual', visualBtnX + visualBtnW / 2, visualBtnY + visualBtnH / 2);

    let auditoryHover = mouseX >= auditoryBtnX && mouseX <= auditoryBtnX + auditoryBtnW && mouseY >= auditoryBtnY && mouseY <= auditoryBtnY + auditoryBtnH;
    if (auditoryHover) cursor(HAND);
    stroke(255);
    strokeWeight(1);
    fill(currentArea === 'auditory' ? 255 : 0);
    rect(auditoryBtnX, auditoryBtnY, auditoryBtnW, auditoryBtnH);
    fill(currentArea === 'auditory' ? 0 : 255);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Auditory', auditoryBtnX + auditoryBtnW / 2, auditoryBtnY + auditoryBtnH / 2);

    textSize(16);
    fill(255);
    textAlign(LEFT, CENTER);
    text("Create your own rhythm and", 389, 441);

    let isMouseOver = dist(mouseX, mouseY, recordButtonX, recordButtonY) < 39.5;
    if (isMouseOver) cursor(HAND);
    isHovering = isMouseOver;
    
    if (isRecording) {
      let flicker = (millis() % 1000 < 500) ? '#DF2E33' : '#000000';
      fill(flicker);
      stroke(255);
      strokeWeight(1);
      ellipse(recordButtonX, recordButtonY, 79, 79);
      fill(255);
      noStroke();
      textSize(16);
      text("record", recordButtonX - 79 / 2 + 10, recordButtonY);
    } else if (isHovering) {
      fill(255);
      stroke(255);
      strokeWeight(1);
      ellipse(recordButtonX, recordButtonY, 79, 79);
      fill(0);
      noStroke();
      textSize(16);
      text("record", recordButtonX - 79 / 2 + 10, recordButtonY);
    } else {
      fill(0);
      stroke(255);
      strokeWeight(1);
      ellipse(recordButtonX, recordButtonY, 79, 79);
      fill(255);
      noStroke();
      textSize(16);
      text("record", recordButtonX - 79 / 2 + 10, recordButtonY);
    }

    textAlign(CENTER, CENTER);
    textSize(36);
    for (let i = 0; i < buttons.length; i++) {
      let b = buttons[i];
      let half = 52.5;
      let buttonHover = mouseX > b.x - half && mouseX < b.x + half && mouseY > b.y - half && mouseY < b.y + half;
      if (buttonHover) cursor(HAND);
      push();
      translate(b.x, b.y);
      if (i === activeIndex) {
        let timePressed = millis() - pressStart;
        let pulseSpeed = 0.02;
        let scaleFactor = 1 + 0.2 * sin(timePressed * pulseSpeed);
        scale(scaleFactor);
        fill('#DF2E33');
        ellipse(0, 0, 105, 105);
      } else {
        fill('#2042FE');
        rect(-half, -half, 105, 105);
      }
      fill(255);
      text(b.label, 0, 0);
      textSize(16);
      text(`(${b.key})`, 0, 30);
      pop();
    }
  }

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
    cursor(ARROW);
    return;
  }
}



//*******************************
//**********MOUSE INTERACTIONS***********
//*******************************
function mousePressed() {
  // Skip interactions during animations
  if (openingRectActive || rectAnimationActive) return;
  
  //***********Check visual button***********
  if (mouseX >= visualBtnX && mouseX <= visualBtnX + visualBtnW && mouseY >= visualBtnY && mouseY <= visualBtnY + visualBtnH) {
    if (currentArea !== 'visual') {
      currentArea = 'visual';
      if (isRecording) {
        soundRecorder.stop(); // Stop recording without saving
        isRecording = false;
      }
      if (bgm && !muted) {
        bgm.setVolume(0);
        bgm.loop();
        fadeStartTime = millis();
        isFadingIn = true;
      }
    }
    if (enterSound && !muted) {
      enterSound.stop();
      enterSound.play();
    }
    return;
  }
  //***********Check visual button end***********

  //***********Check auditory button***********
  if (mouseX >= auditoryBtnX && mouseX <= auditoryBtnX + auditoryBtnW && mouseY >= auditoryBtnY && mouseY <= auditoryBtnY + auditoryBtnH) {
    if (currentArea !== 'auditory') {
      currentArea = 'auditory';
      if (bgm) {
        bgm.stop();
      }
    }
    if (enterSound && !muted) {
      enterSound.stop();
      enterSound.play();
    }
    return;
  }
  //***********Check auditory button end***********

  if (currentArea === 'visual') {
    //***********Check stamp selection***********
    for (let i = 0; i < 8; i++) {
      let pos = stampPositions[i];
      if (mouseX >= pos.x && mouseX <= pos.x + iconSize && mouseY >= pos.y && mouseY <= pos.y + iconSize) {
        selectedStamp = i;
        if (enterSound && !muted) {
          enterSound.stop();
          enterSound.play();
        }
        return;
      }
    }
    //***********Check stamp selection end***********

    //***********Place stamp in drawing area***********
    if (selectedStamp !== null && mouseX >= 500 && mouseX <= 950 && mouseY >= 101 && mouseY <= 651) {
      let x = constrain(mouseX - stampSize / 2, 500, 950 - stampSize);
      let y = constrain(mouseY - stampSize / 2, 101, 651 - stampSize);
      placedStamps.push({ index: selectedStamp, x, y, size: stampSize });
      showInstruction = false;
      if (clickSound && !muted) {
        clickSound.stop();
        clickSound.play();
      }
      return;
    }
    //***********Place stamp in drawing area end***********

    //***********Check slider thumb***********
    let thumbX = map(stampSize, minSize, maxSize, sliderX, sliderX + sliderW);
    if (dist(mouseX, mouseY, thumbX, sliderY) < 12.5) {
      draggingSlider = true;
      if (enterSound && !muted) {
        enterSound.stop();
        enterSound.play();
      }
      return;
    }
    //***********Check slider thumb end***********

    //***********Check generate random button***********
    if (mouseX >= generateBtnX && mouseX <= generateBtnX + generateBtnW && mouseY >= generateBtnY && mouseY <= generateBtnY + generateBtnH) {
      generateRandomStamps();
      if (enterSound && !muted) {
        enterSound.stop();
        enterSound.play();
      }
      return;
    }
    //***********Check generate random button end***********

    //***********Check clear canvas button***********
    if (mouseX >= clearBtnX && mouseX <= clearBtnX + clearBtnW && mouseY >= clearBtnY && mouseY <= clearBtnY + clearBtnH) {
      clearCanvas();
      if (enterSound && !muted) {
        enterSound.stop();
        enterSound.play();
      }
      return;
    }
    //***********Check clear canvas button end***********

    //***********Check save creation button***********
    if (mouseX >= saveBtnX && mouseX <= saveBtnX + saveBtnW && mouseY >= saveBtnY && mouseY <= saveBtnY + saveBtnH) {
      saveCreation();
      if (enterSound && !muted) {
        enterSound.stop();
        enterSound.play();
      }
      return;
    }
    //***********Check save creation button end***********
  } else {
    //***********Check record button click***********
    if (dist(mouseX, mouseY, recordButtonX, recordButtonY) < 39.5) {
      toggleRecording();
      if (enterSound && !muted) {
        enterSound.stop();
        enterSound.play();
      }
      return;
    }
    //***********Check record button click end***********

    //***********Check musical note button click***********
    let half = 52.5;
    for (let i = 0; i < buttons.length; i++) {
      let b = buttons[i];
      if (mouseX > b.x - half && mouseX < b.x + half && mouseY > b.y - half && mouseY < b.y + half) {
        triggerNote(i);
        return;
      }
    }
    //***********Check musical note button click end***********
  }
}

//*******************************
//**********MOUSE DRAGGED***********
//*******************************
function mouseDragged() {
  if (draggingSlider) {
    let constrainedX = constrain(mouseX, sliderX, sliderX + sliderW);
    stampSize = map(constrainedX, sliderX, sliderX + sliderW, minSize, maxSize);
  }
}

//*******************************
//**********MOUSE RELEASED***********
//*******************************
function mouseReleased() {
  draggingSlider = false;
  if (currentArea === 'auditory') {
    releaseNote();
  }
}

//*******************************
//**********KEYBOARD INTERACTIONS***********
//*******************************
function keyPressed() {
  // Skip interactions during animations
  if (openingRectActive || rectAnimationActive) return;
  
  // Trigger closing rectangle animation on main keyboard 1 key
  if (keyCode === 49) { // keyCode for main keyboard '1' key
    targetURL = 'index.html';
    rectAnimationActive = true;
    console.log("Main keyboard 1 pressed, starting closing animation");
    return false; // Prevent default behavior
  }

  // Trigger closing rectangle animation on main keyboard 2 key
  if (keyCode === 50) { // keyCode for main keyboard '2' key
    targetURL = 'stage2.html';
    rectAnimationActive = true;
    console.log("Main keyboard 2 pressed, starting closing animation");
    return false; // Prevent default behavior
  }

  if (key === 'm' || key === 'M') {
    muted = !muted;
    if (muted) {
      // Mute all sounds
      if (enterSound) enterSound.setVolume(0);
      if (clickSound) clickSound.setVolume(0);
      if (bgm) bgm.pause();
      if (osc) osc.amp(0);
    } else {
      // Unmute all sounds
      if (enterSound) enterSound.setVolume(1);
      if (clickSound) clickSound.setVolume(1);
      if (bgm && currentArea === 'visual') {
        bgm.setVolume(isFadingIn ? (millis() - fadeStartTime) / 2000 * 0.8 : 0.8);
        bgm.play();
      }
      if (osc) osc.amp(0); // Will be controlled by envelope
    }
    return;
  }
  if (currentArea === 'auditory') {
    let upperKey = key.toUpperCase();
    if (keyToIndex.hasOwnProperty(upperKey)) {
      let i = keyToIndex[upperKey];
      triggerNote(i);
    }
  }
}

//*******************************
//**********KEY RELEASED***********
//*******************************
function keyReleased() {
  if (currentArea === 'auditory') {
    releaseNote();
  }
}

//*******************************
//**********BUTTON FUNCTIONS***********
//*******************************
//***********Generate random stamps***********
function generateRandomStamps() {
  if (currentArea === 'visual') {
    showInstruction = false;
    let numStamps = floor(random(1, 10));
    for (let i = 0; i < numStamps; i++) {
      let index = floor(random(8));
      let size = random(20, 120);
      let x = random(500 + size / 2, 950 - size / 2);
      let y = random(101 + size / 2, 651 - size / 2);
      placedStamps.push({ index, x: x - size / 2, y: y - size / 2, size });
    }
  }
}
//***********Generate random stamps end***********

//***********Clear canvas***********
function clearCanvas() {
  if (currentArea === 'visual') {
    placedStamps = [];
    showInstruction = true;
  }
}
//***********Clear canvas end***********

//***********Save creation***********
function saveCreation() {
  if (currentArea === 'visual') {
    let tempCanvas = createGraphics(450, 550);
    tempCanvas.background(0);
    for (let stamp of placedStamps) {
      tempCanvas.image(stamps[stamp.index], stamp.x - 500, stamp.y - 101, stamp.size, stamp.size);
    }
    save(tempCanvas, 'creation.png');
  }
}
//***********Save creation end***********

//***********Trigger musical note***********
function triggerNote(i) {
  if (!muted) {
    activeIndex = i;
    pressStart = millis();
    if (!audioStarted) {
      userStartAudio();
      osc.start();
      audioStarted = true;
    }
    osc.freq(buttons[i].freq);
    env.triggerAttack(osc, 0, buttons[i].freq, 0.25);
  }
}
//***********Trigger musical note end***********

//***********Release musical note***********
function releaseNote() {
  if (activeIndex !== -1 && !muted) {
    env.triggerRelease(osc, 0);
    activeIndex = -1;
  }
}
//***********Release musical note end***********

//***********Toggle recording***********
function toggleRecording() {
  if (!muted) {
    if (!audioStarted) {
      userStartAudio();
      osc.start();
      audioStarted = true;
    }
    if (!isRecording) {
      soundFile = new p5.SoundFile();
      soundRecorder.setInput(osc);
      soundRecorder.record(soundFile);
      isRecording = true;
    } else {
      soundRecorder.stop();
      isRecording = false;
      setTimeout(() => {
        if (soundFile.buffer) {
          saveSound(soundFile, 'recording.wav');
        } else {
          console.error('Sound file buffer is empty. Try recording for a longer duration.');
        }
      }, 100);
    }
  }
}
//***********Toggle recording end***********
