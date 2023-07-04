class Bard {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('Bard', 'bardBubble')
    
    this.element.innerHTML = (`
    <h3 class='Bard_header'>Bard:</h3>
    <p class='Bard_categoryButtons'></p>
    <p class='Bard_p'></p>
    <a href="https://bards-quest.netlify.app/" target="_blank">Bard</a>

    <button class='Bard_button'>close</button>
    `)

    //init typerwriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.Bard_p'),
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