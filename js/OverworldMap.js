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
      }, 200)
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
    lowerSrc: '/img/maps/pixle-portfolio.png',
    upperSrc: '/img/maps/pixle-portfolio-upper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.widthGrid(16),
        y: utils.widthGrid(10),
      }),
      wizard: new Person({
        x: utils.widthGrid(21),
        y: utils.widthGrid(40),
        src: '/img/characters/people/wizard.png'
      })
    },
    walls: {
      [utils.asGridCoord(10,7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(23,40)]: [
        {
          requiresEnter: true,
          events: [
            { who: 'wizard', type: 'stand', direction: 'right', time: 500},
            { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.' },
            { who: 'hero', type: 'walk', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(22,40)]: [
        {
          requiresEnter: true,
          events: [
            { who: 'wizard', type: 'stand', direction: 'left', time: 500},
            { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.' },
            { who: 'hero', type: 'walk', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(21,40)]: [
        {
          requiresEnter: true,
          events: [
            { who: 'wizard', type: 'stand', direction: 'left', time: 500},
            { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.' },
            { who: 'hero', type: 'walk', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(20,40)]: [
        {
          requiresEnter: true,
          events: [
            { who: 'wizard', type: 'stand', direction: 'left', time: 500},
            { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.' },
            { who: 'hero', type: 'walk', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(34,40)]: [
        {
          events: [
            { type: 'changeMap', map: 'AboutMeMap'}
          ]
        }
      ],
      [utils.asGridCoord(12,40)]: [
        {
          events: [
            { type: 'changeMap', map: 'ConstructionMap'}
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
        x: utils.widthGrid(9),
        y: utils.widthGrid(41),
      }),
      wizard: new Person({
        x: utils.widthGrid(7),
        y: utils.widthGrid(22),
        src: '/img/characters/people/wizard.png'
      }),
      chest: new Person({
        x: utils.widthGrid(21),
        y: utils.widthGrid(40.5),
        src: '/img/characters/chest.png'
      }),
      chest2: new Person({
        x: utils.widthGrid(25),
        y: utils.widthGrid(40.5),
        src: '/img/characters/chest.png'
      }),
      chest3: new Person({
        x: utils.widthGrid(29),
        y: utils.widthGrid(40.5),
        src: '/img/characters/chest.png'
      }),
    },
    walls: {
      [utils.asGridCoord(10,7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(21,41)]: [
        {
          requiresEnter: true,
          events: [
            { who: 'chest', type: 'stand', direction: 'right', time: 500},
            { type: 'textMessage', text:'hey, watch out' },
            { who: 'hero', type: 'walk', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(25,41)]: [
        {
          requiresEnter: true,
          events: [
            { who: 'chest2', type: 'stand', direction: 'right', time: 500},
            { type: 'textMessage', text:'hey, watch out' },
            { who: 'hero', type: 'walk', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(29,41)]: [
        {
          requiresEnter: true,
          events: [
            { who: 'chest3', type: 'stand', direction: 'right', time: 500},
            { type: 'textMessage', text:'hey, watch out' },
            { who: 'hero', type: 'walk', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(33,41)]: [
        {
          requiresEnter: false,
          events: [
            { type: 'changeMap', map: 'ContactMeMap'}
          ]
        }
      ],
      [utils.asGridCoord(9,41)]: [
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
      lowerSrc: '/img/maps/pixle-portfolio-page-3.png',
      upperSrc: '',
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(9),
          y: utils.widthGrid(41),
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
        [utils.asGridCoord(9,41)]: [
          {
            events: [
              { type: 'changeMap', map: 'AboutMeMap'}
            ]
          }
        ]
      }
  },
    ConstructionMap: {
      lowerSrc: '/img/maps/pixle-portfolio-construction.png',
      upperSrc: '',
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.widthGrid(22),
          y: utils.widthGrid(40),
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
        [utils.asGridCoord(22,40)]: [
          {
            events: [
              { type: 'changeMap', map: 'MainMap'}
            ]
          }
        ]
      }
  },
}