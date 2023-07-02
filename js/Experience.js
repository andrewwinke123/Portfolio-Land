class Experience {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  

  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('Experience', 'exBubble')
    
    this.element.innerHTML = (`
    <h3 class='Experience_header'>Experience:</h3>
    <p class='Experience_categoryButtons'></p>
    <p class='Experience_p'></p>
    <p>
    <i class="fa-solid fa-lightbulb">Wink Lighting</i>
    <i class="fa-regular fa-floppy-disk">General Assembly</i>
    <i class="fa-solid fa-paint-roller">Central Piedmont</i>
</p>

    <button class='Experience_button'>close</button>
  `)

  const icons = this.element.querySelectorAll('i')
  icons.forEach(icon => {
    icon.addEventListener('click', (event) => {
      const infoCard = document.createElement('div')
      infoCard.innerText = `Information about ${event.target.textContent}`
      infoCard.classList.add('info-card')
      this.element.appendChild(infoCard)
    })
  })

  const badges = this.element.querySelectorAll('.tech-badge')
    this.badges = Array.from(badges)




    //init typerwriter effect
    const words = this.text.split(' ')
    const firstWord = words.shift()
    const restOfText = words.join(' ')
    
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.Experience_p'),
      text:`${firstWord}${restOfText}`
    })
    

    this.element.querySelector('.Experience_button').addEventListener('click', () => {
      //close the text message
      this.done()
    })

    this.actionListener = new KeyPressListener('Enter', () => {
      this.done()
    })
    this.actionListener = new KeyPressListener('Space', () => {
      this.done()
    })
  }

  filterBadges(category) {
    this.badges.forEach(badge => {
      if (category === 'all' || badge.dataset.category === category) {
        badge.style.display = 'inline'
      } else {
        badge.style.display = 'none'
      }
    })
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove()
      this.actionListener.unbind()
      this.onComplete()
    } else {
      this.revealingText.warpToDone()
    }
  }
  
  init(container) {
    this.createElement()
    container.appendChild(this.element)
    this.revealingText.init()
    this.filterBadges('all')

  }
}