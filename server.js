const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Home page route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Notes page route
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// GET API notes route
app.get("/api/notes", function (req, res) {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw error;
    res.json(JSON.parse(data));
  });
});

// POST API notes route
app.post("/api/notes", function (req, res) {
  const note = req.body;
  // Read the existing db.json and convert the string into an object. Push the new note onto the resulting array.
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const allNotes = JSON.parse(data);
    allNotes.push(note);
    // Assign ID number to each object in array, to be accessed when deleting.
    allNotes.forEach(function (item, index, array) {
      item.id = index;
    });
    // Update the db.json with new array in string format
    fs.writeFile("db/db.json", JSON.stringify(allNotes), (err) => {
      if (err) throw err;
      res.json(allNotes);
    });
  });
});

// DELETE API notes route
app.delete("/api/notes/:id", function (req, res) {
  const { id } = req.params;
  fs.readFile("db/db.json", "utf8", (error, data) => {
    if (error) throw error;
    // Get the current notes in db.json.
    let allNotes = JSON.parse(data);
    // Filter the array not to include the id we want to delete.
    // != is used instead of !== because we're comparing a number to a string.
    allNotes = allNotes.filter((item) => item.id != id);
    // Update the db.json with new array in string format
    fs.writeFile("db/db.json", JSON.stringify(allNotes), (err) => {
      if (err) throw err;
      res.send("Note deleted.");
    });
  });
});

// Port listener
app.listen(PORT, () => console.log("App listening on PORT " + PORT));
