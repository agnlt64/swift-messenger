const passwordObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            try {
                const showPassword = document.querySelectorAll('.password i')
                let showed = false
                showPassword.forEach(icon => icon.addEventListener('click', () => {
                    // password was hidden, we show it now
                    if (!showed) {
                        showed = true
                        icon.classList = 'bx bxs-low-vision'
                        // get the input field representing the password
                        icon.parentElement.children[0].type = 'text'
                    }
                    else {
                        showed = false
                        icon.classList = 'bx bxs-show'
                        icon.parentElement.children[0].type = 'password'
                    }
                }))
            }
            catch (error) {
                // we are not at the correct page
            }
        }
    }
})

passwordObserver.observe(document.body, config)