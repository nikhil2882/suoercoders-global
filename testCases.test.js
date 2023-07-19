const addTwoNumbers = require("./testCases");

test("should add two numbers", () => {
  expect(addTwoNumbers(1, 2)).toBe(3);
});

test("should concate strings", () => {
  expect(addTwoNumbers(1, "2")).toBe("12");
});

test("should concate empty strings", () => {
  expect(addTwoNumbers(1, "")).toBe("1");
});

test("should concate empty strings", () => {
  expect(addTwoNumbers("", "")).toBe("");
});

test("should throw error if no arguments are passed", () => {
  expect(() => addTwoNumbers()).toThrow();
});

test("should throw error if null is passed", () => {
  expect(() => addTwoNumbers(null, null)).toThrow();
});
