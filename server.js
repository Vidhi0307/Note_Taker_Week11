const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uniqid = require('uniqid');
const PORT = process.env.PORT || 3001;
const noteData = require('./db/db.json')
// const { allowedNodeEnvironmentFlags } = require('process');

const app = express();

//const getAndRenderNotes = require('./public/assets/js/index')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.get('/', (req, res) => res.send('Navigate to the public folder'))

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    //res.readFile(path.join(__dirname, 'db/db.json'))
    //res.json(noteData);
    //console.log(noteData);
    res.json(noteData);
});



app.post('/api/notes', (req, res) => {
    console.log('in the post route');
    console.log('in the else of ReadandAppend');
    var newNote = req.body;
    console.log('this is before the id', newNote);
    newNote.id = uniqid();
    console.log('this is after the id is added', newNote);
    noteData.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(noteData, null, 4), (err) => {
        err ? console.log(err) : res.send(newNote)
    })
});

app.delete('api/notes/:id', (req, res) => {
    // Fetched id to delete
    let noteId = req.params.id.toString();

    console.log(`\n\nDELETE note request for noteId: ${noteId}`);

    // Read data from 'db.json' file
    let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    // filter data to get notes except the one to delete
    const newData = data.filter(note => note.id.toString() !== noteId);

    // Write new data to 'db.json' file
    fs.writeFileSync('./db/db.json', JSON.stringify(newData));

    console.log(`\nSuccessfully deleted note with id : ${noteId}`);

    // Send response
    res.json(newData);
});


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => {
    console.log(`Example app listening at http://localHost:${PORT}`);
});