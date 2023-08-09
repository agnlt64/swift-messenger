const xhr = new XMLHttpRequest()
const separator = '<body'

const config = { attributes: true, childList: true, subtree: true }

function ajax(method, url, requestData={}) {
    xhr.open(method, url, true)
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const splitResponse = xhr.responseText.split(separator)
            document.querySelector('head').innerHTML = splitResponse[0]
            document.body.innerHTML = separator + splitResponse[1]
            // the new URL must be created here
            window.history.pushState({ prevUrl: window.location.href }, '', xhr.responseURL)
        }
    }
    xhr.onprogress = event => {
        // add a progress bar
        document.getElementById('progress-bar').style.width = `${(event.loaded / event.total) * 100}%`
    }
    xhr.send(JSON.stringify(requestData))
}

const globalCallback = mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            // specific actions if the url contains /chat/...
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

            }

            // specific actions for authentication
            if (window.location.pathname === '/login' || window.location.pathname === '/sign-up') {
                const authForms = document.querySelectorAll('.form')
                authForms.forEach(form => form.addEventListener('submit', e => {
                    e.preventDefault()
                    // same fields for both pages
                    const username = document.getElementById('username').value
                    const password = document.getElementById('password').value
                    // base64 encoding for password
                    const passwordBytes = new TextEncoder().encode(password)
                    let confirm = null
                    if (window.location.pathname === '/sign-up') {
                        confirm = document.getElementById('confirm').value
                    }
                    const credentials = {
                        'username': username,
                        'password': btoa(String.fromCharCode.apply(null, passwordBytes)),
                        'confirm': confirm === null ? '' : confirm
                    }
                    ajax(form.method, form.action, credentials)
                }))
            }

            const links = document.querySelectorAll('a')
            links.forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault()
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