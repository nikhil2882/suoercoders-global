var socket = io();

const userNameNode = document.getElementById("userName");
const submitUserNameNode = document.getElementById("submitUserName");
const userNickNameLabelNode = document.getElementById("userNickNameLabel");

const searchFriendNode = document.getElementById("searchFriend");
const searchFriendButtonNode = document.getElementById("search");
const friendNickNameLabelNode = document.getElementById("friendNickNameLabel");

let user;

// search friend

searchFriendButtonNode.addEventListener("click", function () {
  const friendName = searchFriendNode.value;

  socket.emit("search friend", friendName);
});

socket.on("search friend", function (friendData) {
  if (friendData) {
    friendNickNameLabelNode.innerText = friendData.nickName;

    // start chat

    startChat(friendData);
  } else {
    friendNickNameLabelNode.innerText =
      "koi dost nhi h , is naam se, spelling check kr le";
  }
});

function startChat(friendData) {
  // create and append a button in chat box
  const chatBoxNode = document.getElementById("chatBox");

  chatBoxNode.innerHTML = "";

  const chatButtonNode = document.createElement("button");
  chatButtonNode.innerText = "chat with " + friendData.nickName;
  chatButtonNode.id = "chatButton";

  chatBoxNode.appendChild(chatButtonNode);

  chatButtonNode.addEventListener("click", function () {
    // create a chatbox like hangout and append into body

    const chatNode = document.createElement("div");
    chatNode.style.position = "fixed";
    chatNode.style.bottom = "0px";
    chatNode.style.right = "0px";
    chatNode.style.width = "300px";
    chatNode.style.height = "300px";
    chatNode.style.backgroundColor = "white";
    chatNode.style.border = "1px solid black";
    chatNode.style.display = "flex";
    chatNode.style.flexDirection = "column";

    const chatHeaderNode = document.createElement("div");
    chatHeaderNode.style.height = "50px";
    chatHeaderNode.style.backgroundColor = "grey";
    chatHeaderNode.style.display = "flex";
    chatHeaderNode.style.justifyContent = "space-between";
    chatHeaderNode.style.alignItems = "center";

    const chatHeaderLabelNode = document.createElement("label");
    chatHeaderLabelNode.innerText = friendData.nickName;

    const chatHeaderCloseButtonNode = document.createElement("button");
    chatHeaderCloseButtonNode.innerText = "X";

    chatHeaderNode.appendChild(chatHeaderLabelNode);
    chatHeaderNode.appendChild(chatHeaderCloseButtonNode);

    const chatBodyNode = document.createElement("div");
    chatBodyNode.style.flexGrow = "1";
    chatBodyNode.style.overflowY = "scroll";

    const chatFooterNode = document.createElement("div");
    chatFooterNode.style.height = "50px";
    chatFooterNode.style.backgroundColor = "grey";
    chatFooterNode.style.display = "flex";
    chatFooterNode.style.justifyContent = "space-between";
    chatFooterNode.style.alignItems = "center";

    const chatFooterInputNode = document.createElement("input");
    chatFooterInputNode.style.flexGrow = "1";

    const chatFooterSendButtonNode = document.createElement("button");
    chatFooterSendButtonNode.innerText = "Send";

    chatFooterNode.appendChild(chatFooterInputNode);
    chatFooterNode.appendChild(chatFooterSendButtonNode);

    chatNode.appendChild(chatHeaderNode);
    chatNode.appendChild(chatBodyNode);
    chatNode.appendChild(chatFooterNode);

    document.body.appendChild(chatNode);

    // send message

    chatFooterSendButtonNode.addEventListener("click", function () {
      const msg = chatFooterInputNode.value;

      socket.emit("chat message", {
        msg: msg,
        friendUserName: friendData.userName,
        sentBy: user,
      });

      chatFooterInputNode.value = "";
    });
  });
}

// handle incoming chat

const chatList = {};

let body;
socket.on("chat message", function (chatData) {
  if (!chatList[chatData.sentBy.userName]) {
    chatList[chatData.sentBy.userName] = true;

    // create a chatbox like hangout and append into body

    const chatNode = document.createElement("div");
    chatNode.style.position = "fixed";
    chatNode.style.bottom = "0px";
    chatNode.style.right = "0px";
    chatNode.style.width = "300px";
    chatNode.style.height = "300px";
    chatNode.style.backgroundColor = "white";
    chatNode.style.border = "1px solid black";
    chatNode.style.display = "flex";
    chatNode.style.flexDirection = "column";

    const chatHeaderNode = document.createElement("div");
    chatHeaderNode.style.height = "50px";
    chatHeaderNode.style.backgroundColor = "grey";
    chatHeaderNode.style.display = "flex";
    chatHeaderNode.style.justifyContent = "space-between";
    chatHeaderNode.style.alignItems = "center";

    const chatHeaderLabelNode = document.createElement("label");
    chatHeaderLabelNode.innerText = chatData.sentBy.nickName;

    const chatHeaderCloseButtonNode = document.createElement("button");
    chatHeaderCloseButtonNode.innerText = "X";

    chatHeaderNode.appendChild(chatHeaderLabelNode);
    chatHeaderNode.appendChild(chatHeaderCloseButtonNode);

    const chatBodyNode = document.createElement("div");
    chatBodyNode.style.flexGrow = "1";
    chatBodyNode.style.overflowY = "scroll";

    const chatFooterNode = document.createElement("div");
    chatFooterNode.style.height = "50px";
    chatFooterNode.style.backgroundColor = "grey";
    chatFooterNode.style.display = "flex";
    chatFooterNode.style.justifyContent = "space-between";
    chatFooterNode.style.alignItems = "center";

    const chatFooterInputNode = document.createElement("input");
    chatFooterInputNode.style.flexGrow = "1";

    const chatFooterSendButtonNode = document.createElement("button");
    chatFooterSendButtonNode.innerText = "Send";

    chatFooterNode.appendChild(chatFooterInputNode);
    chatFooterNode.appendChild(chatFooterSendButtonNode);

    chatNode.appendChild(chatHeaderNode);
    chatNode.appendChild(chatBodyNode);
    chatNode.appendChild(chatFooterNode);

    document.body.appendChild(chatNode);

    body = chatBodyNode;
  }
  // create a incoming chat message and appen into chat body

  const chatMessageNode = document.createElement("div");
  chatMessageNode.style.display = "flex";
  chatMessageNode.style.justifyContent = "flex-start";
  chatMessageNode.style.alignItems = "center";
  chatMessageNode.style.margin = "10px";

  const chatMessageLabelNode = document.createElement("label");
  chatMessageLabelNode.innerText = chatData.msg;

  chatMessageNode.appendChild(chatMessageLabelNode);

  body.appendChild(chatMessageNode);
});

// update user
submitUserNameNode.addEventListener("click", function () {
  const userName = userNameNode.value;

  socket.emit("connect user", userName);
});

socket.on("le bhai message aaya", function (msg) {
  console.log("bhai ne message kiya");
});

socket.on("disconnect", function () {
  console.log("bhai chala gaya");
});

socket.on("connect", function () {
  console.log("bhai aa gaya");
});

socket.on("user updated", function (userData) {
  if (!userData.nickName) {
    const nickName = prompt("Enter your nickname");

    if (nickName) {
      socket.emit("update user", {
        nickName: nickName,
        userName: userData.userName,
      });
    }
  } else {
    user = userData;
    userNickNameLabelNode.innerText = userData.nickName;
  }
});

socket.on("user updated nickname", function (userData) {
  user = userData;
  userNickNameLabelNode.innerText = userData.nickName;
});
