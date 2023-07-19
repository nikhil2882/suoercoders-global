module.exports = function addTwoNumbers(a, b) {
  if (a === undefined || b === undefined) {
    throw new Error("Invalid arguments");
  }

  if (a === null || b === null) {
    throw new Error("Invalid arguments");
  }

  return a + b;
};
