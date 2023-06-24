class OverworldEvent {
  constructor({ map, event }) {
    this.map = map
    this.event = event
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ]
    who.startBehavior({
      map: this.map
    }, {
      type: 'stand',
      direction: this.event.direction,
      time: this.event.time
    })

    //set up a handler to complete when correct person is done walking, then resolve event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler)
        resolve()
    }
  }

    document.addEventListener('PersonStandComplete', completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ]
    who.startBehavior({
      map: this.map
    }, {
      type: 'walk',
      direction: this.event.direction,
      retry: true
    })

    //set up a handler to complete when correct person is done walking, then resolve event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler)
        resolve()
    }
  }

    document.addEventListener('PersonWalkingComplete', completeHandler)
  }

  textMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero]
      obj.direction = utils.oppositeDirection(this.map.gameObjects['hero'].direction)
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector('.game-container') )
  }

  changeMap(resolve) {
    // replace this with your logic to change map
    console.log('Map changing to:', this.event.map);
    resolve();
  }

  textMessage(resolve) {
    const textMessage = new TextMessage({
      text: this.event.text,
      onComplete: resolve,
    });
    textMessage.init(/* provide container element here */);
  }

  textMessage2(resolve) {
    const textMessage2 = new TextMessage2({
      text: this.event.text,
      onComplete: resolve,
    });
    textMessage2.init(document.querySelector('.game-container'));  // Passed '.game-container' as container
  }
  



  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}