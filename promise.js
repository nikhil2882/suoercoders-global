const fs = require("fs");

// read file after provided time
function readFileAfterTime(time, callback) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      fs.readFile("./server.js", "utf8", function (err, data) {
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
    console.log("first");
    return rejectPromiseAfterTime(2000);
  })
  .then(function (data) {
    console.log("second");
    return readFileAfterTime(8000);
  })
  .then(function (data) {
    console.log("second");
    return rejectPromiseAfterTime(8000);
  })
  .then(function (data) {
    console.log("data", data);
  })
  .catch(function (err) {
    console.log("error", err);
  });

function rejectPromiseAfterTime(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("rejected"));
    }, time);
  });
}

/* readFileAfterTime(2000, function (err, data) {
  if (err) {
    readFileAfterTime(2000, function (err, data) {
      if (err) {
        readFileAfterTime(2000, function (err, data) {
          if (err) {
          } else {
            console.log("data", data);
          }
        });
      } else {
        console.log("data", data);
      }
    });
  } else {
    console.log("data", data);
  }
});
 */
