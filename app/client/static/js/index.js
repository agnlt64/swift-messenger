/**
 * The client-side code only emits events and all these
 * events are handled in the `events.py` file.
 */

function buildMessage(username, profilePicturePath, content) {
    // global message
    const msgDiv = document.createElement('div')
    msgDiv.className = 'message'

    // sender profile picture
    const profilePicture = document.createElement('img')
    profilePicture.src = `/static/${profilePicturePath}`
    profilePicture.className = 'message-profile-picture'
    msgDiv.appendChild(profilePicture)
    
    // container for content and username
    const infosContainer = document.createElement('div')
    infosContainer.className = 'infos-container'
    
    // username
    const usernameElement = document.createElement('p')
    usernameElement.className = 'message-username'
    usernameElement.innerHTML = username
    infosContainer.appendChild(usernameElement)
    
    // message content
    const messageElement = document.createElement('p')
    messageElement.innerHTML = content
    infosContainer.appendChild(messageElement)

    msgDiv.appendChild(infosContainer)
    return msgDiv
}

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
                // build a message component
                if (message.value !== '') {
                    const username = sendMessage.getAttribute('data-sender')
                    const profilePicture = sendMessage.getAttribute('data-profile-picture')
                    const msgComponent = buildMessage(username, profilePicture, message.value)
                    chatArea.appendChild(msgComponent)
                }
                message.value = ""
                chatArea.scrollTo(0, chatArea.scrollHeight)
            })
        }
        catch (error) {
            // it works anyway so dont care
        }
    }
  }
};

const chatObserver = new MutationObserver(chatCallback);

chatObserver.observe(document.body, config);