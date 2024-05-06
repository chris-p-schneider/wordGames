///////////////////////////////////////////////////////////////
// Word search generator
///////////////////////////////////////////////////////////////

// CONSTANTS --------------------------------------------------

const CONTAINER   = document.querySelector('#ws-container');
const WORDS       = document.querySelector('#ws-words');
const ROWS        = document.querySelector('#ws-rows');
const COLS        = document.querySelector('#ws-columns');
const CELL_WIDTH  = 50;
const DESCRIPTION = document.querySelector('#ws-type-description');
const DESC        = 'Select a method for the filler letters.';
const TYPE        = document.querySelector('#ws-type');
const BUTTON      = document.querySelector('#ws-button');
const SHOW_ANSWER = document.querySelector('#ws-show-answer');

ROWS.addEventListener('input', showCanvasSize);
COLS.addEventListener('input', showCanvasSize);
TYPE.addEventListener('input', showTypeDescription);
BUTTON.addEventListener('click', generateWordsearch);

///////////////////////////////////////////////////////////////
// Validates input and generates then renders a word search
///////////////////////////////////////////////////////////////

function generateWordsearch() {

	if (WORDS.value && ROWS.value && COLS.value && TYPE.value) {
	
		const numLetters   = WORDS.value.replace(/[\s,]/g, '').length;
		const wordList     = WORDS.value.split(',');
		const longestWord  = getLongestWord(wordList);

		if (validateFit(numLetters, longestWord)) {

			SHOW_ANSWER.checked = false;

			// fetch the filler letters
			fetch(`./letters/${TYPE.value}`, {
				method: 'GET'
			})
			// retrieve json
			.then((response) => {
				if (!response.ok) {
					console.error(response.status);
				}
				return response.json();
			})
			// generate the word search
			.then((json) => {
				const filler = json.text;
				const M = new Matrix(ROWS.value, COLS.value, false, filler);
				updateContainer(M);
				return;
			});
		}

	}
}

function updateContainer(matrix) {
	CONTAINER.innerHTML = '';
	CONTAINER.appendChild(matrix.renderCanvas(false));
	SHOW_ANSWER.disabled = false;
	SHOW_ANSWER.addEventListener('input', () => {
		if (CONTAINER.checked) {
			CONTAINER.innerHTML = '';
			CONTAINER.appendChild(matrix.renderCanvas(true));						
		} else {
			CONTAINER.innerHTML = '';
			CONTAINER.appendChild(matrix.renderCanvas(false));						
		}
	});
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
	const msMod = new Date().getMilliseconds() % filler.length;
	let char = '-';
	for (let i = 0; i < msMod + 2; i++) {
		char = filler.at(Math.floor(Math.random() * filler.length));
	}
	return char;
}


///////////////////////////////////////////////////////////////
// Cell Class
///////////////////////////////////////////////////////////////

class Cell {
	constructor(row, column, content, isAnswer) {
		this.r = row;
		this.c = column;
		this.content = content;
		this.isAnswer = isAnswer;
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
					this.matrix[r][c] = new Cell(r, c, `(${r}, ${c})`, false);
				} else {
					this.matrix[r][c] = new Cell(r, c, getFillerLetter(this.filler), false);
				}
			}
		}
	}

	// Returns a word search div with rows and cells
	renderHTML() {

		const parent = document.createElement('div');
		parent.setAttribute('id', 'ws-html');
		
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

	// Returns a canvas word search object
	renderCanvas(showAnswer) {

		const width      = (this.c * CELL_WIDTH) + (2 * CELL_WIDTH);
		const height     = (this.r * CELL_WIDTH) + (2 * CELL_WIDTH);
		const cellAdjust = (CELL_WIDTH / 2) - 5;

		const canvas = document.createElement('canvas');
		canvas.setAttribute('id', 'ws-canvas');
		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);

		const ctx = canvas.getContext('2d');
		
		ctx.fillStyle    = '#ffffff';
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle    = '#000000';
		ctx.font         = '1.25rem "Noto Sans Mono", monospace';
		ctx.textAlign    = 'center';
		ctx.textBaseline = 'middle';

		if (showAnswer) {
			for (let c = 0; c < this.c; c++) {
				for (let r = 0; r < this.r; r++) {
					if (this.matrix[r][c].isAnswer) {
						ctx.fillText(this.matrix[r][c].content, 
							((c + 1) * CELL_WIDTH) + cellAdjust, 
							((r + 1) * CELL_WIDTH) + cellAdjust);
					}
				}
			}			
		}
		else {
			for (let c = 0; c < this.c; c++) {
				for (let r = 0; r < this.r; r++) {
					ctx.fillText(this.matrix[r][c].content, 
						((c + 1) * CELL_WIDTH) + cellAdjust, 
						((r + 1) * CELL_WIDTH) + cellAdjust);
				}
			}			
		}


		return canvas;
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
// INPUT CHANGE EVENTS
///////////////////////////////////////////////////////////////

// Changes the filler type description when selecting options
function showTypeDescription() {
	const option = TYPE.querySelector('option:checked');
	if (option) {
		DESCRIPTION.textContent = option.dataset.description;
	}
	else {
		DESCRIPTION.textContent = DESC;
	}
}

// resizes the blank preview canvas
function showCanvasSize() {
	const canvas = CONTAINER.querySelector('canvas');
	canvas.setAttribute('width', COLS.value * CELL_WIDTH);
	canvas.setAttribute('height', ROWS.value * CELL_WIDTH);
}

///////////////////////////////////////////////////////////////