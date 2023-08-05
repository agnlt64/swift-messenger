const xhr = new XMLHttpRequest()
const separator = '<body'

const config = { attributes: true, childList: true, subtree: true }

function ajax(method, url, requestData={'data': null, 'updateURL': true}) {
    xhr.open(method, url, true)
    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const splitResponse = xhr.responseText.split(separator)
            document.querySelector('head').innerHTML = splitResponse[0]
            document.body.innerHTML = separator + splitResponse[1]
        }
    }
    xhr.onprogress = event => {
        // add a progress bar
        document.getElementById('progress-bar').style.width = `${(event.loaded / event.total) * 100}%`
    }
    xhr.send(requestData['data'])
    if (requestData['updateURL']) {
        window.history.pushState({ prevUrl: window.location.href }, '', url)
    }
}

const globalCallback = mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            // specific actions if the url contains /chat/...
            if (window.location.pathname.includes('/chat/')) {
                try {
                    const chatArea = document.getElementById('messages-container')
                    chatArea.scrollTo(0, chatArea.scrollHeight)

                    // delete a message without reloading
                    const deleteMessageButtons = document.getElementsByName('delete-message-btn')
                    deleteMessageButtons.forEach(button => button.addEventListener('click', e => {
                            e.preventDefault()
                            const form = button.parentElement
                            const requestData = {
                                'data': null,
                                'updateURL': false,
                            }
                            ajax(form.method, form.action, requestData)
                    }))
                }
                catch (error) {
                    // unreachable
                }
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