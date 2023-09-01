
const closeMessageObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            try {
                const closeMessage = document.querySelectorAll('[data-action=close]')
                
                closeMessage.forEach(close => {
                    close.addEventListener('click', () => {
                        if (close.parentElement.tagName === 'DIALOG') {
                            close.parentElement.close()
                        } else {
                            close.parentElement.style.display = 'none'
                        }
                    })
                })
            }
            catch (error) {
                
            }
        }
    }
})

closeMessageObserver.observe(document.body, config)