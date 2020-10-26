const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home page route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Notes page route
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET API notes route
app.get("/api/notes", function (req, res) {
  fs.readFile("db/db.json", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    text = JSON.parse(data);
    res.send(text);
  });
});

// POST API notes route
app.post("/api/notes", function (req, res) {});

// DELETE API notes route
app.delete("/api/notes:id", function (req, res) {});

// Port listener
app.listen(PORT, () => console.log("App listening on PORT " + PORT));
