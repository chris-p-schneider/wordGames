///////////////////////////////////////////////////////////////
// Word search generator
///////////////////////////////////////////////////////////////

// CONSTANTS --------------------------------------------------

const CONTAINER   = document.querySelector('#ws-container');
const WORDS       = document.querySelector('#ws-words');
const ROWS        = document.querySelector('#ws-rows');
const COLS        = document.querySelector('#ws-columns');
const DESCRIPTION = document.querySelector('#ws-type-description');
const DESC        = 'Select a method for the filler letters.';
const TYPE        = document.querySelector('#ws-type');
const BUTTON      = document.querySelector('#ws-button');

BUTTON.addEventListener('click', generateWordsearch);
TYPE.addEventListener('input', showTypeDescription);

///////////////////////////////////////////////////////////////
// Validates input and generates then renders a word search
///////////////////////////////////////////////////////////////

function generateWordsearch() {

	if (WORDS.value && ROWS.value && COLS.value && TYPE.value) {
	
		const numLetters   = WORDS.value.replace(/[\s,]/g, '').length;
		const wordList     = WORDS.value.split(',');
		const longestWord  = getLongestWord(wordList);

		if (validateFit(numLetters, longestWord)) {

			CONTAINER.innerHTML = '';

			// fetch the filler letters
			fetch(`./letters/${TYPE.value}`, {
				method: 'GET'
			}).then((response) => {
				if (!response.ok) {
					console.error(response.status);
				}
				return response.json();
			})
			// generate the word search
			.then((json) => {
				const filler = json.text;
				const M = new Matrix(ROWS.value, COLS.value, false, filler);
				CONTAINER.replaceWith(M.renderHTML());

				// 🟡🟡🟡
			});
		}

	}
}

///////////////////////////////////////////////////////////////
// Validates that a word search is possible with the given size
///////////////////////////////////////////////////////////////

function validateFit(numLetters, longestWord) {
	
	const r = parseInt(ROWS.value);
	const c = parseInt(COLS.value);
	const l = numLetters;
	const w = longestWord;

	/*
	console.log({
		'r': r, 
		'c': c, 
		'l': l, 
		'w': w
	});
	*/

	if ((w > r && w > c) || 	// word longer than both sides
		(l > r * c)) {			// more letters than grid
		return false;
	}
	return true;
}

///////////////////////////////////////////////////////////////
// Given a list of words, return the length of the longest word
///////////////////////////////////////////////////////////////

function getLongestWord(wordList) {
	let longestWord = 0;
	wordList.forEach((word) => {
		if (word.length > longestWord) {
			longestWord = word.length;
		}
	});
	return longestWord;
}

///////////////////////////////////////////////////////////////
// Return a random letter from the filler text
///////////////////////////////////////////////////////////////

function getFillerLetter(filler) {
	return filler.at(Math.floor(Math.random() * filler.length));
}


///////////////////////////////////////////////////////////////
// Cell Class
///////////////////////////////////////////////////////////////

class Cell {
	constructor(row, column, content) {
		this.r = row;
		this.c = column;
		this.content = content;
	}
}

///////////////////////////////////////////////////////////////
// Matrix Class
///////////////////////////////////////////////////////////////

class Matrix {
	constructor(rows, columns, showIndex, filler) {
		this.r = rows;
		this.c = columns;
		this.showIndex = showIndex;
		this.filler = filler;
		this.matrix = [];

		for (let r = 0; r < this.r; r++) {
			this.matrix[r] = new Array();
			for (let c = 0; c < this.c; c++) {
				if (this.showIndex) {
					this.matrix[r][c] = new Cell(r, c, `(${r}, ${c})`);
				} else {
					this.matrix[r][c] = new Cell(r, c, getFillerLetter(this.filler));
				}
			}
		}
	}
	// Return a div with rows and cells
	renderHTML() {
		const parent = document.createElement('div');
		parent.setAttribute('class', 'ws-container');
		for (let r = 0; r < this.r; r++) {
			const row = document.createElement('div');
			row.setAttribute('class', 'ws-row')
			for (let c = 0; c < this.c; c++) {
				const cell = document.createElement('span');
				cell.setAttribute('class', 'ws-cell');
				cell.textContent = this.matrix[r][c].content;
				row.appendChild(cell);
			}
			parent.appendChild(row);
		}
		return parent;
	}
}

/*
	// place all words on grid
	for w in words
		get random start pos
		if can place on start
			for d in directions
				if can fit
					place word
	// output answer key
	// fill empty tiles
	for t in tiles
		if tile empty
			get filler
*/

///////////////////////////////////////////////////////////////
// Changes the filler type description when selecting options
///////////////////////////////////////////////////////////////

function showTypeDescription() {
	const option = TYPE.querySelector('option:checked');
	if (option) {
		DESCRIPTION.textContent = option.dataset.description;
	}
	else {
		DESCRIPTION.textContent = DESC;
	}
}

///////////////////////////////////////////////////////////////