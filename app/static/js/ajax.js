const xhr = new XMLHttpRequest()

const config = { attributes: true, childList: true, subtree: true };

const indexCallback = (mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
        if (window.location.pathname === '/login' || window.location.pathname === '/sign-up') {
            window.addEventListener('popstate', (event) => {
                const url = window.location.pathname
                xhr.open('GET', url, true)
                xhr.onload = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        document.body.innerHTML = xhr.responseText
                    }
                }
                xhr.send()
                window.history.pushState({ prevUrl: window.location.href }, '', url)
            })
        }
        else if (window.location.pathname === '/') {
            const buttons = document.querySelectorAll('.btn')
            buttons.forEach(b => {
                b.addEventListener('click', () => {
                    const url = b.getAttribute('url')
                    xhr.open('GET', url, true)
                    xhr.onload = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            document.body.innerHTML = xhr.responseText
                        }
                    }
                    xhr.send()
                    window.history.pushState({ prevUrl: window.location.href }, '', url)
                })
            })
        }
    }
  }
};

const indexObserver = new MutationObserver(indexCallback);

indexObserver.observe(document.body, config);