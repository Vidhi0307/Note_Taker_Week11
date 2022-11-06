const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uniqid = require('uniqid');
const PORT = process.env.PORT || 3001;
const noteData = require('./db/db.json')


const app = express();

//const getAndRenderNotes = require('./public/assets/js/index')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.get('/', (req, res) => res.send('Navigate to the public folder'))

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));


});

app.get('/api/notes', (req, res) => {

    console.log(noteData);
    res.sendFile(path.join(__dirname, "./db/db.json"))
});



app.post('/api/notes', (req, res) => {
    var newNote = req.body;
    //setting the id for the added note.
    newNote.id = uniqid();
    console.log('this is after the id is added', newNote);
    noteData.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(noteData, null, 4), (err) => {
        err ? console.log(err) : res.send(newNote)
    })
});

app.delete('/api/notes/:id', (req, res) => {


    const id = req.params.id;
    let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    console.info(`${req.method} request for note for id: ${id}`);
    const removeId = data.filter((elem) => elem.id !== id)


    fs.writeFile('./db/db.json', JSON.stringify(removeId, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData written `)
    );

    res.json(removeId);
});


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => {
    console.log(`Example app listening at http://localHost:${PORT}`);
});