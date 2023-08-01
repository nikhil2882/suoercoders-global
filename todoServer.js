const express = require("express");
const fs = require("fs");
var session = require("express-session");
const multer = require("multer");

const db = require("./models/db");
const UserModel = require("./models/User");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

const app = express();

app.set("view engine", "ejs");

// uncomment this line to change the default views directory
//app.set("views", __dirname + "/todoViews");

app.use(
  session({
    secret: "meinkyunbataun",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("todoViews"));
app.use(express.static("uploads"));

// single means only one file can be uploaded
// array means multiple files can be uploaded
// "pic" is the name of the field in the form
app.use(upload.single("pic"));

app.get("/", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.render("index", {
    username: req.session.username,
    profilePic: req.session.profilePic,
  });
});

app.post("/todo", function (req, res) {
  if (!req.session.isLoggedIn) {
    //res.status(401).send("error");
    res.redirect("/login");
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
  res.render("about", { username: req.session.username });
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

app.get("/signup", function (req, res) {
  res.render("signup", { error: null });
});

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const profilePic = req.file;

  const user = {
    username: username,
    password: password,
    profilePic: profilePic.filename,
  };

  UserModel.create(user)
    .then(function () {
      res.redirect("/login");
    })
    .catch(function (err) {
      res.render("signup", { error: err });
    });

  /* saveUser(user, function (err) {
    if (err) {
      res.render("signup", { error: "Something went wrong" });
      return;
    }

    res.redirect("/login");
  }); */
});

app.get("/login", function (req, res) {
  res.render("login", { error: null });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // if suing findOne then result will be null or the user object
  // if using find then result will be an array of user objects
  UserModel.findOne({ username: username, password: password })
    .then(function (user) {
      if (user) {
        req.session.isLoggedIn = true;
        req.session.username = username;
        req.session.profilePic = user.profilePic;
        res.redirect("/");
        return;
      }
      res.render("login", { error: "Invalid username or password" });
    })
    .catch(function (err) {
      res.render("login", { error: "Something went wrong" });
    });

  /* getAllUsers(function (err, data) {
    if (err) {
      res.render("login", { error: "Something went wrong" });
      return;
    }

    const user = data.find(function (user) {
      return user.username === username && user.password === password;
    });

    if (user) {
      req.session.isLoggedIn = true;
      req.session.username = username;
      req.session.profilePic = user.profilePic;
      res.redirect("/");
      return;
    }

    res.render("login", { error: "Invalid username or password" });
  }); */
});

db.init()
  .then(function () {
    console.log("db connected");

    app.listen(3000, function () {
      console.log("server on port 3000");
    });
  })
  .catch(function (err) {
    console.log(err);
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

function saveUser(user, callback) {
  getAllUsers(function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    data.push(user);

    fs.writeFile("./users.apk", JSON.stringify(data), function (err) {
      if (err) {
        callback(err);
        return;
      }

      callback(null);
    });
  });
}

function getAllUsers(callback) {
  fs.readFile("./users.apk", "utf-8", function (err, data) {
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
      callback([]);
    }
  });
}
