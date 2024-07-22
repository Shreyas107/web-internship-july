const getUser = require("../src/fetchdata");

// Mock the global fetch function
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test("fetches user data", async () => {
  // Create a mock response
  const user = { name: "John Doe" };
  const mockResponse = {
    json: jest.fn().mockResolvedValue(user),
  };

  fetch.mockResolvedValue(mockResponse);

  // Call the function we're testing
  const data = await getUser(1);

  // Assert that the function returns the correct data
  expect(data).toEqual(user);

  console.log(data);

  // Optionally, assert that the mock was called with the correct arguments
  expect(fetch).toHaveBeenCalledWith("/users/1");
});
