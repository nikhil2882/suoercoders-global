const userNames = {};

function setUserNames(socket, userName) {
  userNames[userName] = {
    data: { userName: userName },
    connection: socket,
  };

  return userNames[userName];
}

function getUser(userName) {
  return userNames[userName];
}

function updateUser(userName, userData) {
  const user = getUser(userName);

  if (user) {
    user.data.nickName = userData.nickName;
    setUserNames(user.connection, user);
  }
}

module.exports = {
  setUserNames: setUserNames,
  getUser: getUser,
  updateUser: updateUser,
};
