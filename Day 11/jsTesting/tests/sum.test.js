const sum = require("../src/sum");

// Test case to verify if 1 + 2 equals 3
test("adds 1 + 2 to equal 3", () => {
  // The expect function is used to assert that sum(1, 2) returns 3
  expect(sum(1, 2)).toBe(3);
});

test("adds -1 + -1 to equal -2", () => {
  expect(sum(-1, -1)).toBe(-2);
});

test("adds 0 + 0 to equal 0", () => {
  expect(sum(0, 0)).toBe(0);
});
