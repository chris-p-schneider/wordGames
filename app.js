///////////////////////////////////////////////////////////////
// app.js
///////////////////////////////////////////////////////////////

const express = require('express')
const app = express()
const port = 3000

///////////////////////////////////////////////////////////////
// EJS
///////////////////////////////////////////////////////////////

let ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

///////////////////////////////////////////////////////////////
// ROUTES
///////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.render('index', { main: 'wordGames.ejs',
                        title: 'Word Games',
                        subtitle: 'Handout generators for teachers' });
})

// Word Search
app.get('/word-search', (req, res) => {
  res.render('index', { main: './generators/wordSearch.ejs',
                        title: 'Word Games',
                        subtitle: 'Word Search Generator' });
})

// Crossword
app.get('/crossword', (req, res) => {
  res.render('index', { main: './generators/crossWord.ejs',
                        title: 'Word Games',
                        subtitle: 'Crossword Generator' });
})

///////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`app.js listening on port ${port}`)
})

///////////////////////////////////////////////////////////////