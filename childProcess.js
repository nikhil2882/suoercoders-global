const childProcess = require("child_process");

//const command = childProcess.spawn("ls", ["-a"]);

let command = null;

if (process.platform === "win32") {
  command = childProcess.spawn("cmd", ["/c", "dir"]);
} else {
  command = childProcess.spawn("ls", ["-a"]);
}

command.stdout.on("data", function (data) {
  console.log(data.toString());
});

command.on("close", function (code) {
  console.log(`child process exited with code ${code}`);
});

command.on("error", function (err) {
  console.log(`child process exited with error ${err}`);
});
