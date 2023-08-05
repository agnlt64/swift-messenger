let allMessages = document.getElementsByName('edit-message')
let globValue = null;

function editMessages(messageDiv) {
    messageDiv.forEach(message => message.addEventListener('click', e => {
        e.preventDefault()
        const messageDiv = message.parentElement.parentElement
        const infosContainer = messageDiv.children[1]
        const messageContent = infosContainer.children[1].children[0]
        if (messageContent.disabled) {
            messageContent.disabled = false
            messageContent.focus()
            globValue = messageContent.value
        }
        else {
            messageContent.disabled = true
            messageContent.value = globValue
        }
        // messageContent.disabled ? messageContent.disabled = false : messageContent.disabled = true
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