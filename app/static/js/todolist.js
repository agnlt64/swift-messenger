// todolist context menu
todolistButtons = document.querySelectorAll('.bx-dots-vertical-rounded')
addButton = document.querySelector('.bx-plus')
newTaskForm = document.getElementById('new-task-form')

deleteButtons = document.getElementsByName('delete')
updateTaskForm = document.getElementById('update-task-form')

todolistButtons.forEach(element => {
    element.addEventListener('click', event => {
        let dialog = element.parentElement.querySelector('.context-menu')
        // the dialog is closed and no element with the id context-menu exists
        if (!dialog.hasAttribute('open') && !document.getElementById('context-menu')) {
            dialog.style.display = 'flex'
            // we set the id here to open only one dialog at a time
            dialog.setAttribute('id', 'context-menu')
            dialog.style.top = `${event.pageY + 15}px`
            dialog.show()
        } else {
            dialog.style.display = 'none'
            dialog.close()
            // we reset the id to open another dialog
            dialog.id = 'closed'
        }
    })  
})

addButton.addEventListener('click', () => {
    newTaskForm.showModal()
})

deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        updateTaskForm.showModal()
    })
})