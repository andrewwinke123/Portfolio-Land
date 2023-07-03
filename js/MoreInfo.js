class MoreInfo {
  constructor({ text, onComplete }) {
    this.text = text
    this.onComplete = onComplete
    this.element = null
  }
  
  createElement() {
    //create element
    this.element = document.createElement('div')
    this.element.classList.add('moreInfo', 'infoBubble')
    
    this.element.innerHTML = (`
    <h3 class='MoreInfo_header'>MoreInfo:</h3>
    <p class='MoreInfo_categoryButtons'></p>
    <p class='MoreInfo_p'></p>
    <p>
    <i class="fa-solid fa-lightbulb">Wink Lighting</i>
</p>

    <button class='MoreInfo_button'>close</button>
    `)

    //init typerwriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.MoreInfo_p'),
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