const platformerCanvas = document.getElementById('platformerGameCanvas')
const platformerContext = platformerCanvas.getContext('2d')
const platformerScoreElement = document.getElementById('platformerScore')

let hasShownWelcomeMessage = false
let messageMovedToRight = false

let maxAllowedX = platformerCanvas.width


// Constants for game elements
const GRAVITY = 1
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20
const FLOOR_Y = platformerCanvas.height - PLAYER_HEIGHT
const JUMP_FORCE = 20
const COIN_VALUE = 10
const PLAYER_SPEED = 5



// screens
const screens = [
  {
    platforms: [
      // Platforms 0
      { x: 50, y: 300, width: 200, height: 10 },
      { x: 450, y: 80, width: 100, height: 10 },
      // Border
      { x: 0, y: 0, width: 10, height: 550 },
      { x: 0, y: 50, width: 10, height: 550 },
      { x: 0, y: 382, width: 550, height: 10 },
      { x: 10, y: 0, width: 550, height: 10 },
      { x: 530, y: 0, width: 10, height: 550 },
    ],
    coins: [
      { x: 100, y: 200, collected: false },
      { x: 350, y: 300, collected: false },
    ],
    flag: {
      x: 500,
      y: 40,
      width: 20,
      height: 40,
      isReached: false
    }
  },
  {
    platforms: [
      // Platforms 1
      { x: 50, y: 300, width: 300, height: 10 },
      { x: 180, y: 200, width: 100, height: 10 },
      { x: 450, y: 80, width: 100, height: 10 },
      // Border
      { x: 0, y: 0, width: 10, height: 550 },
      { x: 530, y: 0, width: 10, height: 550 },
      { x: 0, y: 0, width: 550, height: 10 },
      { x: 0, y: 382, width: 550, height: 10 },
    ],
    coins: [
      { x: 200, y: 150, collected: false },
      { x: 150, y: 350, collected: false },
    ],
  },
  {
    platforms: [
      // Platforms 2
      { x: 180, y: 200, width: 100, height: 10 },
      { x: 350, y: 150, width: 100, height: 10 },
      { x: 450, y: 80, width: 100, height: 10 },
      // Border
      { x: 0, y: 0, width: 10, height: 550 },
      { x: 530, y: 0, width: 10, height: 550 },
      { x: 0, y: 0, width: 550, height: 10 },
      { x: 0, y: 382, width: 550, height: 10 },
    ],
    coins: [
      { x: 225, y: 150, collected: false },
      { x: 450, y: 350, collected: false },
      { x: 500, y: 40, collected: false },
    ],
  },
  {
    platforms: [
      // Platforms 3, win screen
      // Border
      { x: 0, y: 0, width: 10, height: 550 },
      { x: 0, y: 0, width: 550, height: 10 },
      { x: 0, y: 382, width: 550, height: 10 },
    ],
    coins: [
      { x: 225, y: 350, collected: false },
      { x: 450, y: 350, collected: false },
      { x: 100, y: 350, collected: false },
    ],
  },
  {
    platforms: [
      // Platforms 4, post game
      // Border
      // { x: 0, y: 0, width: 10, height: 550 },
      // { x: 530, y: 0, width: 10, height: 550 },
      { x: 0, y: 0, width: 550, height: 10 },
      { x: 0, y: 382, width: 550, height: 10 },
    ],
    coins: [
      { x: 425, y: 350, collected: false },
      { x: 550, y: 350, collected: false },
      { x: 400, y: 350, collected: false },
    ],
  },
  {
    platforms: [
      // Platforms 5, post game
      // Border
      // { x: 0, y: 0, width: 10, height: 550 },
      { x: 530, y: 0, width: 10, height: 550 },
      { x: 0, y: 0, width: 550, height: 10 },
      { x: 0, y: 382, width: 550, height: 10 },
    ],
    coins: [
      { x: 125, y: 350, collected: false },
      { x: 250, y: 350, collected: false },
      { x: 200, y: 350, collected: false },
    ],
  },
  // Additional screens
]


