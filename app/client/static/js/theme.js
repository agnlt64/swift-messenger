let themes = document.getElementsByName('theme-option')

function storeTheme(theme) {
    localStorage.setItem('theme', theme)
}

function getTheme() {
    let currentTheme = localStorage.getItem('theme')
    currentTheme = currentTheme !== null ? currentTheme : 'light'
    themes.forEach(theme => {
        if (currentTheme === theme.id) {
            theme.checked = true
            document.body.setAttribute('theme', currentTheme)
        }
    })
}

const themeObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type == "childList") {
            themes = document.getElementsByName('theme-option')
            getTheme()
            themes.forEach(theme => {
                theme.addEventListener('click', () => {
                    storeTheme(theme.id)
                    document.body.setAttribute('theme', theme.id)
                })
            })          
        }
    }
})

themeObserver.observe(document.body, { attributes: true, childList: true, subtree: true })