class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('TextMessage')
    
    this.element.innerHTML = (`
      <p class='TextMessage_p'></p>
      <button class='TextMessage_button'>Next</button>
    `)

    //init typerwriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.TextMessage_p'),
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
    audio.play()

    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
  }, 1500)
  }
}