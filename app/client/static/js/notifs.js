let notifsOptions = document.getElementsByName('notif-option')

function storeNotifsPrefs(prefs) {
    localStorage.setItem('notifsPrefs', prefs)
}

function getNotifsPrefs() {
    let currentPrefs = localStorage.getItem('notifsPrefs')
    currentPrefs = currentPrefs !== null ? currentPrefs : 'top'
    notifsOptions.forEach(opt => {
        if (currentPrefs === opt.id) {
            opt.checked = true
            document.body.setAttribute('notifs', currentPrefs)
        }
    })
}

const notifsObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type == "childList") {
            notifsOptions = document.getElementsByName('notif-option')
            getNotifsPrefs()
            notifsOptions.forEach(opt => {
                opt.addEventListener('click', () => {
                    storeNotifsPrefs(opt.id)
                    document.body.setAttribute('notifs', opt.id)
                })
            })         
        }
    }
})

notifsObserver.observe(document.body, { attributes: true, childList: true, subtree: true })