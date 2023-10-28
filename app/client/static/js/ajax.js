const xhr = new XMLHttpRequest()
const separator = '<body'

const config = { attributes: true, childList: true, subtree: true }

function ajax(method, url, requestData = {}, targetElement = null) {
    const target = targetElement === null ? document.body : document.querySelector(targetElement)
    document.getElementById('spinner').style.display = 'flex'
    if (window.fetch) {
        fetch(url, {
            method: method,
            body: method.toUpperCase() === 'GET' ? null : JSON.stringify(requestData)
        })
            .then(res => {
                window.history.pushState({ prevUrl: window.location.href }, '', res.url)
                return res.text()
            })
            .then(html => {
                const split = html.split(separator)
                document.querySelector('head').innerHTML = split[0]
                if (targetElement === null) {
                    document.body.innerHTML = separator + split[1]
                } else {
                    document.querySelector(targetElement).innerHTML = separator + split[1]
                }
            })
    }
    else {
        xhr.open(method, url, true)
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const splitResponse = xhr.responseText.split(separator)
                document.querySelector('head').innerHTML = splitResponse[0]
                if (targetElement === null) {
                    document.body.innerHTML = separator + splitResponse[1]
                } else {
                    document.querySelector(targetElement).innerHTML = separator + splitResponse[1]
                }
                window.history.pushState({ prevUrl: window.location.href }, '', xhr.responseURL)
            }
        }
        xhr.send(JSON.stringify(requestData))
    }
}

function b64encode(string) {
    const bytes = new TextEncoder().encode(string)
    return btoa(String.fromCharCode.apply(null, bytes))
}

const globalCallback = mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            // specific actions if the url contains /chat...
            if (window.location.pathname.includes('/chat')) {
                try {
                    // scrolling to the end of the messages
                    const chatArea = document.getElementById('messages-container')
                    chatArea.scrollTo(0, chatArea.scrollHeight)
                }
                catch (error) {
                    // unreachable
                }

                // delete a message without reloading
                const deleteMessageButtons = document.getElementsByName('delete-message-btn')
                deleteMessageButtons.forEach(button => button.addEventListener('click', e => {
                    e.preventDefault()
                    const form = button.parentElement
                    ajax(form.method, form.action)
                }))

                // create a new chat group without reloading the page
                const submitForm = document.getElementById('create-group-form')
                submitForm.addEventListener('submit', e => {
                    e.preventDefault()
                    const groupName = document.getElementById('group-name').value
                    const newImageName = document.getElementById('choose-image-input').value
                    const newImageContent = document.getElementById('new-img-container').children[0].src
                    const groupData = {
                        'name': groupName,
                        'image_name': newImageName,
                        'image_content': newImageContent
                    }
                    ajax(submitForm.method, submitForm.action, groupData)
                })

                // submit the new value of an edited message
                const editMessageForms = document.getElementsByName('edit-message-form')
                editMessageForms.forEach(form => form.addEventListener('submit', e => {
                    e.preventDefault()
                    const messageValue = form.children[0].value
                    const messageData = {
                        'message': messageValue
                    }
                    ajax(form.method, form.action, messageData)
                }))
            }

            // changing the profile picture without reloading the page
            if (window.location.pathname === '/settings/profile-picture') {
                const newProfilePictureForm = document.getElementById('new-profile-picture')
                newProfilePictureForm.addEventListener('submit', e => {
                    e.preventDefault()
                    const newImageName = document.getElementById('choose-image-input').value
                    const newImageContent = document.getElementById('new-img-container').children[0].src
                    const groupData = {
                        'image_name': newImageName,
                        'image_content': newImageContent
                    }
                    ajax(newProfilePictureForm.method, newProfilePictureForm.action, groupData)
                })
            }

            // updating the password in the settings page without reloading the page
            if (window.location.pathname === '/settings/password') {
                // no need for an id since it is the only form in the page
                const changePasswordForm = document.querySelector('form')
                changePasswordForm.addEventListener('submit', e => {
                    e.preventDefault()
                    const oldPassword = document.getElementsByName('old-password')[0].value
                    const newPassword = document.getElementsByName('new-password')[0].value
                    const confirmNewPassword = document.getElementsByName('confirm-new-password')[0].value
                    const credentials = {
                        'old_password': b64encode(oldPassword),
                        'new_password': b64encode(newPassword),
                        'confirm_new_password': b64encode(confirmNewPassword),
                    }
                    ajax(changePasswordForm.method, changePasswordForm.action, credentials)
                })
            }

            // specific actions for authentication
            if (window.location.pathname === '/login' || window.location.pathname === '/sign-up') {
                const authForms = document.querySelectorAll('.form')
                authForms.forEach(form => form.addEventListener('submit', e => {
                    e.preventDefault()
                    // same fields for both pages
                    const username = document.getElementById('username').value
                    const password = document.getElementById('password').value
                    let confirm = null
                    if (window.location.pathname === '/sign-up') {
                        confirm = document.getElementById('confirm').value
                    }
                    const credentials = {
                        'username': username,
                        'password': b64encode(password),
                        'confirm': confirm === null ? '' : b64encode(confirm)
                    }
                    ajax(form.method, form.action, credentials)
                }))
            }

            const links = document.querySelectorAll('a')
            links.forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault()
                    // const target = window.location.pathname.includes('/chat') ? '#chat-area' : null
                    ajax('GET', link.href)
                })
            })
            window.addEventListener('popstate', () => {
                ajax('GET', window.location.pathname)
            })
        }
    }
}

const globalObserver = new MutationObserver(globalCallback)

globalObserver.observe(document.body, config)