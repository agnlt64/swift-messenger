// let manageGroup = document.getElementById('manage-group')
// let showManage = document.getElementById('show-manage')

const manageGroupObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type == 'childList') {
            try {
                let manageGroup = document.getElementById('manage-group')
                let showManage = document.getElementById('show-manage')
    
                showManage.addEventListener('click', () => {
                    manageGroup.showModal()
                })
            }
            catch (error) {
                
            }
        }
    }
})

manageGroupObserver.observe(document.body, config)