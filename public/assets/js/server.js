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

let notes = [];

// ---------------------  FUNCTIONS --------------------------
// self-calling function to get data from db file and add to local array
(function readDbFile() {
    fs.readFile(
        "/Users/brittanyfortner/Desktop/Code/Homework/note-taker/db/db.json",
        function(err, data) {
            if (err) {
                console.log(err);
            } else {
                notes = JSON.parse(data);
            }
        }
    );
})();

// function to write new db file with note additions and deletions
function writeFile() {
    let overwrite = JSON.stringify(notes);
    fs.writeFile(
        "/Users/brittanyfortner/Desktop/Code/Homework/note-taker/db/db.json",
        overwrite,
        function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("File written");
            }
        }
    );
}

// ------------------------- ROUTES ---------------------------
// basic route to notes HTML file
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

// respond with all notes
app.get("/api/notes", function(req, res) {
    return res.json(notes);
});

// add new note
app.post("/api/notes", function(req, res) {
    const newNote = req.body;
    const id = { id: uuid() };
    Object.assign(newNote, id);
    notes.push(newNote);
    writeFile();
    return res.json(newNote);
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
app.delete("/api/notes/:id", function(req, res) {
    let newChosen = req.params.id;
    console.log(newChosen);

    for (let i = 0; i < notes.length; i++) {
        if (newChosen === notes[i].id) {
            notes.splice(i, 1);
            writeFile();
            return res.json(notes);
        }
    }
    return res.json(false);
});

// basic route to index HTML file
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
