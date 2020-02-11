const express = require("express");
const path = require("path");
const fs = require('fs');
const journal = require('./journal.json');

// require("./public/assets/js/index")(app);

var app = express();
var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  return res.json(journal);
});

app.post("/api/notes", (req, res) => {
  let note = req.body;
    note.title = note.title.toLowerCase().replace(/\s+/g, '');
    journal.push(note);

    (async () => {
      await fs.writeFile('journal.json', JSON.stringify(journal), err => {
        if(err) throw err;
      })
    })()
  res.json({ Ok: true });
});

app.delete("/api/notes/:title", (req, res) => {
  const deleteTarget = req.params.title,
    index = journal.findIndex( i => i.title === deleteTarget);
    journal.splice(index, 1);

    (async () => {
      await fs.writeFile('journal.json', JSON.stringify(journal), err => {
        if(err) throw err;
      })
    })()
  res.json({ Ok: true });
})

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
  console.log(__dirname);
});