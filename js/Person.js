class Person extends GameObject{
  constructor(config) {
    super(config)
    // other initialization code
    this.moreInfoText = config.moreInfoText || "Default info text for a person."
    this.movingProgressRemaining = 0
    this.isStanding = false

    this.isPlayerControlled = config.isPlayerControlled || false

    this.directionUpdate = {
      'up': ['y', -1],
      'down': ['y', 1],
      'left': ['x', -1],
      'right': ['x', 1],
    }
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
    this.updatePosition()
    } else {

      //cases for starting to walk

      //keyboard ready and have key pressed
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: 'walk',
          direction: state.arrow
        })
      }
      this.updateSprite(state)
    }
  }

  //set character direction to behavior
  startBehavior(state, behavior) {
    this.direction = behavior.direction
    console.log('Hero position:', this.x, this.y)
    if (behavior.type === 'walk') {
      //stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 10)
        return 
      }
      //ready to walk
      //commented out code below moves the wall around NPCs
      // state.map.moveWall(this.x, this.y, this.direction)
      this.movingProgressRemaining = 16
      this.updateSprite(state)
    }

    if (behavior.type === 'stand') {
      this.isStanding = true
      setTimeout(() => {
        utils.emitEvent('PersonStandComplete', {
          whoId: this.id
        })
        this.isStanding = false
      }, behavior.time)
    }
  }


  updatePosition() {
      const [property, change] = this.directionUpdate[this.direction]
      this[property] += change
      this.movingProgressRemaining -= 1

      if (this.movingProgressRemaining === 0) {
      utils.emitEvent('PersonWalkingComplete', {
        whoId: this.id
      })
  }
}


updateSprite(state) {

  if (this.movingProgressRemaining > 0) {
    this.sprite.setAnimation('walk-'+this.direction)
    return
  }
  this.sprite.setAnimation('idle-'+this.direction)

    if (this.isHovered) {
      document.body.style.cursor = "pointer"
    } else {
      document.body.style.cursor = "default"
    }
  }

  handleClick() {
    console.log("Person clicked")
    // Add your logic here for handling the click event
  }

  handleMouseOver() {
    this.isHovered = true
  }

  handleMouseOut() {
    this.isHovered = false
  }

  clickableCoordinate(x, y) {
    const offsetX = x - this.x
    const offsetY = y - this.y
    return offsetX >= 0 && offsetX < this.width && offsetY >= 0 && offsetY < this.height
  }
}
