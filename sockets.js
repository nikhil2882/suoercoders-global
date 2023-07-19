const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const socketServer = new Server(server);

const userBase = require("./userBase/users");

// middlewares
app.use(function (req, res, next) {
  next();
});

// express solves routing and middleware problems for developers
app.get("/", function (req, res) {
  /* fs.readFile("./public/index.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  }); */

  // alternative in express
  console.log(req.comesAt);
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/script.js", function (req, res) {
  res.sendFile(__dirname + "/public/script.js");
});

app.get("/about", function (req, res) {
  res.send("About");
});

app.get("/contact", function (req, res) {
  res.send("Contact");
});

server.listen(3000, () => {
  console.log("server on port 3000");
});

socketServer.on("connection", function (socket) {
  socket.on("disconnect", function () {
    console.log("bhai chala gaya");
  });

  socket.on("connect user", updateConnectedUsers(socket));

  socket.on("update user", function (userData) {
    console.log("first");
    console.log("first");
    updateConnectedUsersName(socket, userData);
  });

  socket.on("search friend", function (friendName) {
    searchFriend(friendName, socket);
  });

  socket.on("chat message", function (chatData) {
    handleChatMessage(chatData);
  });

  console.log("koi aa gaya maa");
});

function updateConnectedUsers(socket) {
  return function (userName) {
    let userData = userBase.getUser(userName);

    if (!userData) {
      userData = userBase.setUserNames(socket, userName);
    }

    socket.emit("user updated", userData.data);
  };
}

function updateConnectedUsersName(socket, userData) {
  console.log(userData);
  const userName = userData.userName;

  userBase.updateUser(userName, userData);

  userData = userBase.getUser(userName);

  socket.emit("user updated nickname", userData.data);
}

function searchFriend(friendName, socket) {
  const friendData = userBase.getUser(friendName);

  socket.emit("search friend", friendData?.data);
}

function handleChatMessage(chatData) {
  const friendData = userBase.getUser(chatData.friendUserName);

  friendData.connection.emit("chat message", chatData);
}
