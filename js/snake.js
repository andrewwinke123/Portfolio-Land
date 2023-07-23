const canvas = document.getElementById('snake-game-canvas')
const context = canvas.getContext('2d')
const box = 20
let snake = []
snake[0] = {x : 10 * box, y : 10 * box}

let score = 0
const scoreElement = document.getElementById('score')

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

let d

document.addEventListener("keydown", direction)

function direction(event){
    let key = event.keyCode
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
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    for(let i = 0; i < snake.length ; i++){
        context.fillStyle = (i == 0)? "green" : "green"
        context.fillRect(snake[i].x,snake[i].y,box,box)
    }
    
    context.fillStyle = "red"
    context.fillRect(food.x, food.y, box, box)
    
    let snakeX = snake[0].x
    let snakeY = snake[0].y
    
    if(d == "LEFT") snakeX -= box
    if(d == "UP") snakeY -= box
    if(d == "RIGHT") snakeX += box
    if(d == "DOWN") snakeY += box

    // Wall collision detection here
    if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height){
        endGame()
    }
    

    if(snakeX == food.x && snakeY == food.y){
        score++
        scoreElement.innerText = 'Score: ' + score
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

let game = setInterval(draw,100)


function reset() {
    clearInterval(game) // stop the current game
    // re-initialize all variables
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

    // start a new game
    game = setInterval(draw,100)
}


function endGame() {
    clearInterval(game) // stop the current game
    scoreElement.innerText = 'Score: ' + score
    scoreElement.style.display = 'block' // Display the score
    game = setInterval(draw,100)
}


document.getElementById('start').addEventListener('click', reset)
