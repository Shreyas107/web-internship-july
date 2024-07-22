// data.test.js
describe("beforeEach example", () => {
  let data;

  // The beforeEach function runs before each test in this suite
  beforeEach(() => {
    // Initialize the data array with [1, 2, 3] before each test
    data = [1, 2, 3];
  });

  // Define the first test case
  test("first test", () => {
    // Modify the data array by adding the number 4
    data.push(4);
    // Check if the data array now equals [1, 2, 3, 4]
    expect(data).toEqual([1, 2, 3, 4]);
  });

  // Define the second test case
  test("second test", () => {
    // Modify the data array by adding the number 5
    data.push(5);
    // Check if the data array now equals [1, 2, 3, 5]
    expect(data).toEqual([1, 2, 3, 5]);
  });
});
