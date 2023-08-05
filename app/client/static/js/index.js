/**
 * The client-side code only emits events and all these
 * events are handled in the `events.py` file.
 */

function buildOption(formAction, iconClass, btnName) {
    const form = document.createElement('form')
    form.action = formAction
    form.method = 'post'
    const button = document.createElement('button')
    button.name = btnName
    const icon = document.createElement('i')
    icon.className = iconClass
    button.appendChild(icon)
    form.appendChild(button)
    return form
}

function buildMessage(username, profilePicturePath, content, id) {
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
    const messageForm = document.createElement('form')
    messageForm.method = 'post'
    messageForm.action = `/api/chat/message/edit/${id}`
    const messageInput = document.createElement('input')
    messageInput.value = content
    messageInput.type = 'text'
    messageInput.name = 'message'
    messageInput.disabled = true
    messageForm.appendChild(messageInput)
    infosContainer.appendChild(messageForm)
    msgDiv.appendChild(infosContainer)

    // message options
    const optionsElement = document.createElement('div')
    optionsElement.className = 'options'
    const editOption = document.createElement('button')
    editOption.name = 'edit-message'
    const editIcon = document.createElement('i')
    editIcon.className = 'bx bx-edit'
    editOption.appendChild(editIcon)
    optionsElement.appendChild(editOption)
    // const deleteOption = buildOption(`/api/chat/message/delete/${id}`, 'bx bxs-trash', '')
    const deleteOption = document.createElement('form')
    deleteOption.action = `/api/chat/message/delete/${id}`
    deleteOption.method = 'post'
    const deleteButton = document.createElement('button')
    deleteButton.name = 'delete-message-btn'
    const icon = document.createElement('i')
    icon.className = 'bx bxs-trash'
    deleteButton.appendChild(icon)
    deleteOption.appendChild(deleteButton)
    optionsElement.append(deleteOption)

    msgDiv.appendChild(optionsElement)
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
                    const currentChatGroup =  sendMessage.getAttribute('data-current-chat-group')
                    // build a message component
                    if (message.value !== '') {
                        const username = sendMessage.getAttribute('data-sender')
                        const profilePicture = sendMessage.getAttribute('data-profile-picture')
                        const msgComponent = buildMessage(username, profilePicture, message.value, parseInt(sendMessage.getAttribute('data-last-id')) + 1)
                        socket.emit('message', message.value, currentChatGroup, username)
                        chatArea.appendChild(msgComponent)
                    }
                    message.value = ''
                    chatArea.scrollTo(0, chatArea.scrollHeight)
                })
            }
            catch (error) {
                // we are not at the correct page
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {        
        const chatArea = document.getElementById('messages-container')
        chatArea.scrollTo(0, chatArea.scrollHeight)
    }
    catch (error) {
        // don't care
    }
})

const chatObserver = new MutationObserver(chatCallback)

chatObserver.observe(document.body, config)