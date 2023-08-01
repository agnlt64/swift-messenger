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
    // add a progress bar
    document.getElementById('progress-bar').style.width = '100%'
    xhr.send(data)
    window.history.pushState({ prevUrl: window.location.href }, '', url)
}

// this function will probably die soon
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
            // specific action if the url contains /chat/...
            if (window.location.pathname.includes('/chat/')) {
                try {
                    const chatArea = document.getElementById('messages-container')
                    chatArea.scrollTo(0, chatArea.scrollHeight)
                }
                catch (error) {
                    // unreachable
                }
            }
            const links = document.querySelectorAll('a')
            links.forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault()
                    loadAjax('GET', link.href)
                })
            })
            window.addEventListener('popstate', () => {
                loadAjax('GET', window.location.pathname)
            })
        }
    }
};

const globalObserver = new MutationObserver(globalCallback)

globalObserver.observe(document.body, config)