const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));




const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );


const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.status(200).json(notes);
  });

  // POST request to add a review
  app.post('/api/notes', (req, res) => {
      
    // Log that a POST request was received
    console.info(`request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text ) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: 1,
      };
      const response = {
        status: 'success',
        body: newNote,
      };

      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully 🚀`);
    } else {
      res.status(500).json('Error in posting note')
    }
     
    }
  );
  

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT} 🚀`)
);