class Education {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null

    // New variable to track the currently open description
    this.openDescription = null
    this.openIcon = null
  }

  createElement() {
    // Create element
    this.element = document.createElement('div')
    this.element.classList.add('Education', 'eduBubble')

    this.element.innerHTML = (`
    <h3 class='Experience_header'>Education:</h3>
    <p class='Education_p'></p>
    <button class='Education_button' id='educationButton'>close</button>
    <div class="edu-container">
        <div class="edu-item">
            <i class="fa-regular fa-floppy-disk">General Assembly</i>
            <p class="description ga-description" style="display: none">General Assembly | Software Engineering Immersive Fellow | Remote
            Completed 420+ hours of instruction in JavaScript, Python, MongoDB, Node, React, and other tools</p>
        </div>
        <div class="edu-item">
            <i class="fa-solid fa-paint-roller"> CPCC</i>
            <p class="description cp-description" style="display: none">Learned prepress and post-press SOP for flexography and screen printing, using tools from the Adobe suite including Illustrator, Photoshop, Indesign, and more.</p>
        </div>
    </div>
`)

    const gaIcon = this.element.querySelector('.fa-floppy-disk')
    const cpIcon = this.element.querySelector('.fa-paint-roller')
    const gaDescription = this.element.querySelector('.ga-description')
    const cpDescription = this.element.querySelector('.cp-description')

    gaIcon.addEventListener('click', () => {
      this.toggleDescription(gaDescription, gaIcon)
    })

    cpIcon.addEventListener('click', () => {
      this.toggleDescription(cpDescription, cpIcon)
    })

    // Initialize typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.Education_p'),
      text: this.text
    })

    this.element.querySelector('button').addEventListener('click', () => {
      // Close the text message
      this.done()
    })

    this.actionListener = new KeyPressListener('Enter', () => {
      this.done()
    })
    this.actionListener = new KeyPressListener('Space', () => {
      this.done()
    })
  }

  toggleDescription(description, icon) {
    if (this.openDescription) {
      // If a description is currently open, close it
      this.openDescription.style.display = 'none'
      this.openIcon.style.display = 'block'
    }

    if (this.openDescription === description) {
      // If the clicked item is already open, we're done
      this.openDescription = null
      this.openIcon = null
    } else {
      // Otherwise, open the clicked item and update openDescription
      description.style.display = 'block'
      icon.style.display = 'none'
      this.openDescription = description
      this.openIcon = icon
    }
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
  }
}
