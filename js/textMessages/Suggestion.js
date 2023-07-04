class Suggestion {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('Suggestion', 'suggestionBubble')
    
    this.element.innerHTML = (`
    <h3 class='Suggestion_header'>Suggestion:</h3>
    <p class='Suggestion_categoryButtons'></p>
    <p class='Suggestion_p'></p>
    <a href="https://suggestions-board.fly.dev/" target="_blank">Suggestion</a>

    <button class='Suggestion_button'>close</button>
    `)

    //init typerwriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.Suggestion_p'),
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