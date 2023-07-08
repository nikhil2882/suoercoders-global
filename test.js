const calculateArea = require("area-of-square");
const calculateRectangleleArea = require("./utils/area/rectangle");
const calculateCircleArea = require("./utils/area/circle");

const areaOfBigSqaure = calculateArea(40);
const areaOfBigRectangle = calculateRectangleleArea(40, 50);

console.log("sqaure", areaOfBigSqaure);
console.log("rectangle", areaOfBigRectangle);
