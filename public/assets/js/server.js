// dependencies
const express = require("express");
const uuid = require("uuid").v4;

const fs = require("fs");
const path = require("path");
const OUTPUT_DIR = path.resolve(__dirname, "././db");
const outputPath = path.join(OUTPUT_DIR, "db.json");

const app = express();
const PORT = 4000;

// express data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const notes = [];

// routes

// respond with all notes
app.get("/api/notes", function(req, res) {
    return res.json(notes);
});

// add new note and respond with the new note json data
app.post("/api/notes", function(req, res) {
    const newNote = req.body;
    const id = { id: uuid() };
    Object.assign(newNote, id);
    notes.push(newNote);
    res.json(newNote);
});

// displays a single note
app.get("/api/notes/:note", function(req, res) {
    let chosen = req.params.note;
    console.log(chosen);

    for (let i = 0; i < notes.length; i++) {
        if (chosen === notes[i].id) {
            return res.json(notes[i]);
        }
    }
    return res.json(false);
});

// delete selected note
app.delete("/api/notes/:del", function(req, res) {
    let newChosen = req.params.del;
    console.log(newChosen);

    for (let i = 0; i < notes.length; i++) {
        if (newChosen === notes[i].id) {
            notes.splice(i, 1);
            return res.json(notes);
        }
    }
    return res.json(false);
});

function readDbFile() {
    fs.readFile(
        "/Users/brittanyfortner/Desktop/Code/Homework/note-taker/db/db.json",
        function(err, data) {
            notes = JSON.parse(data);
        }
    );
}

// starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