let currentscreen = 0

let gameRunning = true
let platforms = screens[currentscreen].platforms
let coins = screens[currentscreen].coins
let flag = screens[currentscreen].flag

let player = {
  x: platformerCanvas.width / 2,
  y: FLOOR_Y,
  dx: 0,
  dy: 0,
  score: 0,
  grounded: true,
}

// Check for collisions with any platform
function checkPlatformCollision() {
  for(let platform of platforms) {
    // Define the sides of the player and the platform for readability
    const playerLeft = player.x
    const playerRight = player.x + PLAYER_WIDTH
    const playerTop = player.y
    const playerBottom = player.y + PLAYER_HEIGHT
    const platformLeft = platform.x
    const platformRight = platform.x + platform.width
    const platformTop = platform.y
    const platformBottom = platform.y + platform.height

    if (
      playerRight > platformLeft &&
      playerLeft < platformRight &&
      playerBottom > platformTop &&
      playerTop < platformBottom
    ) {
      // Player is colliding with the platform
      // Calculate the collision depth on all four sides
      const collisionDepthTop = playerBottom - platformTop
      const collisionDepthBottom = platformBottom - playerTop
      const collisionDepthLeft = playerRight - platformLeft
      const collisionDepthRight = platformRight - playerLeft

      // Determine which side had the shallowest collision
      const minCollisionDepth = Math.min(collisionDepthTop, collisionDepthBottom, collisionDepthLeft, collisionDepthRight)

      switch (minCollisionDepth) {
        case collisionDepthTop:
          // Top collision
          player.y = platformTop - PLAYER_HEIGHT
          player.dy = 0
          player.grounded = true
          break
        case collisionDepthBottom:
          // Bottom collision
          player.y = platformBottom
          player.dy = 0
          break
        case collisionDepthLeft:
          // Left collision
          player.x = platformLeft - PLAYER_WIDTH
          player.dx = 0
          break
        case collisionDepthRight:
          // Right collision
          player.x = platformRight
          player.dx = 0
          break
      }

      return
    }
  }
  player.grounded = false // If we're not colliding with any platform, we're in the air
}



let animationId // Keep track of the animation frame id

// Key states
let keyStates = {
  ArrowLeft: false,
  ArrowRight: false,
  
}


// Event listener for the "Open Welcome Message" button
document.getElementById('openWelcomeMessageButton').addEventListener('click', function () {
  showWelcomeMessage()
})

