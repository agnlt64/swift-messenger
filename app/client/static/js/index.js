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

function buildMessage(username, content, id) {
    // using html templates to create a new message instead of creating each element by hand
    const messageTemplate = document.querySelector('[data-message-template]')
    const newMessage = messageTemplate.content.cloneNode(true).children[0]

    const messageSender = newMessage.querySelector('[data-message-sender]')
    messageSender.textContent = username

    const messageValue = newMessage.querySelector('[data-message-content]')
    messageValue.value = content

    const editMessage = newMessage.querySelector('[data-edit-message]')
    editMessage.action = `/api/chat/message/edit/${id}`

    const deleteMessage = newMessage.querySelector('[data-delete-message]')
    deleteMessage.action = `/api/chat/message/delete/${id}`

    return newMessage
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
                        const msgComponent = buildMessage(username, message.value, parseInt(sendMessage.getAttribute('data-last-id')) + 1)
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