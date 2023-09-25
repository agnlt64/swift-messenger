let themes = document.getElementsByName('theme-option')
let layouts = document.getElementsByName('layout-option')

function storeTheme(theme) {
    localStorage.setItem('theme', theme)
}

function storeLayout(layout) {
    localStorage.setItem('layout', layout)
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

function getLayout() {
    let currentLayout = localStorage.getItem('layout')
    currentLayout = currentLayout !== null ? currentLayout : 'blue'
    layouts.forEach(layout => {
        if (currentLayout === layout.id) {
            layout.checked = true
            document.body.setAttribute('layout', currentLayout)
        }
    })
}

const themeObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type == "childList") {
            themes = document.getElementsByName('theme-option')
            layouts = document.getElementsByName('layout-option')
            getTheme()
            getLayout()
            themes.forEach(theme => {
                theme.addEventListener('click', () => {
                    storeTheme(theme.id)
                    document.body.setAttribute('theme', theme.id)
                })
            })
            layouts.forEach(layout => {
                layout.addEventListener('click', () => {
                    storeLayout(layout.id)
                    document.body.setAttribute('layout', layout.id)
                })
            })         
        }
    }
})

themeObserver.observe(document.body, { attributes: true, childList: true, subtree: true })