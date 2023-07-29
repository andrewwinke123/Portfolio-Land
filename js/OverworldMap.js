const audio = new Audio('/media/typing-short.mp3')


class OverworldMap {
  constructor(config) {
    this.element = config.element
    this.overworld = null
    this.gameObjects = config.gameObjects
    this.cutsceneSpaces = config.cutsceneSpaces || {}
    this.walls = config.walls || {}

    this.lowerImage = new Image()
    this.lowerImage.src = config.lowerSrc

    this.upperImage = new Image()
    this.upperImage.src = config.upperSrc

    this.isCutscenePlaying = false
  }

  isContactMeMap() {
    return this.lowerImage.src.includes('pixle-portfolio-page-3.png')
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.widthGrid(10.5) - cameraPerson.x,
      utils.widthGrid(6) - cameraPerson.y,
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.widthGrid(10.5) - cameraPerson.x,
      utils.widthGrid(6) - cameraPerson.y,
      )
  }
  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction)
    return this.walls[`${x}, ${y}`] || false
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key]
      object.id = key
      //determine if object should mount
      object.mount(this)
    })
  }

  async startCutscene(events, restrictPlayerMovement = true) {
    this.isCutscenePlaying = restrictPlayerMovement
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init()
    }
    this.isCutscenePlaying = false
  
    //reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }
  

  checkForActionCutscene() {
    const hero = this.gameObjects['hero']
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction)
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`
    })
  
    const actionListener = (key) => {
      if (!this.isCutscenePlaying && match && match.talking.length) {
        this.startCutscene(match.talking[0].events)
      }
    }
  
    const enterKeyListener = new KeyPressListener("Enter", actionListener)
    const spaceKeyListener = new KeyPressListener("Space", actionListener)
  
    setTimeout(() => {
      enterKeyListener.unbind()
      spaceKeyListener.unbind()
    }, 400)
  }
  
  

  checkForCutscene() {
    const hero = this.gameObjects['hero']
    const match = this.cutsceneSpaces[`${hero.x}, ${hero.y}`]
  
    if(match && match[0].requiresEnter) {
      const actionListener = () => {
        if (!this.isCutscenePlaying && match) {
          this.startCutscene(match[0].events)
        }
      }
  
      const enterKeyListener = new KeyPressListener("Enter", actionListener)
      const spaceKeyListener = new KeyPressListener("Space", actionListener)
  
      setTimeout(() => {
        enterKeyListener.unbind()
        spaceKeyListener.unbind()
      })
    } else if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events)
    }
  }
  


  addWall(x,y) {
    this.walls[`${x}, ${y}`] = true
  }
  removeWall(x,y) {
    delete this.walls[`${x}, ${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY)
    const {x,y} = utils.nextPosition(wasX, wasY, direction)
    this.addWall(x,y)
  }

  getGameObjectAtPoint(x, y) {
    const scaledX = x / 16
    const scaledY = y / 16
  
    return Object.values(this.gameObjects).find(object => {
      const objectX = object.x / 16
      const objectY = object.y / 16
      const found = objectX <= scaledX &&
                    objectY <= scaledY &&
                    objectX + object.sprite.frameWidth / 16 >= scaledX &&
                    objectY + object.sprite.frameHeight / 16 >= scaledY
      if (found) {
        console.log('Found object at point: ', object)
      }
      return found
    })
  }
}

