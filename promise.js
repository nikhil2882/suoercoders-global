const fs = require("fs");

// read file after provided time
function readFileAfterTime(time, callback) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      fs.readFile("./serverr.js", "utf8", function (err, data) {
        if (err) {
          if (typeof callback === "function") {
            callback(err);
          }
          reject(err);
        } else {
          if (callback) {
            callback(null, data);
          }
          resolve(data);
        }
      });
    }, time);
  });
}

readFileAfterTime(2000)
  .then(function (data) {
    console.log("data", data);
  })
  .catch(function (err) {
    console.log("error", err);
  });

console.log("khatam");

readFileAfterTime(2000, function (e, d) {
  if (e) {
    console.log("error", e);
    return;
  }
  console.log("data", d);
});
