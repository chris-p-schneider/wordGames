///////////////////////////////////////////////////////////////
// events.js
///////////////////////////////////////////////////////////////

// changes the theme picker icon and html theme class
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
		// 🟡 should save/check theme in cookie
	});
}

// shows a modal explaining cookies and on accept creates a cookie
const requestCookies = () => {
	// 🍪 ...
}

///////////////////////////////////////////////////////////////

export function loadEvents() {
	themeToggle();
}

///////////////////////////////////////////////////////////////