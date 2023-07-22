class Overworld {
  constructor(config) {
    this.element = config.element
    this.canvas = this.element.querySelector('.game-canvas')
    this.ctx = this.canvas.getContext('2d')
    this.map = null
    window.game = this
  }

  startGameLoop() {
    const step = () => {
      //clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow:this.directionInput.direction,
          map: this.map,
          
        })
      })

      //Establish camera person
      let cameraPerson
      if (this.map.gameObjects.cameraStationaryPoint) {
        // If the current map has a cameraStationaryPoint, the camera follows it.
        cameraPerson = this.map.gameObjects.cameraStationaryPoint
      } else {
        // On all other maps, the camera follows the hero.
        cameraPerson = this.map.gameObjects.hero
      }




    //   // Here we control the panning.
    // if (this.panningProgress > 0) {
    //   cameraPerson.x -= 1
    //   this.panningProgress -= 1
    // }
      





      if (this.map.isContactMeMap()) {
        document.getElementById('contactFormContainer').style.display = 'block'
      } else {
        document.getElementById('contactFormContainer').style.display = 'none'
      }
      
    
      
      //Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson)

      //Game objects
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y
      }).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
        object.sprite.draw(this.ctx, cameraPerson)
      })
      //Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson)

    requestAnimationFrame(() => {
      step()
    })
  }
  step()
}

bindActionInput() {
  new KeyPressListener('Enter', () => {
    //asking if there is an NPC to talk to
    this.map.checkForActionCutscene()
  })
}

bindHeroPositionCheck() {
  document.addEventListener('PersonWalkingComplete', e => {
    if (e.detail.whoId === 'hero') {
      //heros position has changed
      this.map.checkForCutscene()
    }
  })
}

startMap(mapConfig) {
  this.map = new OverworldMap(mapConfig)
  this.map.overworld = this
  this.map.mountObjects()
  // If the current map is ContactMeMap, we start panning.
  if (this.map.isContactMeMap()) {
    this.panningProgress = 16 * 16 // 16 spaces to the left, each space is 16px.
  }

  // If the current map is SnakeMap, we show the snake game canvas.
  if (mapConfig === window.OverworldMaps.SnakeMap) {
    document.querySelector('.snake-game-container').style.display = 'block'
    document.querySelector('.game-container').style.display = 'none'
  } else {
    document.querySelector('.snake-game-container').style.display = 'none'
    document.querySelector('.game-container').style.display = 'block'
  }

}


  init() {
    this.startMap(window.OverworldMaps.SnakeMap)

    this.bindActionInput()
    this.bindHeroPositionCheck()

    this.directionInput = new DirectionInput()
    this.directionInput.init()
    
    this.startGameLoop()

    this.canvas.addEventListener('click', (event) => {
  const rect = this.canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  console.log('Click coordinates: ', x, y)
  const gameObject = this.map.getGameObjectAtPoint(x, y)
  
  if (gameObject && gameObject instanceof Person) {
    new MoreInfo({
      text: gameObject.moreInfoText,
      onComplete: () => console.log('MoreInfo done.')
    }).init(document.body)
  }
})

  }
}


// the function to change the map via the tabs
function changeMap(mapName) {
  if (window.game && window.OverworldMaps[mapName]) {
    window.game.startMap(window.OverworldMaps[mapName])
  }
}