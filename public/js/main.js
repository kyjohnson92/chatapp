const socket = io()
const form = document.getElementById('form');
const input = document.getElementById('message');
const messages = document.getElementById('chat-box-messages')
const chatBox = document.getElementById('chat-box')
const userList = document.getElementById('user-list')

//Update user list upon connection
socket.on('users' , users => {
    updateUserList(users)
})

//store user of most recent message
let currMsgUser = {user: ''};

//Pull Message from Server
socket.on('message', message => {
    outputMessage(message, currMsgUser)
    chatBox.scrollTop = chatBox.scrollHeight
})

//Capture User Submitted Messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

//output userlist to dom
const updateUserList = (users) => {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user;
    userList.appendChild(li);
  });
}

//Formatting new message and output to dom
const outputMessage = (message, msgUser) => {
  //append message text to previous message if same user 
  if (message.user === msgUser.user){
    messages.lastChild.lastElementChild.innerText += `\r\n ${message.text}`;
  }
  else {
    const newMsg = document.createElement('li');
    newMsg.classList.add('message');
    const msgInfo = document.createElement('p');
    const msgText = document.createElement('p');
    
    
    msgInfo.classList.add('meta');
    msgInfo.innerText = message.user;
    msgInfo.innerHTML += `<span>  ${message.time}</span>`;
    newMsg.appendChild(msgInfo);
    
    msgText.classList.add('text');
    msgText.innerText = message.text;
    newMsg.appendChild(msgText);
    messages.appendChild(newMsg);
    
    //update currMsgUser var with the new user
    msgUser.user = message.user
  }
};
