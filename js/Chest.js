class Chest extends GameObject {
  constructor(config) {
    super(config)
    this.sprite = new Sprite({
      gameObjects: this,
      src: '/images/characters/hi-andrew.png',
      animations: {
        'closed' : [ [0,0] ],
        'open' : [ [1,0] ],
      },
      currentAnimation: 'closed'
    })
  }
}