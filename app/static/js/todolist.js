// todolist context menu
const todolistButtons = document.querySelectorAll('.bx-dots-vertical-rounded')
const dialog = document.getElementById('dialog')

todolistButtons.forEach(elt => {
    elt.addEventListener('click', () => {
        if (!dialog.hasAttribute('open')) {
            dialog.show()
        } else {
            dialog.close()
        }
    })
})