const alertMessageSnake = document.getElementById('alertMessageSnake')
const alertMessage2Snake = document.getElementById('alertMessage2Snake')
const startButton = document.getElementById('startButton')
const snakeCanvas = document.getElementById('snake-game-canvas')
const snakeContext = snakeCanvas.getContext('2d')
const box = 20
let snake = []
let hasShownWelcomeMessageSnake = false
snake[0] = {x : 10 * box, y : 10 * box}

let score = 0
const scoreElement = document.getElementById('score')

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

let d
let gameStarted = false

document.addEventListener("keydown", direction)

function direction(event) {
    let key = event.keyCode
    if (!gameStarted) { // If the game hasn't started yet
      gameStarted = true // Set the gameStarted flag to true
      game = setInterval(draw, 100) // Start the game
    }
    if( key == 37 && d != "RIGHT"){
        d = "LEFT"
    } else if(key == 38 && d != "DOWN"){
        d = "UP"
    } else if(key == 39 && d != "LEFT"){
        d = "RIGHT"
    } else if(key == 40 && d != "UP"){
        d = "DOWN"
    }
}

function draw(){
    snakeContext.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height)
    
    for(let i = 0; i < snake.length;  i++){
        snakeContext.fillStyle = (i == 0)? "green" : "green"
        snakeContext.fillRect(snake[i].x,snake[i].y,box,box)
    }
    
    snakeContext.fillStyle = "red"
    snakeContext.fillRect(food.x, food.y, box, box)
    
    let snakeX = snake[0].x
    let snakeY = snake[0].y
    
    if(d == "LEFT") snakeX -= box
    if(d == "UP") snakeY -= box
    if(d == "RIGHT") snakeX += box
    if(d == "DOWN") snakeY += box

    // Wall collision detection here
    if(snakeX < 0 || snakeY < 0 || snakeX >= snakeCanvas.width || snakeY >= snakeCanvas.height){
        endGame()
    }
    

    if(snakeX == food.x && snakeY == food.y){
        score++
        scoreElement.innerText = score
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
    } else {
        snake.pop()
    }

    let newHead = {
        x : snakeX,
        y : snakeY
    }

    snake.unshift(newHead)
}

let game

let gameOver = false

startButton.addEventListener('click', () => {
    alertMessageSnake.style.display = 'none'
    alertMessage2Snake.style.display = 'none'
})

function reset() {
    clearInterval(game)
    game = undefined
    snake = []
    snake[0] = {x : 10 * box, y : 10 * box}

    score = 0
    scoreElement.innerText = ''
    scoreElement.style.display = 'none' // Hide the score

    food = {
        x : Math.floor(Math.random()*17+1) * box,
        y : Math.floor(Math.random()*15+3) * box
    }

    d = undefined

    gameOver = false

    // start a new game
    game = setInterval(draw,100)
    
}



function endGame() {
    clearInterval(game)
    game = undefined

    food = {
        x : Math.floor(Math.random()*17+1) * box,
        y : Math.floor(Math.random()*15+3) * box
    }

    d = undefined

    clearInterval(game) // stop the current game
    scoreElement.innerText = score
    scoreElement.style.display = 'block' // Display the score
    gameOver = true
    game = setInterval(draw,100)
}


document.getElementById('startButton').addEventListener('click', reset)

document.addEventListener("keydown", function(event){
    let key = event.keyCode
    if((key == 13 || key == 37 || key == 38 || key == 39 || key == 40) && gameOver){
        reset()
    }
})

function showWelcomeMessageSnake() {
    const alertMessageSnake = document.getElementById('alertMessageSnake')
    const closeButtonSnake = document.getElementById('closeButtonSnake')
    const moveButtonSnake = document.getElementById('moveButtonSnake')
    const alertMessage2Snake = document.getElementById('alertMessage2Snake')

    alertMessageSnake.style.display = 'block'

    closeButtonSnake.addEventListener('click', function () {
    if (!messageMovedToRight) {

        // Hide alertMessageSnake and show alertMessage2Snake
        alertMessageSnake.style.display = 'none'
        alertMessage2Snake.style.display = 'block'
    } else {
        // Move alertMessage2Snake to the left
        alertMessage2Snake.classList.add('left')
        // Hide the message after it has been moved to the left
        alertMessage2Snake.style.display = 'none'
    }
    })
    
    moveButtonSnake.addEventListener('click', function () {
      // Add the slide-left class to trigger the animation
    alertMessage2Snake.classList.add('slide-left')
      // After the animation is done, remove the button from the DOM
    alertMessage2Snake.addEventListener('animationend', function () {
        moveButtonSnake.remove()
    })
    })
}

// Call the function to show the welcome message
if (!hasShownWelcomeMessageSnake) {
    hasShownWelcomeMessageSnake = true
    showWelcomeMessageSnake()
  }