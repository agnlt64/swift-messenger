const searchObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            try {
                // get the groups before the search input is very important
                const groupNodes = document.querySelectorAll('.group')
                let groups = []
                groupNodes.forEach(group => {
                    groups.push({
                        name: group.querySelector('.group-name').innerHTML,
                        element: group
                    })
                })

                const searchInput = document.querySelector('[data-search-groups]')
                searchInput.addEventListener('input', e => {
                    const value = e.target.value.toLowerCase()
                    groups.forEach(group => {
                        const visible = group.name.includes(value)
                        group.element.classList.toggle('invisible', !visible)
                    })
                })
            }
            catch (error) {
                // we are not at the correct page
            }
        }
    }
})

searchObserver.observe(document.body, config)