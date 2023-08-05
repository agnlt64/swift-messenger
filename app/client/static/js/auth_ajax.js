const authObserver = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            // same for login and signup
            if (window.location.pathname === '/login' || window.location.pathname === '/sign-up') {
                authForm = document.querySelector("form")
                authForm.onsubmit = (event) => {
                    event.preventDefault()
                    data = []
                    for (const children of authForm.children) {
                        for (const elt of children.children) {
                            if (elt.tagName.toLowerCase() === "input") {
                                data.push(elt.value)
                            }
                        }
                    }
                    ajax(authForm.method, authForm.action, (data = data))
                }
            }
        }
    }
})

authObserver.observe(document.body, config)
