const xhr = new XMLHttpRequest()
const separator = '<body'

const config = { attributes: true, childList: true, subtree: true };

function loadAjax(method, url, data=null) {
    xhr.open(method, url, true)
    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const splitResponse = xhr.responseText.split(separator)
            document.querySelector('head').innerHTML = splitResponse[0]
            document.body.innerHTML = separator + splitResponse[1]
        }
    }
    xhr.send(data)
    window.history.pushState({ prevUrl: window.location.href }, '', url)
}

function go(linkId, to) {
    const from = document.getElementById(linkId)
    from.addEventListener('click', event => {
        event.preventDefault()
        loadAjax('GET', to)
    })
}

const globalCallback = mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            if (window.location.pathname === '/login' || window.location.pathname === '/sign-up') {
                window.addEventListener('popstate', () => {
                    loadAjax('GET', window.location.pathname)
                })
            }
            else if (window.location.pathname === '/') {
                const buttons = document.querySelectorAll('a')
                buttons.forEach(b => {
                    b.addEventListener('click', (event) => {
                        event.preventDefault()
                        loadAjax('GET', b.getAttribute('href'))
                    })
                })
            }
            // settings
            else if (window.location.pathname === '/chat') {
                go('settings-link', '/settings')
            }
            // go back to chat from settings
            else if (window.location.pathname === '/settings') {
                go('chat-link', '/chat')
            }
        }
    }
};

const globalObserver = new MutationObserver(globalCallback)

globalObserver.observe(document.body, config)