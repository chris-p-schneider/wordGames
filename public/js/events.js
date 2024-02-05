///////////////////////////////////////////////////////////////
// events.js
///////////////////////////////////////////////////////////////

const themeToggle = () => {
	
	const themePicker = document.querySelector('#theme-picker');
	const html        = document.querySelector('html');
	
	themePicker.addEventListener('click', () => {
		if (themePicker.textContent == '🌞') {
			themePicker.textContent = '🌘';
			html.setAttribute('class', 'theme-light');
		}
		else {
			themePicker.textContent = '🌞';
			html.setAttribute('class', 'theme-dark');
		}
	});
}

///////////////////////////////////////////////////////////////

function loadEvents() {
	themeToggle();
}

///////////////////////////////////////////////////////////////

addEventListener('load', loadEvents);

///////////////////////////////////////////////////////////////