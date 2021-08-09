require("dotenv").config();
const express = require("express");
const app = express();
const Note = require("./models/note");
const cors = require("cors");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2020-01-10T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2020-01-10T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2020-01-10T19:20:14.298Z",
//     important: true,
//   },
// ];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

app.post("/api/notes", (request, response) => {
  const body = request.body;
  // case where note doesn't have a content field
  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  // Note is from the note.js and the noteShema
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });
  // save adds the element to the database and returns the result
  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.get("/api/notes/:id", (request, response) => {
  // findById is a mongoose method similiar to find but we just pass the id and the act on the response
  // request.params.id is the id passed in the url and it finds the match in the database
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
