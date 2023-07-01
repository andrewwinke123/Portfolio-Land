const audio = new Audio('/media/typing-short.mp3')


class OverworldMap {
  constructor(config) {
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
    this.isCutscenePlaying = restrictPlayerMovement;
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
    };
  
    const enterKeyListener = new KeyPressListener("Enter", actionListener);
    const spaceKeyListener = new KeyPressListener("Space", actionListener);
  
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
  
      const enterKeyListener = new KeyPressListener("Enter", actionListener);
      const spaceKeyListener = new KeyPressListener("Space", actionListener);
  
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
}

window.OverworldMaps = {
  MainMap: {
    lowerSrc: '/media/maps/pixle-portfolio.png',
    upperSrc: '',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.widthGrid(12),
        y: utils.widthGrid(9),
      }),
      headLeft: new Person({
        x: utils.widthGrid(23),
        y: utils.widthGrid(8),
        src: '/media/characters/people/head-left-character-sheet.png',
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
        behaviorLoop: [
          { who: 'astronaut', type: 'stand', direction: 'down', time: 2000},
            { who: 'astronaut', type: 'stand', direction: 'down', time: 1500},
            { who: 'astronaut', type: 'stand', direction: 'right', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'right', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'up', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'left', time: 250},
            { who: 'astronaut', type: 'stand', direction: 'right', time: 250},
        ]
      }),
      resetti: new Person({
        x: utils.widthGrid(20),
        y: utils.widthGrid(21),
        src: '/media/characters/people/resetti-sheet.png',
        behaviorLoop: [
            { who: 'resetti', type: 'stand', direction: 'right', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'up', time: 250},
            { who: 'resetti', type: 'stand', direction: 'left', time: 250},
            { who: 'resetti', type: 'stand', direction: 'right', time: 250},
            { who: 'resetti', type: 'stand', direction: 'down', time: 3000},
            { who: 'resetti', type: 'stand', direction: 'down', time: 2500},
        ]
      }),
      raccoon: new Person({
        x: utils.widthGrid(20),
        y: utils.widthGrid(16),
        src: '/media/characters/people/raccoon-window-sheet.png',
        behaviorLoop: [
            { who: 'raccoon', type: 'stand', direction: 'down', time: 2000},
            { who: 'raccoon', type: 'stand', direction: 'down', time: 2500},
            { who: 'raccoon', type: 'stand', direction: 'right', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'up', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'left', time: 250},
            { who: 'raccoon', type: 'stand', direction: 'right', time: 250},
        ]
      }),
      bard: new Person({
        x: utils.widthGrid(20),
        y: utils.widthGrid(26),
        src: '/media/characters/people/bards-quest-sheet.png',
        behaviorLoop: [
          { who: 'bard', type: 'stand', direction: 'down', time: 2000},
          { who: 'bard', type: 'stand', direction: 'right', time: 250},
          { who: 'bard', type: 'stand', direction: 'left', time: 1700},
          { who: 'bard', type: 'stand', direction: 'up', time: 1500},
          { who: 'bard', type: 'stand', direction: 'right', time: 250},
            { who: 'bard', type: 'stand', direction: 'down', time: 2500},
        ]
      }),
      wizard: new Person({
        x: utils.widthGrid(21),
        y: utils.widthGrid(39),
        src: '/media/characters/people/wizard-large.png',
        talking: [
          {
            events: [
              { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left.', faceHero: 'wizard' },
              { type: 'textMessage', text:'The About Me page is to the right.', faceHero: 'wizard' }
            ]
          }
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
      //walls of ground
      [utils.asGridCoord(11,39)]: true,
      [utils.asGridCoord(35,39)]: true,
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
    },
    cutsceneSpaces: {
      [utils.asGridCoord(16,15)]: [
        {
          events: [
            { type: 'textMessageEducation', text:`Hi, I'm Andrew Winkenwerder.` },
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
            { type: 'textMessage3', text:`Watch out!` },
            { type: 'textMessage3', text:`You almost fell over the edge there.` },
            { type: 'textMessage3', text:`Please back up.` },
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'walk', direction: 'right'},
            { who: 'hero', type: 'stand', direction: 'down'},
          ]
        }
      ],
      [utils.asGridCoord(31,9)]: [
        {
          events: [
            { type: 'textMessage3', text:`Watch out!` },
            { type: 'textMessage3', text:`You almost fell over the edge there.` },
            { type: 'textMessage3', text:`Please back up.` },
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
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.widthGrid(9),
        y: utils.widthGrid(40),
      }),
      andrewTruck: new Person({
        x: utils.widthGrid(15),
        y: utils.widthGrid(34),
        src: '/media/characters/people/andrew-truck-sheet.png',
      }),
      chest: new Person({
        x: utils.widthGrid(23),
        y: utils.widthGrid(37.5),
        src: '/media/characters/chest.png'
      }),
      chest2: new Person({
        x: utils.widthGrid(25),
        y: utils.widthGrid(37.5),
        src: '/media/characters/chest.png'
      }),
      chest3: new Person({
        x: utils.widthGrid(27),
        y: utils.widthGrid(37.5),
        src: '/media/characters/chest.png'
      }),
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
            [utils.asGridCoord(21,38)]: true,
            [utils.asGridCoord(22,38)]: true,
            [utils.asGridCoord(23,38)]: true,
            [utils.asGridCoord(24,38)]: true,
            [utils.asGridCoord(25,38)]: true,
            [utils.asGridCoord(26,38)]: true,
            [utils.asGridCoord(27,38)]: true,
            [utils.asGridCoord(28,38)]: true,
            [utils.asGridCoord(29,39)]: true,
            [utils.asGridCoord(30,39)]: true,
            [utils.asGridCoord(31,39)]: true,
            [utils.asGridCoord(32,39)]: true,
            [utils.asGridCoord(33,39)]: true,
            //walls of ground
            [utils.asGridCoord(8,40)]: true,
            [utils.asGridCoord(9,40)]: true,
            [utils.asGridCoord(34,40)]: true,
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
    },
    cutsceneSpaces: {
      [utils.asGridCoord(22,39)]: [
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
      [utils.asGridCoord(24,39)]: [
        {
          events: [
            { who: 'chest2', type: 'stand', direction: 'left', time: 500},
            { type: 'aboutMe', text:'Experience:       General Assembly' },
            { type: 'aboutMe', text:'Experience:       Wink Lighting.' },
            { type: 'aboutMe', text:'Experience:      CentralPiedmont Community College.' },
            { who: 'hero', type: 'stand', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(26,39)]: [
        {
          events: [
            { who: 'chest3', type: 'stand', direction: 'left', time: 500},
            { type: 'aboutMe', text:'Education:  I went to General Assembly for full-stack sofware engineering.' },
            { type: 'aboutMe', text:'     I also went to Central Piedmon Community College for graphic design and implimentation.' },
            { who: 'hero', type: 'stand', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(33,40)]: [
        {
          requiresEnter: false,
          events: [
            { type: 'changeMap', map: 'ContactMeMap'}
          ]
        }
      ],
      [utils.asGridCoord(9,40)]: [
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
      upperSrc: '',
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(9),
          y: utils.widthGrid(40),
        }),
        wizard: new Person({
          x: utils.widthGrid(9),
          y: utils.widthGrid(7),
          src: '/media/characters/people/wizard-large.png'
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
        [utils.asGridCoord(9,40)]: true,
        [utils.asGridCoord(33,40)]: true,
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
      },
      cutsceneSpaces: {
        [utils.asGridCoord(31,40)]: [
          {
            events: [
              { type: 'textMessage3', text:`You think about all of the awesome things you saw in Andrew's portfolio.` },
              { type: 'textMessage3', text:`You should probably contact him.` },
              { who: 'hero', type: 'walk', direction: 'left'},
              { who: 'hero', type: 'walk', direction: 'left'},
              { who: 'hero', type: 'stand', direction: 'down'},
            ]
          }
        ],
        [utils.asGridCoord(9,40)]: [
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
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(21),
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
        [utils.asGridCoord(8,39)]: true,
        [utils.asGridCoord(32,39)]: true,
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
        [utils.asGridCoord(21,39)]: [
          {
            events: [
              { type: 'changeMap', map: 'MainMap'}
            ]
          }
        ],
        [utils.asGridCoord(9,39)]: [
          {
            events: [
              { type: 'textMessage3', text:`There is nothing over here, yet.` },
              { type: 'textMessage3', text:`But soon there will be games.` },
              { who: 'hero', type: 'walk', direction: 'right'},
              { who: 'hero', type: 'walk', direction: 'right'},
              { who: 'hero', type: 'stand', direction: 'down'},
            ]
          }
        ],
        [utils.asGridCoord(31,39)]: [
          {
            events: [
              { type: 'textMessage3', text:`There is nothing over here, yet.` },
              { type: 'textMessage3', text:`But soon there will be games.` },
              { who: 'hero', type: 'walk', direction: 'left'},
              { who: 'hero', type: 'walk', direction: 'left'},
              { who: 'hero', type: 'stand', direction: 'down'},
            ]
          }
        ],
      }
  },
}