// Game loop
function gameLoop() {
  if (!gameRunning) {
    return // Stop the loop
  }

// Call the function to show the welcome message
if (!hasShownWelcomeMessage) {
  hasShownWelcomeMessage = true
  showWelcomeMessage()
}

  // Clear the platformerCanvas
  platformerContext.clearRect(0, 0, platformerCanvas.width, platformerCanvas.height)

  // Check for platform collisions
  let onPlatform = checkPlatformCollision()
  if (onPlatform && player.dy > 0) { // If we're moving down, stop at the platform
    player.dy = 0
    player.grounded = true
  } else if (!onPlatform && player.y < FLOOR_Y) { // If we're not on a platform and above the floor, we're in the air
    player.grounded = false
  }

  // Apply gravity
  if (!player.grounded) {
    player.dy += GRAVITY
  }

  // Limit falling speed
  const MAX_FALL_SPEED = 15 // Adjust as necessary
  if (player.dy > MAX_FALL_SPEED) {
    player.dy = MAX_FALL_SPEED
  }

  // Move player
  player.x += player.dx
  player.y += player.dy


  // Calculate player's vertical position ratio
  let playerYRatio = player.y / platformerCanvas.height

// Check for screen transition
if (player.x < 0) {
  // Player has moved off the left side of the screen
  if (currentscreen > 0) {
    currentscreen--
    // Update maxAllowedX after screen change
    if (currentscreen === 2) {
      maxAllowedX = platformerCanvas.width
    }
    // Reset player position and load new screen data
    player.x = platformerCanvas.width - PLAYER_WIDTH // Player enters from the right side
    player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
    platforms = screens[currentscreen].platforms
    coins = screens[currentscreen].coins
  } else {
    player.x = 0
  }
} else if (player.x + PLAYER_WIDTH > maxAllowedX) {
  // Player has moved off the right side of the screen
  if (currentscreen < 2) {
    currentscreen++
    // Update maxAllowedX after screen change
    if (currentscreen === 2) {
      maxAllowedX = platformerCanvas.width
    }
    // Reset player position and load new screen data
    player.x = 0 // Player enters from the left side
    player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
    platforms = screens[currentscreen].platforms
    coins = screens[currentscreen].coins
    flag = screens[currentscreen].flag
  } else {
    player.x = maxAllowedX - PLAYER_WIDTH
  }
}


  

  // Draw player
  platformerContext.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT)

  // Draw platforms
  for(let platform of platforms) {
    platformerContext.fillRect(platform.x, platform.y, platform.width, platform.height)
  }
  
  // Draw coins
  for (let coin of coins) {
    if (!coin.collected) {
      platformerContext.beginPath()
      platformerContext.arc(coin.x, coin.y, 10, 0, Math.PI * 2, false)
      platformerContext.closePath()
      platformerContext.fill()
    }
  }

  // Draw flag
  if (flag && !flag.isReached) {
    platformerContext.fillStyle = "red"
    platformerContext.fillRect(flag.x, flag.y, flag.width, flag.height)
    platformerContext.fillStyle = "black"
  }

  // Render the image when screen 3 is loaded
  if (currentscreen === 3) {
    const screen3Image = document.getElementById("screen3Image")
    platformerContext.drawImage(screen3Image, -100, -400) // Adjust the coordinates as needed
  }
  // Render the image when screen 4 is loaded
  if (currentscreen === 4) {
    const screen4Image = document.getElementById("screen4Image")
    platformerContext.drawImage(screen4Image, -100, -400) // Adjust the coordinates as needed
  }
  // Render the image when screen 5 is loaded
  if (currentscreen === 5) {
    const screen5Image = document.getElementById("screen5Image")
    platformerContext.drawImage(screen5Image, -100, -400) // Adjust the coordinates as needed
  }
  // Render the image when screen 0 is loaded
  if (currentscreen === 0) {
    const screen0Image = document.getElementById("screen0Image")
    platformerContext.drawImage(screen0Image, -100, -400) // Adjust the coordinates as needed
  }

  // Check for platform collisions
  checkPlatformCollision()

  // Check for flag collisions
  if (flag) checkFlagCollision()

  // Apply gravity
  if (!player.grounded) {
    player.dy += GRAVITY
  } else {
    player.dy = 0
  }

  // Collision detection with coins
  for (let coin of coins) {
    if (!coin.collected && player.x < coin.x + 10 && player.x + PLAYER_WIDTH > coin.x && player.y < coin.y + 10 && player.y + PLAYER_HEIGHT > coin.y) {
      player.score += COIN_VALUE
      coin.collected = true
      platformerScoreElement.innerText = "Score: " + player.score
    }
  }

  // Floor collision
  if (player.y >= FLOOR_Y) {
    player.y = FLOOR_Y
    player.dy = 0
    player.grounded = true
  }

  // Update dx based on key states
  if (keyStates.ArrowLeft) {
    if (player.dx > -PLAYER_SPEED) player.dx -= 1
  } else if (keyStates.ArrowRight) {
    if (player.dx < PLAYER_SPEED && player.x < maxAllowedX) player.dx += 1 // Check player's position
  } else {
    player.dx = 0
  }
  

  animationId = requestAnimationFrame(gameLoop)
}


