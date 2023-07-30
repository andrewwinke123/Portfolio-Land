const platformerCanvas = document.getElementById('platformerGameCanvas')
const platformerContext = platformerCanvas.getContext('2d')
const scoreElement = document.getElementById('platformerScore')


// Constants for game elements
const GRAVITY = 1
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20
const FLOOR_Y = platformerCanvas.height - PLAYER_HEIGHT
const JUMP_FORCE = 20
const COIN_VALUE = 10
const PLAYER_SPEED = 5

let player = {
  x: platformerCanvas.width / 2,
  y: FLOOR_Y,
  dx: 0,
  dy: 0,
  score: 0,
  grounded: true
}

// Platforms
let platforms = [
  { x: 50, y: 300, width: 100, height: 10 },
  { x: 200, y: 200, width: 100, height: 10 },
  { x: 380, y: 150, width: 100, height: 10 }
]

// Check for collisions with any platform
function checkPlatformCollision() {
  for(let platform of platforms) {
    // Define the sides of the player and the platform for readability
    const playerLeft = player.x;
    const playerRight = player.x + PLAYER_WIDTH;
    const playerTop = player.y;
    const playerBottom = player.y + PLAYER_HEIGHT;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;
    const platformTop = platform.y;
    const platformBottom = platform.y + platform.height;

    if (
      playerRight > platformLeft &&
      playerLeft < platformRight &&
      playerBottom > platformTop &&
      playerTop < platformBottom
    ) {
      // Player is colliding with the platform
      // Calculate the collision depth on all four sides
      const collisionDepthTop = playerBottom - platformTop;
      const collisionDepthBottom = platformBottom - playerTop;
      const collisionDepthLeft = playerRight - platformLeft;
      const collisionDepthRight = platformRight - playerLeft;

      // Determine which side had the shallowest collision
      const minCollisionDepth = Math.min(collisionDepthTop, collisionDepthBottom, collisionDepthLeft, collisionDepthRight);

      switch (minCollisionDepth) {
        case collisionDepthTop:
          // Top collision
          player.y = platformTop - PLAYER_HEIGHT;
          player.dy = 0;
          player.grounded = true;
          break;
        case collisionDepthBottom:
          // Bottom collision
          player.y = platformBottom;
          player.dy = 0;
          break;
        case collisionDepthLeft:
          // Left collision
          player.x = platformLeft - PLAYER_WIDTH;
          player.dx = 0;
          break;
        case collisionDepthRight:
          // Right collision
          player.x = platformRight;
          player.dx = 0;
          break;
      }

      return;
    }
  }
  player.grounded = false; // If we're not colliding with any platform, we're in the air
}


// Coins
let coins = [
  { x: 100, y: 200, collected: false },
  { x: 350, y: 250, collected: false },
  { x: 450, y: 100, collected: false }
]

// Game loop
function gameLoop() {
  // Clear the platformerCanvas
  platformerContext.clearRect(0, 0, platformerCanvas.width, platformerCanvas.height)

  // Check for platform collisions
let onPlatform = checkPlatformCollision();
if (onPlatform && player.dy > 0) { // If we're moving down, stop at the platform
  player.dy = 0;
  player.grounded = true;
} else if (!onPlatform && player.y < FLOOR_Y) { // If we're not on a platform and above the floor, we're in the air
  player.grounded = false;
}

// Apply gravity
if (!player.grounded) {
  player.dy += GRAVITY
}

// Limit falling speed
const MAX_FALL_SPEED = 15; // Adjust as necessary
if (player.dy > MAX_FALL_SPEED) {
  player.dy = MAX_FALL_SPEED;
}

// Move player
player.x += player.dx
player.y += player.dy


  // Draw player
  platformerContext.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT)

  // Draw platforms
  for(let platform of platforms) {
    platformerContext.fillRect(platform.x, platform.y, platform.width, platform.height);
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

  // Check for platform collisions
  checkPlatformCollision()

  // Apply gravity
  if (!player.grounded) {
    player.dy += GRAVITY;
  } else {
    player.dy = 0;
  }

  // Collision detection with coins
for (let coin of coins) {
  if (!coin.collected && player.x < coin.x + 10 && player.x + PLAYER_WIDTH > coin.x && player.y < coin.y + 10 && player.y + PLAYER_HEIGHT > coin.y) {
    player.score += COIN_VALUE
    coin.collected = true
    scoreElement.innerText = "Score: " + player.score
  }
}


  // Floor collision
  if (player.y >= FLOOR_Y) {
    player.y = FLOOR_Y
    player.dy = 0
    player.grounded = true
  }

  requestAnimationFrame(gameLoop)
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
      player.dx = -PLAYER_SPEED
      break
    case 'ArrowRight':
      player.dx = PLAYER_SPEED
      break
  }
})

window.addEventListener('keyup', function(event) {
  switch(event.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      player.dx = 0
      break
  }
})

// Event listener for reset button
document.getElementById('resetButton').addEventListener('click', function() {
  player.x = platformerCanvas.width / 2
  player.y = FLOOR_Y
  player.dy = 0
  player.dx = 0
  player.score = 0
  player.grounded = true
  scoreElement.innerText = "Score: " + player.score

  for (let coin of coins) {
    coin.collected = false
  }
})

