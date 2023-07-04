class Education {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('Education', 'eduBubble')
    
    this.element.innerHTML = (`
    <h3 class='Experience_header'>Education:</h3>
    <p class='Education_p'></p>
    <button class='Education_button' id='educationButton'>close</button>
    <div class="edu-container">
        <div class="edu-item">
            <i class="fa-regular fa-floppy-disk"></i>
            <p class="description ga-description" style="display: none">General Assembly Description</p>
        </div>
        <div class="edu-item">
            <i class="fa-solid fa-paint-roller"></i>
            <p class="description cp-description" style="display: none">Central Piedmont Description</p>
        </div>
    </div>
`)

const gaIcon = this.element.querySelector('.fa-floppy-disk')
    const cpIcon = this.element.querySelector('.fa-paint-roller')
    const gaDescription = this.element.querySelector('.ga-description')
    const cpDescription = this.element.querySelector('.cp-description')

    gaIcon.addEventListener('click', () => {
      const isDescriptionVisible = gaDescription.style.display === 'block'
      gaDescription.style.display = isDescriptionVisible ? 'none' : 'block'
      gaIcon.style.display = isDescriptionVisible ? 'block' : 'none'
    })

    cpIcon.addEventListener('click', () => {
      const isDescriptionVisible = cpDescription.style.display === 'block'
      cpDescription.style.display = isDescriptionVisible ? 'none' : 'block'
      cpIcon.style.display = isDescriptionVisible ? 'block' : 'none'
    })

    //init typerwriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.Education_p'),
      text: this.text
    })

    this.element.querySelector('button').addEventListener('click', () => {
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