window.OverworldMaps = {
  MainMap: {
    lowerSrc: '/media/maps/pixle-portfolio.png',
    upperSrc: '/media/maps/pixle-portfolio-upper.png',
    hasContactForm: true,
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.widthGrid(12),
        y: utils.widthGrid(9),
        moreInfoText: 'Hero',
      }),
      headLeft: new Person({
        x: utils.widthGrid(23),
        y: utils.widthGrid(8),
        src: '/media/characters/people/head-left-character-sheet.png',
        moreInfoText: 'Head left',
        behaviorLoop: [
          { who: 'headLeft', type: 'stand', direction: 'down', time: 2500},
          { who: 'headLeft', type: 'stand', direction: 'right', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'left', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'left', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'right', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'left', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'left', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'right', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
          { who: 'headLeft', type: 'stand', direction: 'up', time: 250},
        ]
      }),
      headRight: new Person({
        x: utils.widthGrid(27),
        y: utils.widthGrid(8),
        src: '/media/characters/people/head-right-character-sheet.png',
        moreInfoText: 'Head right',
        behaviorLoop: [
          { who: 'headRight', type: 'stand', direction: 'down', time: 2500},
          { who: 'headRight', type: 'stand', direction: 'right', time: 250},
          { who: 'headRight', type: 'stand', direction: 'left', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'left', time: 250},
          { who: 'headRight', type: 'stand', direction: 'right', time: 250},
          { who: 'headRight', type: 'stand', direction: 'left', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'left', time: 250},
          { who: 'headRight', type: 'stand', direction: 'right', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
          { who: 'headRight', type: 'stand', direction: 'up', time: 250},
      ]
      }),
      astronaut: new Person({
        x: utils.widthGrid(20),
        y: utils.widthGrid(12),
        src: '/media/characters/people/astronaut-sheet.png',
        moreInfoText: 'LAUNCH TRACKER',
      }),
      resetti: new Person({
        x: utils.widthGrid(20),
        y: utils.widthGrid(21),
        src: '/media/characters/people/resetti-sheet.png',
        moreInfoText: 'SUGGESTIONBOARD',
      }),
      raccoon: new Person({
        x: utils.widthGrid(20),
        y: utils.widthGrid(16),
        src: '/media/characters/people/raccoon-window-sheet.png',
        moreInfoText: 'RACROOM',
      }),
      bard: new Person({
        x: utils.widthGrid(20),
        y: utils.widthGrid(26),
        src: '/media/characters/people/bards-quest-sheet.png',
        moreInfoText: `BARD'S QUEST`,
      }),
      wizard: new Person({
        x: utils.widthGrid(24),
        y: utils.widthGrid(14),
        src: '/media/characters/people/wizard-large.png',
        moreInfoText: 'WIZARD',
        behaviorLoop: [
          { who: 'wizard', type: 'stand', direction: 'down', time: 1000},
          { who: 'wizard', type: 'stand', direction: 'left', time: 500},
          { who: 'wizard', type: 'stand', direction: 'right', time: 500},
          { who: 'wizard', type: 'walk', direction: 'right'},
          { who: 'wizard', type: 'stand', direction: 'right', time: 30},
          { who: 'wizard', type: 'walk', direction: 'right'},
          { who: 'wizard', type: 'stand', direction: 'right', time: 30},
          { who: 'wizard', type: 'stand', direction: 'down', time: 500},
          { who: 'wizard', type: 'stand', direction: 'right', time: 500},
          { who: 'wizard', type: 'stand', direction: 'left', time: 500},
          { who: 'wizard', type: 'walk', direction: 'left'},
          { who: 'wizard', type: 'stand', direction: 'left', time: 30},
          { who: 'wizard', type: 'walk', direction: 'left'},
          { who: 'wizard', type: 'stand', direction: 'left', time: 30},
        ]
      }),
    },
    //roof of roof
    walls: {
      [utils.asGridCoord(9,8)]: true,
      [utils.asGridCoord(10,8)]: true,
      [utils.asGridCoord(11,8)]: true,
      [utils.asGridCoord(12,8)]: true,
      [utils.asGridCoord(13,8)]: true,
      [utils.asGridCoord(14,8)]: true,
      [utils.asGridCoord(15,8)]: true,
      [utils.asGridCoord(16,8)]: true,
      [utils.asGridCoord(17,8)]: true,
      [utils.asGridCoord(18,8)]: true,
      [utils.asGridCoord(19,8)]: true,
      [utils.asGridCoord(20,8)]: true,
      [utils.asGridCoord(21,8)]: true,
      [utils.asGridCoord(22,8)]: true,
      [utils.asGridCoord(23,8)]: true,
      [utils.asGridCoord(24,8)]: true,
      [utils.asGridCoord(25,8)]: true,
      [utils.asGridCoord(26,8)]: true,
      [utils.asGridCoord(27,8)]: true,
      [utils.asGridCoord(28,8)]: true,
      [utils.asGridCoord(29,8)]: true,
      [utils.asGridCoord(30,8)]: true,
      [utils.asGridCoord(31,8)]: true,
      [utils.asGridCoord(32,8)]: true,
      //walls of roof
      [utils.asGridCoord(8,9)]: true,
      [utils.asGridCoord(32,9)]: true,
      //floor of roof
      [utils.asGridCoord(9,10)]: true,
      [utils.asGridCoord(10,10)]: true,
      [utils.asGridCoord(11,10)]: true,
      [utils.asGridCoord(12,10)]: true,
      [utils.asGridCoord(13,10)]: true,
      [utils.asGridCoord(14,10)]: true,
      [utils.asGridCoord(15,10)]: true,
      [utils.asGridCoord(16,10)]: true,
      [utils.asGridCoord(17,10)]: true,
      [utils.asGridCoord(18,10)]: true,
      [utils.asGridCoord(19,10)]: true,
      [utils.asGridCoord(20,10)]: true,
      [utils.asGridCoord(21,10)]: true,
      [utils.asGridCoord(22,10)]: true,
      [utils.asGridCoord(23,10)]: true,
      [utils.asGridCoord(24,10)]: true,
      [utils.asGridCoord(25,10)]: true,
      [utils.asGridCoord(26,10)]: true,
      [utils.asGridCoord(28,10)]: true,
      [utils.asGridCoord(29,10)]: true,
      [utils.asGridCoord(30,10)]: true,
      [utils.asGridCoord(31,10)]: true,
      [utils.asGridCoord(32,10)]: true,

      //ladder back
      [utils.asGridCoord(28,11)]: true,
      [utils.asGridCoord(28,12)]: true,
      [utils.asGridCoord(28,13)]: true,
      [utils.asGridCoord(28,14)]: true,
      [utils.asGridCoord(28,15)]: true,
      [utils.asGridCoord(28,16)]: true,
      [utils.asGridCoord(28,17)]: true,
      [utils.asGridCoord(28,18)]: true,
      [utils.asGridCoord(28,19)]: true,
      [utils.asGridCoord(28,20)]: true,
      [utils.asGridCoord(28,21)]: true,
      [utils.asGridCoord(28,22)]: true,
      [utils.asGridCoord(28,23)]: true,
      [utils.asGridCoord(28,24)]: true,
      [utils.asGridCoord(28,25)]: true,
      [utils.asGridCoord(28,26)]: true,
      [utils.asGridCoord(28,27)]: true,
      [utils.asGridCoord(28,28)]: true,
      [utils.asGridCoord(28,29)]: true,
      [utils.asGridCoord(28,30)]: true,
      [utils.asGridCoord(28,31)]: true,
      [utils.asGridCoord(28,32)]: true,
      [utils.asGridCoord(28,33)]: true,
      [utils.asGridCoord(28,34)]: true,
      [utils.asGridCoord(28,35)]: true,
      [utils.asGridCoord(28,36)]: true,
      [utils.asGridCoord(28,37)]: true,
      //ladder front
      [utils.asGridCoord(26,11)]: true,
      [utils.asGridCoord(26,12)]: true,
      [utils.asGridCoord(26,13)]: true,
      [utils.asGridCoord(26,15)]: true,
      [utils.asGridCoord(26,16)]: true,
      [utils.asGridCoord(26,17)]: true,
      [utils.asGridCoord(26,19)]: true,
      [utils.asGridCoord(26,20)]: true,
      [utils.asGridCoord(26,21)]: true,
      [utils.asGridCoord(26,22)]: true,
      [utils.asGridCoord(26,24)]: true,
      [utils.asGridCoord(26,25)]: true,
      [utils.asGridCoord(26,26)]: true,
      [utils.asGridCoord(26,28)]: true,
      [utils.asGridCoord(26,29)]: true,
      [utils.asGridCoord(26,30)]: true,
      [utils.asGridCoord(26,31)]: true,
      [utils.asGridCoord(26,32)]: true,
      [utils.asGridCoord(26,33)]: true,
      [utils.asGridCoord(26,34)]: true,
      [utils.asGridCoord(26,35)]: true,
      [utils.asGridCoord(26,36)]: true,
      [utils.asGridCoord(26,37)]: true,

      //launch tracker
      [utils.asGridCoord(26,15)]: true,
      [utils.asGridCoord(25,15)]: true,
      [utils.asGridCoord(24,15)]: true,

      [utils.asGridCoord(26,13)]: true,
      [utils.asGridCoord(25,13)]: true,
      [utils.asGridCoord(24,13)]: true,

      [utils.asGridCoord(23,14)]: true,


      //racroom
      [utils.asGridCoord(26,19)]: true,
      [utils.asGridCoord(25,19)]: true,
      [utils.asGridCoord(24,19)]: true,

      [utils.asGridCoord(26,17)]: true,
      [utils.asGridCoord(25,17)]: true,
      [utils.asGridCoord(24,17)]: true,

      [utils.asGridCoord(23,18)]: true,


      //suggestion board
      [utils.asGridCoord(26,24)]: true,
      [utils.asGridCoord(25,24)]: true,
      [utils.asGridCoord(24,24)]: true,

      [utils.asGridCoord(26,22)]: true,
      [utils.asGridCoord(25,22)]: true,
      [utils.asGridCoord(24,22)]: true,

      [utils.asGridCoord(23,23)]: true,



      //bard's quest
      [utils.asGridCoord(26,26)]: true,
      [utils.asGridCoord(25,26)]: true,
      [utils.asGridCoord(24,26)]: true,

      [utils.asGridCoord(26,28)]: true,
      [utils.asGridCoord(25,28)]: true,
      [utils.asGridCoord(24,28)]: true,

      [utils.asGridCoord(23,27)]: true,
      
      
      //roof of ground
      [utils.asGridCoord(11,38)]: true,
      [utils.asGridCoord(12,38)]: true,
      [utils.asGridCoord(13,38)]: true,
      [utils.asGridCoord(14,38)]: true,
      [utils.asGridCoord(15,38)]: true,
      [utils.asGridCoord(16,38)]: true,
      [utils.asGridCoord(17,38)]: true,
      [utils.asGridCoord(18,38)]: true,
      [utils.asGridCoord(19,38)]: true,
      [utils.asGridCoord(20,38)]: true,
      [utils.asGridCoord(21,38)]: true,
      [utils.asGridCoord(22,38)]: true,
      [utils.asGridCoord(23,38)]: true,
      [utils.asGridCoord(24,38)]: true,
      [utils.asGridCoord(25,38)]: true,
      [utils.asGridCoord(26,38)]: true,
      [utils.asGridCoord(28,38)]: true,
      [utils.asGridCoord(29,38)]: true,
      [utils.asGridCoord(30,38)]: true,
      [utils.asGridCoord(31,38)]: true,
      [utils.asGridCoord(32,38)]: true,
      [utils.asGridCoord(33,38)]: true,
      [utils.asGridCoord(34,38)]: true,
      //walls of ground
      [utils.asGridCoord(11,39)]: true,
      [utils.asGridCoord(34,39)]: true,
      //floor of ground
      [utils.asGridCoord(11,40)]: true,
      [utils.asGridCoord(12,40)]: true,
      [utils.asGridCoord(13,40)]: true,
      [utils.asGridCoord(14,40)]: true,
      [utils.asGridCoord(15,40)]: true,
      [utils.asGridCoord(16,40)]: true,
      [utils.asGridCoord(17,40)]: true,
      [utils.asGridCoord(18,40)]: true,
      [utils.asGridCoord(19,40)]: true,
      [utils.asGridCoord(20,40)]: true,
      [utils.asGridCoord(21,40)]: true,
      [utils.asGridCoord(22,40)]: true,
      [utils.asGridCoord(23,40)]: true,
      [utils.asGridCoord(24,40)]: true,
      [utils.asGridCoord(25,40)]: true,
      [utils.asGridCoord(26,40)]: true,
      [utils.asGridCoord(27,40)]: true,
      [utils.asGridCoord(28,40)]: true,
      [utils.asGridCoord(29,40)]: true,
      [utils.asGridCoord(30,40)]: true,
      [utils.asGridCoord(31,40)]: true,
      [utils.asGridCoord(32,40)]: true,
      [utils.asGridCoord(33,40)]: true,
      [utils.asGridCoord(34,40)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(26,14)]: [
        {
          events: [
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'stand', direction: 'up'},
            { who: 'astronaut', type: 'stand', direction: 'right', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'right', time: 250},
            { type: 'launchTracker', text:` ` },
            { who: 'astronaut', type: 'stand', direction: 'down', time: 250},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'stand', direction: 'down'},
          ]
        }
      ],
      [utils.asGridCoord(26,18)]: [
        {
          events: [
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'stand', direction: 'up'},
            { who: 'raccoon', type: 'stand', direction: 'right', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { type: 'racroom', text:` ` },
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'raccoon', type: 'stand', direction: 'down', time: 250},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'stand', direction: 'down'},
          ]
        }
      ],
      [utils.asGridCoord(26,23)]: [
        {
          events: [
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'stand', direction: 'up'},
            { who: 'resetti', type: 'stand', direction: 'right', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { type: 'suggestion', text:` ` },
            { who: 'resetti', type: 'stand', direction: 'right', time: 250},
            { who: 'resetti', type: 'stand', direction: 'down', time: 250},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'stand', direction: 'down'},
          ]
        }
      ],
      [utils.asGridCoord(26,27)]: [
        {
          events: [
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'stand', direction: 'up'},
          { who: 'bard', type: 'stand', direction: 'right', time: 250},
          { who: 'bard', type: 'stand', direction: 'left', time: 300},
          { who: 'bard', type: 'stand', direction: 'up', time: 400},
          { type: 'bard', text:` ` },
          { who: 'bard', type: 'stand', direction: 'left', time: 250},
          { who: 'bard', type: 'stand', direction: 'right', time: 100},
          { who: 'bard', type: 'stand', direction: 'down', time: 100},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'stand', direction: 'down'},
          ]
        }
      ],
      [utils.asGridCoord(32,39)]: [
        {
          events: [
            { type: 'changeMap', map: 'AboutMeMap'}
          ]
        }
      ],
      [utils.asGridCoord(12,39)]: [
        {
          events: [
            { type: 'changeMap', map: 'ConstructionMap'}
          ]
        }
      ],
      [utils.asGridCoord(9,9)]: [
        {
          events: [
            { type: 'textMessage', text:`Watch out!` },
            { type: 'textMessage', text:`You almost fell over the edge there.` },
            { type: 'textMessage', text:`Please back up.` },
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'stand', direction: 'down'},
          ]
        }
      ],
      [utils.asGridCoord(31,9)]: [
        {
          events: [
            { type: 'textMessage', text:`Watch out!` },
            { type: 'textMessage', text:`You almost fell over the edge there.` },
            { type: 'textMessage', text:`Please back up.` },
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'walk', direction: 'left'},
            { who: 'hero', type: 'stand', direction: 'down'},
          ]
        }
      ],
    }
  },
  AboutMeMap: {
    lowerSrc: '/media/maps/pixle-portfolio-page-2.png',
    upperSrc: '',
    hasContactForm: false,
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.widthGrid(12),
        y: utils.widthGrid(40),
      }),
      andrewTruck: new Person({
        x: utils.widthGrid(18),
        y: utils.widthGrid(34),
        src: '/media/characters/people/andrew-truck-sheet.png',
      }),
      chest: new Person({
        x: utils.widthGrid(26),
        y: utils.widthGrid(37.5),
        src: '/media/characters/chest.png'
      }),
      chest2: new Person({
        x: utils.widthGrid(28),
        y: utils.widthGrid(37.5),
        src: '/media/characters/chest.png'
      }),
      chest3: new Person({
        x: utils.widthGrid(30),
        y: utils.widthGrid(37.5),
        src: '/media/characters/chest.png'
      }),
      truck: new Person({
        x: utils.widthGrid(36),
        y: utils.widthGrid(41),
        src: '/media/characters/people/truck.png'
      }),
    },
    walls: {
            //roof of ground
            [utils.asGridCoord(12,39)]: true,
            [utils.asGridCoord(13,39)]: true,
            [utils.asGridCoord(14,39)]: true,
            [utils.asGridCoord(15,39)]: true,
            [utils.asGridCoord(16,39)]: true,
            [utils.asGridCoord(17,39)]: true,
            [utils.asGridCoord(18,39)]: true,
            [utils.asGridCoord(19,39)]: true,
            [utils.asGridCoord(20,39)]: true,
            [utils.asGridCoord(21,39)]: true,
            [utils.asGridCoord(22,39)]: true,
            [utils.asGridCoord(23,39)]: true,
            [utils.asGridCoord(24,38)]: true,
            [utils.asGridCoord(25,38)]: true,
            [utils.asGridCoord(26,38)]: true,
            [utils.asGridCoord(27,38)]: true,
            [utils.asGridCoord(28,38)]: true,
            [utils.asGridCoord(29,38)]: true,
            [utils.asGridCoord(30,38)]: true,
            [utils.asGridCoord(31,38)]: true,
            [utils.asGridCoord(32,39)]: true,
            [utils.asGridCoord(33,39)]: true,
            [utils.asGridCoord(34,39)]: true,
            [utils.asGridCoord(35,39)]: true,
            [utils.asGridCoord(36,39)]: true,
            //walls of ground
            [utils.asGridCoord(11,40)]: true,
            [utils.asGridCoord(38,40)]: true,
            //floor of ground
            [utils.asGridCoord(8,41)]: true,
            [utils.asGridCoord(9,41)]: true,
            [utils.asGridCoord(10,41)]: true,
            [utils.asGridCoord(11,41)]: true,
            [utils.asGridCoord(12,41)]: true,
            [utils.asGridCoord(13,41)]: true,
            [utils.asGridCoord(14,41)]: true,
            [utils.asGridCoord(15,41)]: true,
            [utils.asGridCoord(16,41)]: true,
            [utils.asGridCoord(17,41)]: true,
            [utils.asGridCoord(18,41)]: true,
            [utils.asGridCoord(19,41)]: true,
            [utils.asGridCoord(20,41)]: true,
            [utils.asGridCoord(21,41)]: true,
            [utils.asGridCoord(22,41)]: true,
            [utils.asGridCoord(23,41)]: true,
            [utils.asGridCoord(24,41)]: true,
            [utils.asGridCoord(25,41)]: true,
            [utils.asGridCoord(26,41)]: true,
            [utils.asGridCoord(27,41)]: true,
            [utils.asGridCoord(28,41)]: true,
            [utils.asGridCoord(29,41)]: true,
            [utils.asGridCoord(30,41)]: true,
            [utils.asGridCoord(31,41)]: true,
            [utils.asGridCoord(32,41)]: true,
            [utils.asGridCoord(33,41)]: true,
            [utils.asGridCoord(34,41)]: true,
            [utils.asGridCoord(35,41)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(25,39)]: [
        {
          events: [
            { who: 'chest', type: 'stand', direction: 'left', time: 500},
            { who: 'andrewTruck', type: 'stand', direction: 'up', time: 500},
            { type: 'aboutMe', text:'  '},
            { who: 'andrewTruck', type: 'stand', direction: 'right', time: 150},
            { who: 'andrewTruck', type: 'stand', direction: 'down', time: 100},
          ]
        }
      ],
      [utils.asGridCoord(27,39)]: [
        {
          events: [
            { who: 'chest2', type: 'stand', direction: 'left', time: 500},
            { who: 'andrewTruck', type: 'stand', direction: 'up', time: 500},
            { type: 'experience', text:' ' },
            { who: 'andrewTruck', type: 'stand', direction: 'right', time: 150},
            { who: 'andrewTruck', type: 'stand', direction: 'down', time: 100},
          ]
        }
      ],
      [utils.asGridCoord(29,39)]: [
        {
          events: [
            { who: 'chest3', type: 'stand', direction: 'left', time: 500},
            { who: 'andrewTruck', type: 'stand', direction: 'up', time: 500},
            { type: 'education', text:' ' },
            { who: 'hero', type: 'stand', direction: 'right'},
            { who: 'andrewTruck', type: 'stand', direction: 'right', time: 150},
            { who: 'andrewTruck', type: 'stand', direction: 'down', time: 100},
          ]
        }
      ],
      [utils.asGridCoord(37,40)]: [
        {
          requiresEnter: false,
          events: [
            { who: 'hero', type: 'stand', direction: 'right', time: 500},
            { who: 'truck', type: 'walk', direction: 'right'},
            { who: 'truck', type: 'walk', direction: 'right'},
            { type: 'changeMap', map: 'ContactMeMap'},
            { who: 'truck', type: 'walk', direction: 'left'},
            { who: 'truck', type: 'walk', direction: 'left'},
          ]
        }
      ],
      [utils.asGridCoord(12,40)]: [
        {
          requiresEnter: false,
          events: [
            { type: 'changeMap', map: 'MainMap'}
          ]
        }
      ]
    },
    },
    ContactMeMap: {
      lowerSrc: '/media/maps/pixle-portfolio-page-3.png',
      upperSrc: '/media/maps/pixle-portfolio-page-3-upper.png',
      hasContactForm: true,
      stationaryCamera: true,
      gameObjects: {
        cameraStationaryPoint: new InvisibleObject({
          x: utils.widthGrid(15), 
          y: utils.widthGrid(40),  
        }),
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(15),
          y: utils.widthGrid(40),
        }),
        driver: new Person({
          x: utils.widthGrid(16),
          y: utils.widthGrid(36),
          src: '/media/characters/people/little-goblin-large-extended.png',
          behaviorLoop: [
            { who: 'driver', type: 'stand', direction: 'right', time: 3000},
            { who: 'driver', type: 'stand', direction: 'fifth-frame', time: 3000},
            { who: 'driver', type: 'stand', direction: 'right', time: 550},
            { who: 'driver', type: 'stand', direction: 'down', time: 50},
            { who: 'driver', type: 'stand', direction: 'sixth-frame', time: 3000},
            // { type: 'contactMe', text:' ' },
          ]
        }),
        driverRight: new Person({
          x: utils.widthGrid(20),
          y: utils.widthGrid(36),
          src: '/media/characters/people/little-goblin-large-extended-right.png',
          behaviorLoop: [
            { who: 'driverRight', type: 'stand', direction: 'right', time: 3000},
            { who: 'driverRight', type: 'stand', direction: 'fifth-frame', time: 3000},
            { who: 'driverRight', type: 'stand', direction: 'right', time: 550},
            { who: 'driverRight', type: 'stand', direction: 'down', time: 50},
            { who: 'driverRight', type: 'stand', direction: 'sixth-frame', time: 3000},
            // { type: 'contactMe', text:' ' },
          ]
        }),
        backWheel: new Person({
          x: utils.widthGrid(6),
          y: utils.widthGrid(39),
          src: '/media/characters/people/back-wheel.png',
          behaviorLoop: [
            { who: 'backWheel', type: 'stand', direction: 'fifth-frame', time: 100},
            { who: 'backWheel', type: 'stand', direction: 'left', time: 100},
            { who: 'backWheel', type: 'stand', direction: 'up', time: 100},
            { who: 'backWheel', type: 'stand', direction: 'right', time: 100},
            { who: 'backWheel', type: 'stand', direction: 'down', time: 100},
            // { type: 'contactMe', text:' ' },
          ]
        }),
        frontWheel: new Person({
          x: utils.widthGrid(17),
          y: utils.widthGrid(39),
          src: '/media/characters/people/back-wheel.png',
          behaviorLoop: [
            { who: 'frontWheel', type: 'stand', direction: 'fifth-frame', time: 100},
            { who: 'frontWheel', type: 'stand', direction: 'left', time: 100},
            { who: 'frontWheel', type: 'stand', direction: 'up', time: 100},
            { who: 'frontWheel', type: 'stand', direction: 'right', time: 100},
            { who: 'frontWheel', type: 'stand', direction: 'down', time: 100},
            // { type: 'contactMe', text:' ' },
          ]
        })
      },
      walls: {
        //roof of ground
        [utils.asGridCoord(9,39)]: true,
        [utils.asGridCoord(10,39)]: true,
        [utils.asGridCoord(11,39)]: true,
        [utils.asGridCoord(12,39)]: true,
        [utils.asGridCoord(13,39)]: true,
        [utils.asGridCoord(14,39)]: true,
        [utils.asGridCoord(15,39)]: true,
        [utils.asGridCoord(16,39)]: true,
        [utils.asGridCoord(17,39)]: true,
        [utils.asGridCoord(18,39)]: true,
        [utils.asGridCoord(19,39)]: true,
        [utils.asGridCoord(20,39)]: true,
        [utils.asGridCoord(21,39)]: true,
        [utils.asGridCoord(22,39)]: true,
        [utils.asGridCoord(23,39)]: true,
        [utils.asGridCoord(24,39)]: true,
        [utils.asGridCoord(25,39)]: true,
        [utils.asGridCoord(26,39)]: true,
        [utils.asGridCoord(27,39)]: true,
        [utils.asGridCoord(28,39)]: true,
        [utils.asGridCoord(29,39)]: true,
        [utils.asGridCoord(30,39)]: true,
        [utils.asGridCoord(31,39)]: true,
        [utils.asGridCoord(32,39)]: true,
        [utils.asGridCoord(33,39)]: true,
        //walls of ground
        [utils.asGridCoord(8,40)]: true,
        [utils.asGridCoord(35,40)]: true,
        //floor of ground
        [utils.asGridCoord(8,41)]: true,
        [utils.asGridCoord(9,41)]: true,
        [utils.asGridCoord(10,41)]: true,
        [utils.asGridCoord(11,41)]: true,
        [utils.asGridCoord(12,41)]: true,
        [utils.asGridCoord(13,41)]: true,
        [utils.asGridCoord(14,41)]: true,
        [utils.asGridCoord(15,41)]: true,
        [utils.asGridCoord(16,41)]: true,
        [utils.asGridCoord(17,41)]: true,
        [utils.asGridCoord(18,41)]: true,
        [utils.asGridCoord(19,41)]: true,
        [utils.asGridCoord(20,41)]: true,
        [utils.asGridCoord(21,41)]: true,
        [utils.asGridCoord(22,41)]: true,
        [utils.asGridCoord(23,41)]: true,
        [utils.asGridCoord(24,41)]: true,
        [utils.asGridCoord(25,41)]: true,
        [utils.asGridCoord(26,41)]: true,
        [utils.asGridCoord(27,41)]: true,
        [utils.asGridCoord(28,41)]: true,
        [utils.asGridCoord(29,41)]: true,
        [utils.asGridCoord(30,41)]: true,
        [utils.asGridCoord(31,41)]: true,
        [utils.asGridCoord(32,41)]: true,
        [utils.asGridCoord(33,41)]: true,
        
        
        [utils.asGridCoord(14,40)]: true,
        [utils.asGridCoord(16,40)]: true,
      },
      cutsceneSpaces: {
        [utils.asGridCoord(34,40)]: [
          {
            events: [
              { type: 'textMessage', text:`You think about all of the awesome things you saw in Andrew's portfolio.` },
              { type: 'textMessage', text:`You should probably contact him.` },
              { who: 'hero', type: 'walk', direction: 'left'},
              { who: 'hero', type: 'walk', direction: 'left'},
              { who: 'hero', type: 'stand', direction: 'down'},
            ]
          }
        ],
        [utils.asGridCoord(15,40)]: [
          {
            events: [
              { type: 'changeMap', map: 'AboutMeMap'}
            ]
          }
        ]
      }
  },
    ConstructionMap: {
      lowerSrc: '/media/maps/pixle-portfolio-construction.png',
      upperSrc: '',
      hasContactForm: false,
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(24),
          y: utils.widthGrid(39),
        }),
        wizard: new Person({
          x: utils.widthGrid(9),
          y: utils.widthGrid(7),
          src: '/media/characters/people/wizard-large.png'
        })
      },
      walls: {
        //roof of ground
        [utils.asGridCoord(9,38)]: true,
        [utils.asGridCoord(10,38)]: true,
        [utils.asGridCoord(11,38)]: true,
        [utils.asGridCoord(12,38)]: true,
        [utils.asGridCoord(13,38)]: true,
        [utils.asGridCoord(14,38)]: true,
        [utils.asGridCoord(15,38)]: true,
        [utils.asGridCoord(16,38)]: true,
        [utils.asGridCoord(17,38)]: true,
        [utils.asGridCoord(18,38)]: true,
        [utils.asGridCoord(19,38)]: true,
        [utils.asGridCoord(20,38)]: true,
        [utils.asGridCoord(21,38)]: true,
        [utils.asGridCoord(22,38)]: true,
        [utils.asGridCoord(23,38)]: true,
        [utils.asGridCoord(24,38)]: true,
        [utils.asGridCoord(25,38)]: true,
        [utils.asGridCoord(26,38)]: true,
        [utils.asGridCoord(27,38)]: true,
        [utils.asGridCoord(28,38)]: true,
        [utils.asGridCoord(29,38)]: true,
        [utils.asGridCoord(30,38)]: true,
        [utils.asGridCoord(31,38)]: true,
        [utils.asGridCoord(32,38)]: true,
        [utils.asGridCoord(33,38)]: true,
        //walls of ground
        [utils.asGridCoord(11,39)]: true,
        [utils.asGridCoord(35,39)]: true,
        //floor of ground
        [utils.asGridCoord(8,40)]: true,
        [utils.asGridCoord(9,40)]: true,
        [utils.asGridCoord(10,40)]: true,
        [utils.asGridCoord(11,40)]: true,
        [utils.asGridCoord(12,40)]: true,
        [utils.asGridCoord(13,40)]: true,
        [utils.asGridCoord(14,40)]: true,
        [utils.asGridCoord(15,40)]: true,
        [utils.asGridCoord(16,40)]: true,
        [utils.asGridCoord(17,40)]: true,
        [utils.asGridCoord(18,40)]: true,
        [utils.asGridCoord(19,40)]: true,
        [utils.asGridCoord(20,40)]: true,
        [utils.asGridCoord(21,40)]: true,
        [utils.asGridCoord(22,40)]: true,
        [utils.asGridCoord(23,40)]: true,
        [utils.asGridCoord(24,40)]: true,
        [utils.asGridCoord(25,40)]: true,
        [utils.asGridCoord(26,40)]: true,
        [utils.asGridCoord(27,40)]: true,
        [utils.asGridCoord(28,40)]: true,
        [utils.asGridCoord(29,40)]: true,
        [utils.asGridCoord(30,40)]: true,
        [utils.asGridCoord(31,40)]: true,
        [utils.asGridCoord(32,40)]: true,
        [utils.asGridCoord(33,40)]: true,
      },
      cutsceneSpaces: {
        [utils.asGridCoord(24,39)]: [
          {
            events: [
              { type: 'changeMap', map: 'MainMap'}
            ]
          }
        ],
        [utils.asGridCoord(28,39)]: [
          {
            events: [
              { type: 'changeMap', map: 'SnakeMap'}
            ]
          }
        ],
        [utils.asGridCoord(14,39)]: [
          {
            events: [
              { type: 'changeMap', map: 'PlatformerMap'}
            ]
          }
        ],
        [utils.asGridCoord(12,39)]: [
          {
            events: [
              { type: 'textMessage', text:`There is nothing over here, yet.` },
              { type: 'textMessage', text:`But soon there will be games.` },
              { who: 'hero', type: 'walk', direction: 'right'},
              { who: 'hero', type: 'walk', direction: 'right'},
              { who: 'hero', type: 'stand', direction: 'down'},
            ]
          }
        ],
        [utils.asGridCoord(34,39)]: [
          {
            events: [
              { type: 'textMessage', text:`There is nothing over here, yet.` },
              { type: 'textMessage', text:`But soon there will be games.` },
              { who: 'hero', type: 'walk', direction: 'left'},
              { who: 'hero', type: 'walk', direction: 'left'},
              { who: 'hero', type: 'stand', direction: 'down'},
            ]
          }
        ],
      }
  },
    SnakeMap: {
      lowerSrc: '',
      upperSrc: '',
      hasContactForm: false,
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(24),
          y: utils.widthGrid(39),
        }),
      },
      walls: {
      },
      cutsceneSpaces: {
      }
  },
    PlatformerMap: {
      lowerSrc: '',
      upperSrc: '',
      hasContactForm: false,
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(24),
          y: utils.widthGrid(39),
        }),
      },
      walls: {
      },
      cutsceneSpaces: {
      }
  },
}