class Suggestion {
	constructor({ text, onComplete }) {
		this.text = text
		this.onComplete = onComplete
		this.element = null
	}
  
	createElement() {
		this.element = document.createElement('div')
		this.element.classList.add('Suggestion', 'suggestionBubble')
    
		this.element.innerHTML = (`
			<p class='Suggestion_p'></p>
			<a href="https://suggestions-board.fly.dev/" target="_blank" class="info-link">
				Suggestion Board
				<div class="tooltip">
					<img src="media/portfolio/work-3.png" alt="website">
				</div>
			</a>
			<br></br>

			<div class="techLogo">
				<h3 class='Suggestion_header'>Tools:</h3>
				<p>
					<img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
					<img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
					<img class="tech-badge" data-category="languages" src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
					<img class="tech-badge" data-category="frameworks" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js">
					<img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM">
					<img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS">
					<img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git">
					<img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7" alt="Netlify">
					<img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/adobe%20photoshop-%2331A8FF.svg?style=for-the-badge&logo=adobe%20photoshop&logoColor=white" alt="Adobe Photoshop">
					<img class="tech-badge" data-category="tools" src="https://img.shields.io/badge/adobe%20illustrator-%23FF9A00.svg?style=for-the-badge&logo=adobe%20illustrator&logoColor=white" alt="Adobe Illustrator">
					<img class="tech-badge" data-category="databases" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white">
				</p>
			</div>
			<div class="infoDump">
				<p>
					A Simple online suggestion posting board.
				</p>
			</div>

			<button class='Suggestion_button'>close</button>
		`)

		const badges = this.element.querySelectorAll('.tech-badge')
		this.badges = Array.from(badges)

		const words = this.text.split(' ')
		const firstWord = words.shift()
		const restOfText = words.join(' ')
    
		this.revealingText = new RevealingText({
			element: this.element.querySelector('.Suggestion_p'),
			text:`${firstWord}${restOfText}`
		})
    
		this.element.querySelector('.Suggestion_button').addEventListener('click', () => {
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
