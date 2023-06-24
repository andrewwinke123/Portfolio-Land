class TextMessage2 {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('TextMessage2')
    
    this.element.innerHTML = (`
      <p class='TextMessage2_p'></p>
      <button class='TextMessage2_button'>close</button>
    `)

    //init typerwriter effect
    const words = this.text.split(' ')
    const firstWord = words.shift()
    const restOfText = words.join(' ')
    
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.TextMessage2_p'),
      text:`${firstWord}${restOfText}`
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