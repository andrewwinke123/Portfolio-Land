class ContactMe {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('ContactMe', 'contactBubble')
    
    this.element.innerHTML = (`
    <h3 class='ContactMe_header'>Contact Andrew using the form on his work van!</h3>
    <p class='ContactMe_p'></p>
    <button class='ContactMe_button' id='ContactMeButton'>close</button>
    <div class="contact-container">
    </div>
    `)

    //init typerwriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.ContactMe_p'),
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