
const closeMessageObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            try {
                closeMessage = document.getElementById('close-message')
                
                closeMessage.addEventListener('click', () => {
                    document.getElementById('message').style.display = 'none'
                    document.getElementById('close-message').style.display = 'none'
                })
            }
            catch (error) {
                
            }
        }
    }
})

closeMessageObserver.observe(document.body, config)