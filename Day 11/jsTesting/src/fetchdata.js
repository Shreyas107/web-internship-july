async function getUser(id) {
  const response = await fetch(`/users/${id}`);
  const data = await response.json();
  return data;
}

module.exports = getUser;
