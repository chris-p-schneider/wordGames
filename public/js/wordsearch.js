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

///////////////////////////////////////////////////////////////
// Validates input and generates then renders a word search
///////////////////////////////////////////////////////////////

function generateWordsearch() {

	if (WORDS.value && ROWS.value && COLS.value && TYPE.value) {
	
		const numLetters   = WORDS.value.replace(/[\s,]/g, '').length;
		const wordList     = WORDS.value.split(',');
		const longestWord  = getLongestWord(wordList);

		if (validateFit(numLetters, longestWord)) {

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
				console.log(getFillerLetter(filler));
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