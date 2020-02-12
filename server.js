// to do: deploy to Heroku

const express = require("express");
const path = require("path");
const fs = require('fs');
const db = require('./db/db.json');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  return res.json(db);
});

// full disclosure, mostly copied these from page tyler, we talked through a bunch of
// stuff on slack
app.post("/api/notes", (req, res) => {
  let note = req.body;
    note.title = note.title.toLowerCase().replace(/\s+/g, '');
    db.push(note);

    (async () => {
      await fs.writeFile('db/db.json', JSON.stringify(db), err => {
        if(err) throw err;
      })
    })()
  res.json({ Ok: true });
});

app.delete("/api/notes/:title", (req, res) => {
  const deleteTarget = req.params.title,
    index = db.findIndex( i => i.title === deleteTarget);
    db.splice(index, 1);

    (async () => {
      await fs.writeFile('db/db.json', JSON.stringify(db), err => {
        if(err) throw err;
      })
    })()
  res.json({ Ok: true });
})

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
  console.log(__dirname);
});