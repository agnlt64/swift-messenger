let allMessages = document.getElementsByName('edit-message')

function editMessages(messageDiv) {
    messageDiv.forEach(message => message.addEventListener('click', e => {
        e.preventDefault()
        const messageDiv = message.parentElement.parentElement
        const infosContainer = messageDiv.children[1]
        const messageContent = infosContainer.children[1].children[0]
        messageContent.disabled ? messageContent.disabled = false : messageContent.disabled = true
    }))
}

editMessages(allMessages)

const messageObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            try {
                allMessages = document.getElementsByName('edit-message')
                editMessages(allMessages)
            }
            catch (error) {
                // we are not at the correct page
            }
        }
    }
})

messageObserver.observe(document.body, config)