const socket = io()

const form = document.getElementById('form');
const input = document.getElementById('message');
const messages = document.getElementById('chat-box-messages')


socket.on('message', message => {
    let newMsg = document.createElement('li')
    newMsg.textContent = message
    messages.appendChild(newMsg)
    messages.scrollTop = messages.scrollHeight
})


//Capture User Submitted Messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });




