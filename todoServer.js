const express = require("express");
const fs = require("fs");
var session = require("express-session");

const app = express();

app.use(
  session({
    secret: "meinkyunbataun",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/todoViews/index.html");
});

app.post("/todo", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.status(401).send("error");
    return;
  }

  saveTodoInFile(req.body, function (err) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    res.status(200).send("success");
  });
});

app.get("/todo-data", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.status(401).send("error");
    return;
  }

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
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/todoViews/about.html");
});

app.get("/contact", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/todoViews/contact.html");
});

app.get("/todo", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/todoViews/todo.html");
});

app.get("/todoScript.js", function (req, res) {
  res.sendFile(__dirname + "/todoViews/scripts/todoScript.js");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/todoViews/login.html");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "n" && password === "n") {
    req.session.isLoggedIn = true;
    req.session.username = username;
    res.redirect("/");
    return;
  }

  res.status(401).send("error");
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
