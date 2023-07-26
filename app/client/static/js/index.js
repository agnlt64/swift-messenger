/**
 * The client-side code only emits events and all these
 * events are handled in the `events.py` file.
 */

// no need for let or const since this script will we included multiple times in the same page because I suck at designing correct apps
const socket = io()

const chatCallback = (mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
        try {
            const sendMessage = document.getElementById('send-message-form')
            const chatArea = document.getElementById('messages-container')
            sendMessage.addEventListener('submit', e => {
                e.preventDefault()
                message = document.getElementById('message')
                socket.emit('message', message.value, sendMessage.getAttribute('data-current-chat-group'))
                message.value = ""
                chatArea.scrollTo(0, chatArea.scrollHeight)
            })
        }
        catch (error) {
            // it works anyway sont dont care
        }
    }
  }
};

const chatObserver = new MutationObserver(chatCallback);

chatObserver.observe(document.body, config);