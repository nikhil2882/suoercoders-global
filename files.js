const fs = require("fs");

fs.readFile("./files/a.html", "utf8", onComplete);

console.log("done");

function onComplete(err, data) {
  if (err) {
    console.log("error", err);
  } else {
    //console.log("data", data);
  }
}

// finctiop ()

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

add(1, subtract(3, 2));

console.log("first");
fs.writeFile("./files/b.html", "hello linux", function (err) {
  console.log(err);
});
console.log("second");

fs.readdir("./files", function (err, files) {
  for (let i = 0; i < files.length; i++) {
    fs.lstat("./files/" + files[i], function (err, stats) {
      if (err) {
        console.log("error", err);
        return;
      }

      if ("./files/" + files[i].isDirectory()) {
        console.log(files[i], "is a directory");
      } else if (stats.isFile()) {
        console.log(files[i], "is a file");
      } else {
        console.log(files[i], "is a something else");
      }
    });
  }
});
