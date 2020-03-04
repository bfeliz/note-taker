// dependencies
const express = require("express");
const uuid = require("uuid").v4;

const fs = require("fs");
const path = require("path");
const OUTPUT_DIR = path.resolve(__dirname, "db");
const outputPath = path.join(OUTPUT_DIR, "db.json");

const app = express();
const PORT = process.env.PORT || 5050;

// middleware for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware to specify a static directory of 'public'
app.use(express.static("public"));

let notes = [];

// ---------------------  FUNCTIONS --------------------------
// self-calling function to get data from db file and add to local array
(function readDbFile() {
    fs.readFile(outputPath, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            notes = JSON.parse(data);
        }
    });
})();

// function to write new db file with note additions and deletions
function writeFile() {
    let overwrite = JSON.stringify(notes);
    fs.writeFile(outputPath, overwrite, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("File written");
        }
    });
}

// ------------------------- ROUTES ---------------------------

// basic routes to notes HTML files
app.get("/", function(req, res) {
    const indexPath = path.join(__dirname, "/public/index.html");
    res.sendFile(indexPath);
});

app.get("/notes", function(req, res) {
    const notesPath = path.join(__dirname, "/public/notes.html");
    res.sendFile(notesPath);
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
    const indexPath = path.join(__dirname, "/public/index.html");
    res.sendFile(indexPath);
});

// starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
