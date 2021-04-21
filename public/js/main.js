const socket = io()

const form = document.getElementById('form');
const input = document.getElementById('message');
const messages = document.getElementById('chat-box-messages')
const chatBox = document.getElementById('chat-box')
const userList = document.getElementById('user-list')


socket.on('users' , users => {
    console.log(users)
    updateUserList(users)
  //Array.from(users).forEach(updateUserList)
  //updateUserList(user);
})
//Pull Message from Server
socket.on('message', message => {
    outputMessage(message)
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

const updateUserList = (users) => {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user;
    userList.appendChild(li);
  });
}

//Formatting new message and output to dom
const outputMessage = (message) => {
  const newMsg = document.createElement('li')
  newMsg.classList.add('message');
   const p = document.createElement('p');
   p.classList.add('meta');
   p.innerText = message.user;
   p.innerHTML += `<span>  ${message.time}</span>`;
   newMsg.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  newMsg.appendChild(para);
  messages.appendChild(newMsg);
};
