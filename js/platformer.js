const platformCanvas = document.getElementById('gameCanvas')
const platformerContext = platformCanvas.getContext('2d')

// Constants for game elements
const GRAVITY = 1
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20
const FLOOR_Y = platformCanvas.height - PLAYER_HEIGHT;
const JUMP_FORCE = 20
const COIN_VALUE = 10

let player = {
  x: platformCanvas.width / 2,
  y: FLOOR_Y,
  dy: 0,
  score: 0,
  grounded: true
}

let coins = [
  { x: 100, y: 200, collected: false },
  { x: 300, y: 400, collected: false }
]

// Game loop
function gameLoop() {
  // Clear the platformCanvas
  platformerContext.clearRect(0, 0, platformCanvas.width, platformCanvas.height)

  // Apply gravity
  if (!player.grounded) {
    player.dy += GRAVITY
  }

  // Move player
  player.y += player.dy

  // Draw player
  platformerContext.fillStyle = '#000';  // or any color
  platformerContext.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT)

  // Draw coins
  for (let coin of coins) {
    if (!coin.collected) {
      platformerContext.beginPath()
      platformerContext.arc(coin.x, coin.y, 10, 0, Math.PI * 2, false)
      platformerContext.closePath()
      platformerContext.fill()
    }
  }

  // Collision detection with coins
  for (let coin of coins) {
    if (!coin.collected && player.x < coin.x + 10 && player.x + PLAYER_WIDTH > coin.x && player.y < coin.y + 10 && player.y + PLAYER_HEIGHT > coin.y) {
      player.score += COIN_VALUE
      coin.collected = true
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

// Event listener for jumping
window.addEventListener('keydown', function(event) {
  if (event.key === ' ' && player.grounded) {
    player.dy = -JUMP_FORCE
    player.grounded = false
  }
})

// Event listener for reset button
document.getElementById('resetButton').addEventListener('click', function() {
  player.x = platformCanvas.width / 2
  player.y = FLOOR_Y
  player.dy = 0
  player.score = 0
  player.grounded = true

  for (let coin of coins) {
    coin.collected = false
  }
})
