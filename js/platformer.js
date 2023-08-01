const platformerCanvas = document.getElementById('platformerGameCanvas')
const platformerContext = platformerCanvas.getContext('2d')
const platformerScoreElement = document.getElementById('platformerScore')

// Constants for game elements
const GRAVITY = 1
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20
const FLOOR_Y = platformerCanvas.height - PLAYER_HEIGHT
const JUMP_FORCE = 20
const COIN_VALUE = 10
const PLAYER_SPEED = 5

// Levels
const levels = [
  {
    platforms: [
      // Platforms 0
      { x: 50, y: 300, width: 200, height: 10 },
      { x: 200, y: 200, width: 125, height: 10 },
      { x: 380, y: 150, width: 100, height: 10 },
      { x: 380, y: 150, width: 400, height: 500 },
      // Border
      { x: 0, y: 0, width: 10, height: 550 },
      { x: 0, y: 50, width: 10, height: 550 },
      { x: 10, y: 0, width: 550, height: 10 },
      { x: 0, y: 382, width: 550, height: 10 },
    ],
    coins: [
      { x: 100, y: 200, collected: false },
      { x: 350, y: 250, collected: false },
      { x: 450, y: 100, collected: false }
    ],
  },
  {
    platforms: [
      // Platforms 1
      { x: 50, y: 300, width: 300, height: 10 },
      { x: 180, y: 200, width: 100, height: 10 },
      { x: 0, y: 150, width: 100, height: 500 },
      // Border
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
      { x: 250, y: 300, width: 300, height: 10 },
      { x: 180, y: 200, width: 100, height: 10 },
      // Border
      { x: 0, y: 0, width: 550, height: 10 },
      { x: 0, y: 382, width: 550, height: 10 },
      { x: 530, y: 0, width: 10, height: 550 },
    ],
    coins: [
      { x: 225, y: 150, collected: false },
      { x: 450, y: 350, collected: false },
    ],
    flag: { x: 200, y: 140, width: 20, height: 60, isReached: false },
  },
  // Additional levels
]


let currentLevel = 0
let gameRunning = true
let platforms = levels[currentLevel].platforms
let coins = levels[currentLevel].coins
let flag = levels[currentLevel].flag

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

// Game loop
function gameLoop() {
  if (!gameRunning) {
    return // Stop the loop
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

// Check for win condition
if(flag && Math.abs(player.x - flag.x) < PLAYER_WIDTH && Math.abs(player.y - flag.y) < PLAYER_HEIGHT){
  endGame()
}


  // Calculate player's vertical position ratio
  let playerYRatio = player.y / platformerCanvas.height

  // Check for level transition
  if (player.x < 0) {
    flag = levels[currentLevel].flag
    // Player has moved off the left side of the screen
    if (currentLevel > 0) {
      currentLevel--
      // Reset player position and load new level data
      player.x = platformerCanvas.width - PLAYER_WIDTH // Player enters from the right side
      player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
      platforms = levels[currentLevel].platforms
      coins = levels[currentLevel].coins
    } else {
      player.x = 0
    }
  } else if (player.x + PLAYER_WIDTH > platformerCanvas.width) {
    // Player has moved off the right side of the screen
    if (currentLevel < levels.length - 1) {
      currentLevel++
      // Reset player position and load new level data
      player.x = 0 // Player enters from the left side
      player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
      platforms = levels[currentLevel].platforms
      coins = levels[currentLevel].coins
      flag = levels[currentLevel].flag
    } else {
      player.x = platformerCanvas.width - PLAYER_WIDTH
    }

    // Update flag for current level
  flag = levels[currentLevel].flag
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


  // Check for platform collisions
  checkPlatformCollision()

  // Check for flag collisions
  checkFlagCollision()

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
  if(keyStates.ArrowLeft) {
    if(player.dx > -PLAYER_SPEED) player.dx -= 1
  } else if(keyStates.ArrowRight) {
    if(player.dx < PLAYER_SPEED) player.dx += 1
  } else {
    player.dx = 0
  }

  animationId = requestAnimationFrame(gameLoop)
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


// Event listener for previous level button
document.getElementById('previousLevel').addEventListener('click', function() {
  if (currentLevel > 0) {
    let playerYRatio = player.y / platformerCanvas.height // Save the height ratio
    let playerXRatio = player.x / platformerCanvas.width // Save the width ratio
    currentLevel--
    console.log(`Moved to previous level: ${currentLevel}`)
    player.x = playerXRatio * platformerCanvas.width // Maintain the same width ratio
    player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
    platforms = levels[currentLevel].platforms
    coins = levels[currentLevel].coins
    flag = levels[currentLevel].flag
  }
})

// Event listener for next level button
document.getElementById('nextLevel').addEventListener('click', function() {
  if (currentLevel < levels.length - 1) {
    let playerYRatio = player.y / platformerCanvas.height // Save the height ratio
    let playerXRatio = player.x / platformerCanvas.width // Save the width ratio
    currentLevel++
    console.log(`Moved to next level: ${currentLevel}`)
    player.x = playerXRatio * platformerCanvas.width // Maintain the same width ratio
    player.y = playerYRatio * platformerCanvas.height // Maintain the same height ratio
    platforms = levels[currentLevel].platforms
    coins = levels[currentLevel].coins
    flag = levels[currentLevel].flag
  }
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
  
  currentLevel = 0
  platforms = levels[currentLevel].platforms
  coins = levels[currentLevel].coins
  flag = levels[currentLevel].flag

  // Reset coins for all levels
  for (let level of levels) {
    for (let coin of level.coins) {
      coin.collected = false
    }
    if(level.flag) level.flag.isReached = false //reset flags also
  }
})

function checkFlagCollision() {
  if (flag) {
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
      // Call the function to end the game
      endGame()
    }
  }
}




function endGame(){
  gameRunning = false // stop game loop
  cancelAnimationFrame(animationId) // Stop the game loop

  // Display score
  platformerContext.font = '50px Arial'
  platformerContext.fillStyle = 'red'
  platformerContext.textAlign = 'center'
  platformerContext.fillText('Score: ' + player.score, platformerCanvas.width / 2, platformerCanvas.height / 2)

  // Confetti
  confetti({ particleCount: 100, spread: 70, target: 'platformerGameCanvas' })
}