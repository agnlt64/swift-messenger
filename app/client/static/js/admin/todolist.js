
const adminTodlistObersver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            try {
                const allPriorities = document.querySelectorAll('.priority')
                allPriorities.forEach(priority => {
                    priority.addEventListener('click', () => {
                        const parent = priority.parentElement
                        const arrow = parent.children[0].children[1]
                        const dropdown = parent.children[1]
                        arrow.classList.add('rotate')
                        dropdown.classList.remove('invisible')
                    })
                })
            } catch {
                
            }
        }
    }
})

adminTodlistObersver.observe(document.body, config)