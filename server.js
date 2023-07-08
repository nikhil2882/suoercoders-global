const http = require("http");
const fs = require("fs");

const receptor = function (request, response) {
  const url = request.url;
  const method = request.method;

  console.log(request.url);

  if (method === "GET") {
    if (url === "/") {
      response.writeHead(200, {
        "Content-Type": "text/html",
      });

      fs.readFile("./index.html", "utf8", function (err, data) {
        if (err) {
          response.end("error");
        } else {
          response.end(data);
        }
      });
    } else if (url === "/about") {
      response.end("about");
    } else if (url === "/contact") {
      fs.readFile("./contact.html", "utf8", function (err, data) {
        if (err) {
          response.end("error");
        }
        response.end(data);
      });
    } else if (url === "/contact.css") {
      response.writeHead(404, {
        "Content-Type": "text/css",
      });

      fs.readFile("./contact.css", "utf8", function (err, data) {
        if (err) {
          response.end("error");
        }
        response.end(data);
      });
    } else if (url === "/todo") {
      fs.readFile("./todo.json", "utf8", function (err, data) {
        if (err) {
          response.end("error");
        }
        response.end(data);
      });
    } else {
      response.writeHead(404);
      response.end("Not found");
    }
  } else {
    if (url === "/todo") {
      getFormDataFromRequest(request, function (body) {
        const todo = formatData(body);

        saveTodoInFile(todo, function () {
          response.writeHead(200, {
            "Content-Type": "application/json",
          });
          response.end(JSON.stringify(todo));
        });
      });
    }
  }
};

const server = http.createServer(receptor);

server.listen(8000, function () {
  console.log("server is listening on port 8000");
});

function getFormDataFromRequest(request, callback) {
  let body = "";
  request.on("data", function (chunk) {
    body += chunk;
  });

  request.on("end", function () {
    callback(body);
  });
}

function formatData(body) {
  const todoStringArray = body.split("&");

  const todoObject = {};

  todoStringArray.forEach(function (todoString) {
    const todoArray = todoString.split("=");
    todoObject[todoArray[0]] = todoArray[1];
  });

  return todoObject;
}

function saveTodoInFile(todo, callback) {
  fs.readFile("./todo.json", "utf8", function (err, data) {
    if (err) {
      throw err;
    } else {
      const todos = JSON.parse(data);
      todos.push(todo);
      fs.writeFile("./todo.json", JSON.stringify(todos), function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
}