// Function to check if the game has been played before
function checkIfGamePlayed() {
  const hasPlayed = localStorage.getItem("hasPlayedPlatformer")
  if (!hasPlayed) {
    // Show the welcome message
    showWelcomeMessage()
    // Set the flag to indicate that the game has been played
    localStorage.setItem("hasPlayedPlatformer", true)
  }
}


// Call this function to check if the game has been played
checkIfGamePlayed()



// Function to show the welcome message
function showWelcomeMessage() {
  const alertMessage = document.getElementById('alertMessage')
  const closeButton = document.getElementById('closeButton')
  const moveButton = document.getElementById('moveButton')
  const alertMessage2 = document.getElementById('alertMessage2')

  alertMessage.style.display = 'block'

  closeButton.addEventListener('click', closeAlertMessages, function () {
    if (!messageMovedToRight) {

      // Hide alertMessage and show alertMessage2
      alertMessage.style.display = 'none'
      alertMessage2.style.display = 'block'
    } else {
      // Move alertMessage2 to the left
      alertMessage2.classList.add('left')
      // Hide the message after it has been moved to the left
      alertMessage2.style.display = 'none'
    }
  })
  
  moveButton.addEventListener('click', function () {
    // Add the slide-left class to trigger the animation
    alertMessage2.classList.add('slide-left')
    // After the animation is done, remove the button from the DOM
    alertMessage2.addEventListener('animationend', function () {
      moveButton.remove()
    })
  })
}

window.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    toggleWelcomeMessages();
  }
});


function toggleWelcomeMessages() {
  const alertMessage = document.getElementById('alertMessage');
  const alertMessage2 = document.getElementById('alertMessage2');

  if (alertMessage.style.display === 'block') {
    // Hide alertMessage and show alertMessage2
    alertMessage.style.display = 'none';
    alertMessage2.style.display = 'block';
  } else if (alertMessage2.style.display === 'block') {
    // Move alertMessage2 to the left
    alertMessage2.classList.add('left');
    // After the animation is done, remove the button from the DOM
    alertMessage2.addEventListener('animationend', function () {
      moveButton.remove()
    })
  }
}



gameLoop()


// Event listeners for controls
window.addEventListener('keydown', function(event) {
  switch(event.key) {
    case 'ArrowUp':
      if (player.grounded) {
        player.dy = -JUMP_FORCE
        player.grounded = false
      }
      break
    case 'ArrowLeft':
      keyStates.ArrowLeft = true // Set left key state to true
      break
    case 'ArrowRight':
      keyStates.ArrowRight = true // Set right key state to true
      break 
    case ',':
      loadPreviousscreen()
      break
    case '.':
      loadNextscreen()
      break
  }
})


window.addEventListener('keyup', function(event) {
  switch(event.key) {
    case 'ArrowLeft':
      keyStates.ArrowLeft = false // Set left key state to false
      break
    case 'ArrowRight':
      keyStates.ArrowRight = false // Set right key state to false
      break
  }
})


function loadPreviousscreen() {
  if (currentscreen > 0 && currentscreen !== 3) {
    let playerYRatio = player.y / platformerCanvas.height // Save the height ratio
    let playerXRatio = player.x / platformerCanvas.width // Save the width ratio
    currentscreen--
    console.log(`Moved to previous screen: ${currentscreen}`)
    player.x = playerXRatio * platformerCanvas.width // Maintain the same width ratio
    player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
    platforms = screens[currentscreen].platforms
    coins = screens[currentscreen].coins
    if (screens[currentscreen].flag) {
      flag = screens[currentscreen].flag
      flag.isReached = false // Reset the flag's state
    }
  }
}


