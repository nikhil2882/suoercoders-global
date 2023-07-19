const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/todoViews/index.html");
});

app.post("/todo", function (req, res) {
  saveTodoInFile(req.body, function (err) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    res.status(200).send("success");
  });
});

app.get("/todo-data", function (req, res) {
  readAllTodos(function (err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    //res.status(200).send(JSON.stringify(data));
    res.status(200).json(data);
  });
});

app.get("/about", function (req, res) {
  res.sendFile(__dirname + "/todoViews/about.html");
});

app.get("/contact", function (req, res) {
  res.sendFile(__dirname + "/todoViews/contact.html");
});

app.get("/todo", function (req, res) {
  res.sendFile(__dirname + "/todoViews/todo.html");
});

app.get("/todoScript.js", function (req, res) {
  res.sendFile(__dirname + "/todoViews/scripts/todoScript.js");
});

app.listen(3000, function () {
  console.log("server on port 3000");
});

function readAllTodos(callback) {
  fs.readFile("./treasure.mp4", "utf-8", function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    if (data.length === 0) {
      data = "[]";
    }

    try {
      data = JSON.parse(data);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

function saveTodoInFile(todo, callback) {
  readAllTodos(function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    data.push(todo);

    fs.writeFile("./treasure.mp4", JSON.stringify(data), function (err) {
      if (err) {
        callback(err);
        return;
      }

      callback(null);
    });
  });
}
