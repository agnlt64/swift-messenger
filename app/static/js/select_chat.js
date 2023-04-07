const allGroups = document.querySelectorAll('.group span')

allGroups.forEach(group => {
    group.parentElement.addEventListener('click', () => {
        allGroups.forEach(g => {
            g.parentElement.classList.remove('active')
        })
        group.parentElement.classList.add('active')
    })
})