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
      //in the future: determine if object should mount
      object.mount(this)
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true
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
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepsCutscene() {
    const hero = this.gameObjects['hero']
    const match = this.cutsceneSpaces[ `${hero.x}, ${hero.y}` ]
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
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
    lowerSrc: '/img/maps/pixle-portfolio.png',
    upperSrc: '',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.widthGrid(5),
        y: utils.widthGrid(6),
      }),
      wizard: new Person({
        x: utils.widthGrid(7),
        y: utils.widthGrid(7),
        src: '/img/characters/people/wizard.png'
      })
    },
    walls: {
      [utils.asGridCoord(10,7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6,6)]: [
        {
          events: [


            { who: 'wizard', type: 'walk', direction: 'right'},
            { who: 'wizard', type: 'stand', direction: 'down', time: 500},
            { type: 'textMessage', text:'hey, watch out' },
            { who: 'wizard', type: 'walk', direction: 'up'},

            { who: 'hero', type: 'walk', direction: 'down'},
            { who: 'hero', type: 'walk', direction: 'left'},
          ]
        }
      ],
      [utils.asGridCoord(25,35)]: [
        {
          events: [
            { type: 'changeMap', map: 'AboutMeMap'}
          ]
        }
      ]
    }
  },
  AboutMeMap: {
    lowerSrc: '/img/maps/pixle-portfolio-page-2.png',
    upperSrc: '',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.widthGrid(-1),
        y: utils.widthGrid(22),
      }),
      wizard: new Person({
        x: utils.widthGrid(7),
        y: utils.widthGrid(22),
        src: '/img/characters/people/wizard.png'
      })
    },
    walls: {
      [utils.asGridCoord(10,7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6,6)]: [
        {
          events: [


            { who: 'wizard', type: 'walk', direction: 'right'},
            { who: 'wizard', type: 'stand', direction: 'down', time: 500},
            { type: 'textMessage', text:'hey, watch out' },
            { who: 'wizard', type: 'walk', direction: 'up'},

            { who: 'hero', type: 'walk', direction: 'down'},
            { who: 'hero', type: 'walk', direction: 'left'},
          ]
        }
      ],
      [utils.asGridCoord(24,22)]: [
        {
          events: [
            { type: 'changeMap', map: 'ContactMeMap'}
          ]
        }
      ],
      [utils.asGridCoord(-2,22)]: [
        {
          events: [
            { type: 'changeMap', map: 'MainMap'}
          ]
        }
      ]
    },
    },
    ContactMeMap: {
      lowerSrc: '/img/maps/pixle-portfolio-page-3.png',
      upperSrc: '',
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(0),
          y: utils.widthGrid(20),
        }),
        wizard: new Person({
          x: utils.widthGrid(9),
          y: utils.widthGrid(7),
          src: '/img/characters/people/wizard.png'
        })
      },
      walls: {
        [utils.asGridCoord(10,7)]: true,
      },
      cutsceneSpaces: {
        [utils.asGridCoord(6,6)]: [
          {
            events: [
  
  
              { who: 'wizard', type: 'walk', direction: 'right'},
              { who: 'wizard', type: 'stand', direction: 'down', time: 500},
              { type: 'textMessage', text:'hey, watch out' },
              { who: 'wizard', type: 'walk', direction: 'up'},
  
              { who: 'hero', type: 'walk', direction: 'down'},
              { who: 'hero', type: 'walk', direction: 'left'},
            ]
          }
        ],
        [utils.asGridCoord(0,20)]: [
          {
            events: [
              { type: 'changeMap', map: 'AboutMeMap'}
            ]
          }
        ]
      }
  },
}