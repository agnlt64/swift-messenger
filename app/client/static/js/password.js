
function matchRules(password) {
    return (
        password.length > 10 &&
        // an uppercase letter
        /[A-Z]/.test(password) &&
        // a number
        /\d/.test(password)
    )
}

const passwordObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            try {
                // show the passwords
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

                // check if the passwords match the rules
                const passwords = document.querySelectorAll('input[type=password]')
                const submit = document.querySelector('button[type=submit]')
                const rules = document.querySelector('.password-rules')
                passwords.forEach(password => password.addEventListener('input', () => {
                    submit.toggleAttribute('disabled', !matchRules(password.value))
                    rules.classList.toggle('match', matchRules(password.value))
                }))
            }
            catch (error) {
                // we are not at the correct page
            }
        }
    }
})

passwordObserver.observe(document.body, config)