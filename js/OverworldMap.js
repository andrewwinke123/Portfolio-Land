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
    lowerSrc: '/img/maps/pixle-portfolio-test.png',
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
        src: '/img/characters/people/wizard.png',
        talking: [
          {
            events: [
              { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.', faceHero: 'wizard' }
            ]
          }
        ]
      }),
      // andrew: new Person({
      //   x: utils.widthGrid(14),
      //   y: utils.widthGrid(15),
      //   src: '/img/characters/hi-andrew.png',
      //   frameWidth: 120,
      //   frameHeight: 120,
      //   behaviorLoop: [
      //     { type: 'walk', direction: 'up'},
      //     { type: 'walk', direction: 'up'},
      //     { type: 'walk', direction: 'up'},
      //     { type: 'walk', direction: 'up'},
      //     { type: 'walk', direction: 'up'},
      //     { type: 'walk', direction: 'up'},
      //     { type: 'walk', direction: 'up'},
      //     { type: 'walk', direction: 'up'},
      //     { type: 'walk', direction: 'up'},
      //     { type: 'stand', direction: 'down', time: 5000000},
      //   ],
      // })
    },
    //roof of roof
    walls: {
      [utils.asGridCoord(11,9)]: true,
      [utils.asGridCoord(12,9)]: true,
      [utils.asGridCoord(13,9)]: true,
      [utils.asGridCoord(14,9)]: true,
      [utils.asGridCoord(15,9)]: true,
      [utils.asGridCoord(16,9)]: true,
      [utils.asGridCoord(17,9)]: true,
      [utils.asGridCoord(18,9)]: true,
      [utils.asGridCoord(19,9)]: true,
      [utils.asGridCoord(20,9)]: true,
      [utils.asGridCoord(21,9)]: true,
      [utils.asGridCoord(22,9)]: true,
      [utils.asGridCoord(23,9)]: true,
      [utils.asGridCoord(24,9)]: true,
      [utils.asGridCoord(25,9)]: true,
      [utils.asGridCoord(26,9)]: true,
      [utils.asGridCoord(27,9)]: true,
      [utils.asGridCoord(28,9)]: true,
      [utils.asGridCoord(29,9)]: true,
      [utils.asGridCoord(30,9)]: true,
      [utils.asGridCoord(31,9)]: true,
      [utils.asGridCoord(32,9)]: true,
      //walls of roof
      [utils.asGridCoord(10,10)]: true,
      [utils.asGridCoord(33,10)]: true,
      //floor of roof
      [utils.asGridCoord(11,11)]: true,
      [utils.asGridCoord(12,11)]: true,
      [utils.asGridCoord(13,11)]: true,
      [utils.asGridCoord(14,11)]: true,
      [utils.asGridCoord(15,11)]: true,
      [utils.asGridCoord(16,11)]: true,
      [utils.asGridCoord(17,11)]: true,
      [utils.asGridCoord(18,11)]: true,
      [utils.asGridCoord(19,11)]: true,
      [utils.asGridCoord(20,11)]: true,
      [utils.asGridCoord(21,11)]: true,
      [utils.asGridCoord(22,11)]: true,
      [utils.asGridCoord(23,11)]: true,
      [utils.asGridCoord(24,11)]: true,
      [utils.asGridCoord(25,11)]: true,
      [utils.asGridCoord(26,11)]: true,
      [utils.asGridCoord(27,11)]: true,
      [utils.asGridCoord(29,11)]: true,
      [utils.asGridCoord(30,11)]: true,
      [utils.asGridCoord(31,11)]: true,
      [utils.asGridCoord(32,11)]: true,
      //roof of ground
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
      [utils.asGridCoord(29,39)]: true,
      [utils.asGridCoord(30,39)]: true,
      [utils.asGridCoord(31,39)]: true,
      [utils.asGridCoord(32,39)]: true,
      //walls of ground
      [utils.asGridCoord(12,40)]: true,
      [utils.asGridCoord(35,40)]: true,
      //floor of ground
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
    },
    cutsceneSpaces: {
      // [utils.asGridCoord(23,40)]: [
      //   {
      //     requiresEnter: true,
      //     events: [
      //       { who: 'wizard', type: 'stand', direction: 'right', time: 500},
      //       { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.' },
      //       { who: 'hero', type: 'walk', direction: 'right'},
      //     ]
      //   }
      // ],
      // [utils.asGridCoord(22,40)]: [
      //   {
      //     requiresEnter: true,
      //     events: [
      //       { who: 'wizard', type: 'stand', direction: 'left', time: 500},
      //       { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.' },
      //       { who: 'hero', type: 'walk', direction: 'right'},
      //     ]
      //   }
      // ],
      // [utils.asGridCoord(21,40)]: [
      //   {
      //     requiresEnter: true,
      //     events: [
      //       { who: 'wizard', type: 'stand', direction: 'left', time: 500},
      //       { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.' },
      //       { who: 'hero', type: 'walk', direction: 'right'},
      //     ]
      //   }
      // ],
      // [utils.asGridCoord(20,40)]: [
      //   {
      //     requiresEnter: true,
      //     events: [
      //       { who: 'wizard', type: 'stand', direction: 'left', time: 500},
      //       { type: 'textMessage', text:'Welcome traveler! Ye old game shack is to the left. The About Me page is to the right.' },
      //       { who: 'hero', type: 'walk', direction: 'right'},
      //     ]
      //   }
      // ],
      [utils.asGridCoord(34,40)]: [
        {
          events: [
            { type: 'changeMap', map: 'AboutMeMap'}
          ]
        }
      ],
      [utils.asGridCoord(13,40)]: [
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
        x: utils.widthGrid(23),
        y: utils.widthGrid(39.5),
        src: '/img/characters/chest.png'
      }),
      chest2: new Person({
        x: utils.widthGrid(25),
        y: utils.widthGrid(39.5),
        src: '/img/characters/chest.png'
      }),
      chest3: new Person({
        x: utils.widthGrid(27),
        y: utils.widthGrid(39.5),
        src: '/img/characters/chest.png'
      }),
    },
    walls: {
            //roof of ground
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
            [utils.asGridCoord(21,39)]: true,
            [utils.asGridCoord(22,39)]: true,
            [utils.asGridCoord(23,39)]: true,
            [utils.asGridCoord(24,39)]: true,
            [utils.asGridCoord(25,39)]: true,
            [utils.asGridCoord(26,39)]: true,
            [utils.asGridCoord(27,39)]: true,
            [utils.asGridCoord(28,39)]: true,
            [utils.asGridCoord(29,40)]: true,
            [utils.asGridCoord(30,40)]: true,
            [utils.asGridCoord(31,40)]: true,
            [utils.asGridCoord(32,40)]: true,
            [utils.asGridCoord(33,40)]: true,
            //walls of ground
            [utils.asGridCoord(8,41)]: true,
            [utils.asGridCoord(9,41)]: true,
            [utils.asGridCoord(34,41)]: true,
            //floor of ground
            [utils.asGridCoord(8,42)]: true,
            [utils.asGridCoord(9,42)]: true,
            [utils.asGridCoord(10,42)]: true,
            [utils.asGridCoord(11,42)]: true,
            [utils.asGridCoord(12,42)]: true,
            [utils.asGridCoord(13,42)]: true,
            [utils.asGridCoord(14,42)]: true,
            [utils.asGridCoord(15,42)]: true,
            [utils.asGridCoord(16,42)]: true,
            [utils.asGridCoord(17,42)]: true,
            [utils.asGridCoord(18,42)]: true,
            [utils.asGridCoord(19,42)]: true,
            [utils.asGridCoord(20,42)]: true,
            [utils.asGridCoord(21,42)]: true,
            [utils.asGridCoord(22,42)]: true,
            [utils.asGridCoord(23,42)]: true,
            [utils.asGridCoord(24,42)]: true,
            [utils.asGridCoord(25,42)]: true,
            [utils.asGridCoord(26,42)]: true,
            [utils.asGridCoord(27,42)]: true,
            [utils.asGridCoord(28,42)]: true,
            [utils.asGridCoord(29,42)]: true,
            [utils.asGridCoord(30,42)]: true,
            [utils.asGridCoord(31,42)]: true,
            [utils.asGridCoord(32,42)]: true,
            [utils.asGridCoord(33,42)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(23,40)]: [
        {
          events: [
            { who: 'chest', type: 'stand', direction: 'right', time: 500},
            { type: 'textMessage2', text:'Skills: React, Node.js, Express.js, MongoDB, Django, Python, Graphic Design, Adobe Suite.' },
            { who: 'hero', type: 'stand', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(25,40)]: [
        {
          events: [
            { who: 'chest2', type: 'stand', direction: 'right', time: 500},
            { type: 'textMessage2', text:'Experience: General Assembly, Wink Lighting, CentralPiedmont Community College.' },
            { who: 'hero', type: 'stand', direction: 'right'},
          ]
        }
      ],
      [utils.asGridCoord(27,40)]: [
        {
          events: [
            { who: 'chest3', type: 'stand', direction: 'right', time: 500},
            { type: 'textMessage2', text:'Education: General Assembly, Central Piedmon Community College.' },
            { who: 'hero', type: 'stand', direction: 'right'},
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
        //roof of ground
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
        //walls of ground
        [utils.asGridCoord(8,41)]: true,
        [utils.asGridCoord(9,41)]: true,
        [utils.asGridCoord(33,41)]: true,
        //floor of ground
        [utils.asGridCoord(8,42)]: true,
        [utils.asGridCoord(9,42)]: true,
        [utils.asGridCoord(10,42)]: true,
        [utils.asGridCoord(11,42)]: true,
        [utils.asGridCoord(12,42)]: true,
        [utils.asGridCoord(13,42)]: true,
        [utils.asGridCoord(14,42)]: true,
        [utils.asGridCoord(15,42)]: true,
        [utils.asGridCoord(16,42)]: true,
        [utils.asGridCoord(17,42)]: true,
        [utils.asGridCoord(18,42)]: true,
        [utils.asGridCoord(19,42)]: true,
        [utils.asGridCoord(20,42)]: true,
        [utils.asGridCoord(21,42)]: true,
        [utils.asGridCoord(22,42)]: true,
        [utils.asGridCoord(23,42)]: true,
        [utils.asGridCoord(24,42)]: true,
        [utils.asGridCoord(25,42)]: true,
        [utils.asGridCoord(26,42)]: true,
        [utils.asGridCoord(27,42)]: true,
        [utils.asGridCoord(28,42)]: true,
        [utils.asGridCoord(29,42)]: true,
        [utils.asGridCoord(30,42)]: true,
        [utils.asGridCoord(31,42)]: true,
        [utils.asGridCoord(32,42)]: true,
        [utils.asGridCoord(33,42)]: true,
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