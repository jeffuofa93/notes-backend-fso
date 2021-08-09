const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const databaseName = "note-app";
// databse srv string: mongodb+srv://jeff:<password>@phonebook-mongo.19wvo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const url = `mongodb+srv://jeff:${password}@phonebook-mongo.19wvo.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
// const url = `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "This note is not important",
  date: new Date(),
  important: false,
});
//
note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
