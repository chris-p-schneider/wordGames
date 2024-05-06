///////////////////////////////////////////////////////////////
// app.js
///////////////////////////////////////////////////////////////

const express = require('express')
const fs = require('fs');
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
                        subtitle: 'Word Search Generator',
                        script: './js/wordsearch.js' });
})

// Returns letters for frequency type
app.get('/letters/:type', async (req, res) => {
  if (req.params.type == 'random') {
    fs.readFile('./public/txt/freq_random.txt', 'utf8', (err, data) => {
      if (err) { console.error(err); } 
      else { console.log(data); res.status(200).send({'text': data}); }
    });
  }
  else if (req.params.type == 'text') {
    fs.readFile('./public/txt/freq_text.txt', 'utf8', (err, data) => {
      if (err) { console.error(err); } 
      else { console.log(data); res.status(200).send({'text': data}); }
    });
  }
  else if (req.params.type == 'dictionary') {
    fs.readFile('./public/txt/freq_dict.txt', 'utf8', (err, data) => {
      if (err) { console.error(err); }
      else { console.log(data); res.status(200).send({'text': data}); }
    });
  }
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