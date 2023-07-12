class AboutMe {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('AboutMe', 'bubble')
    
    this.element.innerHTML = (`
    <h3 class='AboutMe_header'>Skills:</h3>
    <p class='AboutMe_categoryButtons'></p>
    <p class='AboutMe_p'></p>
    <p>
    <div class="badge-wrapper">
    <img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
    <img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
    <img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
    <img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python">
    <img class="tech-badge" data-category="frameworks" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
    <img class="tech-badge" data-category="frameworks" src="https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white" alt="Django">
    <img class="tech-badge" data-category="frameworks" src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img class="tech-badge" data-category="frameworks" src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router">
    <img class="tech-badge" data-category="frameworks" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git">
    <img class="tech-badge" data-category="databases" data-category="tools" src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white" alt="Heroku">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7" alt="Netlify">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white" alt="Microsoft Excel">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/adobe%20photoshop-%2331A8FF.svg?style=for-the-badge&logo=adobe%20photoshop&logoColor=white" alt="Adobe Photoshop">
    <img class="tech-badge"data-category="tools" src="https://img.shields.io/badge/adobe%20illustrator-%23FF9A00.svg?style=for-the-badge&logo=adobe%20illustrator&logoColor=white" alt="Adobe Illustrator">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/Adobe%20After%20Effects-9999FF.svg?style=for-the-badge&logo=Adobe%20After%20Effects&logoColor=white" alt="Adobe After Effects">
    <img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/Adobe%20InDesign-49021F?style=for-the-badge&logo=adobeindesign&logoColor=white" alt="Adobe InDesign">
    <img class="tech-badge" data-category="databases" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white">
    <img class="tech-badge" data-category="databases" src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
    <img class="tech-badge" data-category="databases" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
    </div>
</p>

    <button class='AboutMe_button'>close</button>
  `)

  const badges = this.element.querySelectorAll('.tech-badge')
    this.badges = Array.from(badges)

    // Create category buttons
    const categories = ['Languages', 'Frameworks', 'Databases', 'Tools', 'All']
const categoryButtons = categories.map(category => {
  const button = document.createElement('button')
  button.classList.add('category-button')
  button.innerText = category
  button.addEventListener('click', () => this.filterBadges(category.toLowerCase()))
  return button
})

// Append the category buttons to the 'AboutMe_categoryButtons' element
const categoryButtonsContainer = this.element.querySelector('.AboutMe_categoryButtons')
categoryButtons.forEach(button => categoryButtonsContainer.appendChild(button))



    //init typerwriter effect
    const words = this.text.split(' ')
    const firstWord = words.shift()
    const restOfText = words.join(' ')
    
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.AboutMe_p'),
      text:`${firstWord}${restOfText}`
    })
    

    this.element.querySelector('.AboutMe_button').addEventListener('click', () => {
      //close the text message
      this.done()
    })

    document.addEventListener('click', (event) => {
			// Ignore clicks on the element itself
			if (!this.element.contains(event.target)) {
				this.done()
			}
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