function loadNextscreen() {
  if (currentscreen < 2 || currentscreen > 2) {
    let playerYRatio = player.y / platformerCanvas.height // Save the height ratio
    let playerXRatio = player.x / platformerCanvas.width // Save the width ratio
    currentscreen++
    console.log(`Moved to next screen: ${currentscreen}`)
    player.x = playerXRatio * platformerCanvas.width // Maintain the same width ratio
    player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
    platforms = screens[currentscreen].platforms
    coins = screens[currentscreen].coins
    flag = screens[currentscreen].flag
    
    // Update maxAllowedX after screen change
    if (currentscreen === 3) {
      maxAllowedX = platformerCanvas.width
    }
  }
}





// Event listener for previous screen button
document.getElementById('previousscreen').addEventListener('click', function() {
  if (currentscreen > 0) {
    let playerYRatio = player.y / platformerCanvas.height // Save the height ratio
    let playerXRatio = player.x / platformerCanvas.width // Save the width ratio
    currentscreen--
    console.log(`Moved to previous screen: ${currentscreen}`)
    player.x = playerXRatio * platformerCanvas.width // Maintain the same width ratio
    player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
    platforms = screens[currentscreen].platforms
    coins = screens[currentscreen].coins
    if(screens[currentscreen].flag) {
      flag = screens[currentscreen].flag
      flag.isReached = false  // Reset the flag's state
    }
  }
})


// Event listener for next screen button
document.getElementById('nextscreen').addEventListener('click', function() {
  loadNextscreen()
})



// Event listener for reset button
document.getElementById('resetButton').addEventListener('click', function() {
  gameRunning = true
  player.x = platformerCanvas.width / 2
  player.y = FLOOR_Y
  player.dy = 0
  player.dx = 0
  player.score = 0
  player.grounded = true
  platformerScoreElement.innerText = "Score: " + player.score
  
  currentscreen = 0
  platforms = screens[currentscreen].platforms
  coins = screens[currentscreen].coins
  flag = screens[currentscreen].flag

  // Reset coins for all screens
  for (let screen of screens) {
    for (let coin of screen.coins) {
      coin.collected = false
    }
    if(screen.flag) screen.flag.isReached = false //reset flags also
  }
})

function checkFlagCollision() {
  // Define the sides of the player and the flag for readability
  const playerLeft = player.x
  const playerRight = player.x + PLAYER_WIDTH
  const playerTop = player.y
  const playerBottom = player.y + PLAYER_HEIGHT
  const flagLeft = flag.x
  const flagRight = flag.x + flag.width
  const flagTop = flag.y
  const flagBottom = flag.y + flag.height

  if (
    playerRight > flagLeft &&
    playerLeft < flagRight &&
    playerBottom > flagTop &&
    playerTop < flagBottom
  ) {
    // Player is colliding with the flag
    flag.isReached = true
    if (currentscreen === 0) {
      currentscreen = 3
      player.x = 0 // Reset player's position for the new screen
      player.y = FLOOR_Y
      platforms = screens[currentscreen].platforms
      coins = screens[currentscreen].coins
      flag = screens[currentscreen].flag
    }
  }
}



function showWelcomeMessage() {
  const alertMessage = document.getElementById('alertMessage')
  const closeButton = document.getElementById('closeButton')
  const moveButton = document.getElementById('moveButton')
  const alertMessage2 = document.getElementById('alertMessage2')

  alertMessage.style.display = 'block'

  closeButton.addEventListener('click', function () {
    if (!messageMovedToRight) {

      // Hide alertMessage and show alertMessage2
      alertMessage.style.display = 'none'
      alertMessage2.style.display = 'block'
    } else {
      // Move alertMessage2 to the left
      alertMessage2.classList.add('left')
      // Hide the message after it has been moved to the left
      alertMessage2.style.display = 'none'
    }
  })
  
  moveButton.addEventListener('click', function () {
    // Add the slide-left class to trigger the animation
    alertMessage2.classList.add('slide-left')
    // After the animation is done, remove the button from the DOM
    alertMessage2.addEventListener('animationend', function () {
      moveButton.remove()
    })
  })
}
