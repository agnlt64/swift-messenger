const xhr = new XMLHttpRequest()

const config = { attributes: true, childList: true, subtree: true };

function loadAjax(method, url) {
    xhr.open(method, url, true)
    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // create a temporary element to parse the responseText
            const tmp = document.createElement('div')
            tmp.innerHTML = xhr.responseText
            // get the head and body content using the tmp element we created
            const headContent = tmp.getElementsByClassName('wrapper')[0].innerHTML
            const bodyContent = tmp.querySelector('main').innerHTML
            // change head
            document.querySelector('head').innerHTML = headContent
            // update the previous container with the newly parsed body
            if (window.location.pathname !== '/settings') {
                document.getElementById('container').innerHTML = bodyContent
            } 
            else {
                
            }
        }
    }
    xhr.send()
    window.history.pushState({ prevUrl: window.location.href }, '', url)
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
                const buttons = document.querySelectorAll('.btn')
                buttons.forEach(b => {
                    b.addEventListener('click', () => {
                        const url = b.getAttribute('url')
                        loadAjax('GET', url)
                    })
                })
            }
            // settings
            else if (window.location.pathname === '/chat') {
                const settingsLink = document.getElementById('settings-link')
                settingsLink.addEventListener('click', e => {
                    e.preventDefault()
                    const url = '/settings'
                    loadAjax('GET', url)
                })
            }
        }
    }
};

const globalObserver = new MutationObserver(globalCallback)

globalObserver.observe(document.body, config)