class RevealingText {
  constructor(config) {
    this.element = config.element
    this.text = config.text
    this.speed = config.speed || 40

    this.timeout = null
    this.isDone = false
  }

  revealOneCharacter(list) {
    const next = list.splice(0,1)[0]
    // Add a check for undefined here
    if (!next) {
      this.isDone = true
      return
    }
    next.span.classList.add('revealed')
  
    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list)
      }, next.delayAfter)
    } else {
      this.isDone = true
    }
  }
  

    warpToDone() {
      clearTimeout(this.timeout)
      this.isDone = true
      this.element.querySelectorAll('span').forEach(s => {
        s.classList.add('revealed')
      })
    }


    init() {
      let characters = []
      let isFirstWord = true // Flag for the first word
      this.text.split('').forEach(character => {
        let span = document.createElement('span')
        if (isFirstWord) {
          span.classList.add('first-word')
        }
        if (character === ' ') {
          isFirstWord = false // Once we hit a space, the first word is done
        }
        span.textContent = character
        this.element.appendChild(span)
        characters.push({
          span,
          delayAfter: character === ' ' ? 0 : this.speed,
        })
      })
    
      this.revealOneCharacter(characters)
    }
    
}