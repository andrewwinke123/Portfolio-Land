class Chest extends GameObject {
  constructor(config) {
    super(config)
    this.sprite = new Sprite({
      gameObject: this,
      src: '/media/characters/chest.png',
      animations: {
        'closed-down' : [ [0,0] ],
        'open-down' : [ [1,0] ],
      },
      currentAnimation: 'closed-down'
    })
    this.storyFlag = config.storyFlag
  }

  // update() {
  //   this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
  //   ? 'closed-down'
  //   : 'open-down'
  // }
}