class LaunchTracker {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('LaunchTracker', 'launchBubble')
    
    this.element.innerHTML = (`
    <p class='LaunchTracker_p'></p>
    <a href="https://launch-tracker.fly.dev/" target="_blank">Launch Tracker</a>
    <br></br>
    <h3 class='LaunchTracker_header'>Tools:</h3>
    <p>
    <img class="tech-badge" data-category="frameworks" src="https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white" alt="Django">
    <img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python">
    <img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
    <img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git">
    <img class="tech-badge" data-category="databases" data-category="tools" src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white" alt="Heroku">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/adobe%20photoshop-%2331A8FF.svg?style=for-the-badge&logo=adobe%20photoshop&logoColor=white" alt="Adobe Photoshop">
    <img class="tech-badge"data-category="tools" src="https://img.shields.io/badge/adobe%20illustrator-%23FF9A00.svg?style=for-the-badge&logo=adobe%20illustrator&logoColor=white" alt="Adobe Illustrator">
    <img class="tech-badge" data-category="databases" src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
</p>

    <button class='LaunchTracker_button'>close</button>
  `)

  const badges = this.element.querySelectorAll('.tech-badge')
    this.badges = Array.from(badges)



    //init typerwriter effect
    const words = this.text.split(' ')
    const firstWord = words.shift()
    const restOfText = words.join(' ')
    
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.LaunchTracker_p'),
      text:`${firstWord}${restOfText}`
    })
    

    this.element.querySelector('.LaunchTracker_button').addEventListener('click', () => {
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