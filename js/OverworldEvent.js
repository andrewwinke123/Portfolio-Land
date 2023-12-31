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
    const sceneTransition = new SceneTransition()
    sceneTransition.init(document.querySelector('.game-container'), () => {
      this.map.overworld.startMap( window.OverworldMaps[this.event.map] )
      resolve()

      sceneTransition.fadeOut()
    })
  }
    
  moreInfo(resolve) {
    const moreInfo = new MoreInfo({
      text: this.event.text,
      onComplete: resolve,
    })
    moreInfo.init(document.querySelector('.game-container'))
  }

  textMessage(resolve) {
    const textMessage = new TextMessage({
      text: this.event.text,
      onComplete: resolve,
    })
    textMessage.init(document.querySelector('.game-container'))
  }

  aboutMe(resolve) {
    const aboutMe = new AboutMe({
      text: this.event.text,
      onComplete: resolve,
    })
    aboutMe.init(document.querySelector('.game-container'))
  }
  
  experience(resolve) {
    const experience = new Experience({
      text: this.event.text,
      onComplete: resolve,
    })
    experience.init(document.querySelector('.game-container'))
  }
  education(resolve) {
    const educationInstance = new Education({
      text: this.event.text,
      onComplete: resolve,
    })
    educationInstance.init(document.querySelector('.game-container'))
  }

  launchTracker(resolve) {
    const launchTracker = new LaunchTracker({
      text: this.event.text,
      onComplete: resolve,
    })
    launchTracker.init(document.querySelector('.game-container'))
  }
  racroom(resolve) {
    const racroom = new Racroom({
      text: this.event.text,
      onComplete: resolve,
    })
    racroom.init(document.querySelector('.game-container'))
  }
  suggestion(resolve) {
    const suggestion = new Suggestion({
      text: this.event.text,
      onComplete: resolve,
    })
    suggestion.init(document.querySelector('.game-container'))
  }
  bard(resolve) {
    const bard = new Bard({
      text: this.event.text,
      onComplete: resolve,
    })
    bard.init(document.querySelector('.game-container'))
  }
  contactMe(resolve) {
    const contactMe = new ContactMe({
      text: this.event.text,
      onComplete: resolve,
    })
    contactMe.init(document.querySelector('.game-container'))
  }

  
  
  
  
  
  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}