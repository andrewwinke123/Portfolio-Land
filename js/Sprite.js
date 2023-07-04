class Sprite {
  constructor(config) {

    //Set up the image
    this.image = new Image()
    this.image.src = config.src
    this.image.onload = () => {
      this.isLoaded = true
    }

    //Configure animation & initial state
    this.animations = config.animations || {
      'idle-down': [ [0,0] ],
      'idle-right': [ [0,1] ],
      'idle-up': [ [0,3] ],
      'idle-left': [ [0,2] ],
      'walk-down' : [ [1,3], [0,3], [3,3], [0,3] ],
      'walk-right' : [ [1,1], [0,1], [3,1], [0,1] ],
      'walk-left' : [ [1,2], [0,2], [3,2], [0,2] ],
      'walk-up' : [ [1,3], [0,3], [3,3], [0,3] ]
    }
    this.currentAnimation = config.currentAnimation || 'idle-down' //config.currentAnimation || 'idle-down'
    this.currentAnimationFrame = 0
    this.animationFrameLimit = config.animationFrameLimit || 4
    this.animationFrameProgress = this.animationFrameLimit

    //Reference game object
    this.gameObject = config.gameObject

    //Configure frame dimensions
    this.frameWidth = config.frameWidth || 64
    this.frameHeight = config.frameHeight || 64
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key
      this.currentAnimationFrame = 0
      this.animationFrameProgress = this.animationFrameLimit
    }
  }

  updateAnimationProgress() {
    //downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1
      return
    }
    //reset counter
    this.animationFrameProgress = this.animationFrameLimit
    this.currentAnimationFrame += 1
  
    if (this.frame === undefined) { 
      this.currentAnimationFrame = 0
    }
  }
  

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 4 + utils.widthGrid(10.5) - cameraPerson.x
    const y = this.gameObject.y - 18 + utils.widthGrid(12.5) - cameraPerson.y

    const [frameX, frameY] = this.frame

    this.isLoaded && ctx.drawImage(this.image,
      frameX * this.frameWidth, frameY * this.frameHeight, // source x, y
      this.frameWidth, this.frameHeight, // source width, height
      x, y, // destination x, y
      this.frameWidth, this.frameHeight // destination width, height
    )
    this.updateAnimationProgress()

  //   if(this.gameObject instanceof Person) { // add this check if you only want to draw the bounding box for objects of the class Person
  //   ctx.beginPath()
  //   ctx.rect(x, y, this.frameWidth, this.frameHeight)
  //   ctx.lineWidth = 1
  //   ctx.strokeStyle = 'red'
  //   ctx.stroke()
  // }
  }

}