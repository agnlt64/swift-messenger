/**
 * The client-side code only emits events and all these
 * events are handled in the `events.py` file.
 */

// no need for let or const since this script will we included multiple times in the same page because I suck at designing correct apps
const socket = io()
const sendMessage = document.getElementById('send-message-form')
const chatArea = document.getElementById('messages-container')
let message = document.getElementById('message')

socket.on('connect', () => {
    socket.emit('join')
})

sendMessage.addEventListener('submit', () => {
    console.log('submitting form')
    document.querySelectorAll('.group').forEach(g => {
        if (g.classList.contains('active')) {
            // we have the current group id
            id = g.getAttribute('data-group-id')
            message = document.getElementById('message')
            chatArea.scrollTop = chatArea.scrollHeight
            socket.emit('message', message.value, id)
            message.value = ""
        }
    })
})

chatCallback = (mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
        sendMessage = document.getElementById('send-message-form')
        sendMessage.addEventListener('submit', () => {
            console.log('submitting form')
            document.querySelectorAll('.group').forEach(g => {
                if (g.classList.contains('active')) {
                    // we have the current group id
                    id = g.getAttribute('data-group-id')
                    message = document.getElementById('message')
                    chatArea.scrollTop = chatArea.scrollHeight
                    socket.emit('message', message.value, id)
                    message.value = ""
                }
            })
        })
    }
  }
};

chatObserver = new MutationObserver(chatCallback);

chatObserver.observe(message, config);

// we don't handle the `chat` event because it requires backend code to store the message in the database
// see events.py