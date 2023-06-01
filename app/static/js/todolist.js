// todolist context menu
todolistButtons = document.querySelectorAll('.bx-dots-vertical-rounded')
addButton = document.querySelector('.bx-plus')
newTaskForm = document.getElementById('new-task-form')
close = document.getElementById('close')
closeUpdateBox = document.getElementById('close-update-box')

// 30rem -> *16 to convert in pixels
DIALOG_FORM_WIDTH = 15 * 16
DIALOG_FORM_HEIGHT = 8 * 16

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
    newTaskForm.style.display = 'block'
    newTaskForm.style.left = `${window.innerWidth / 2 - DIALOG_FORM_WIDTH/ 2}px`
    newTaskForm.style.top = `${window.innerHeight / 2 - DIALOG_FORM_HEIGHT / 2}px`
    newTaskForm.showModal()
})

close.addEventListener('click', () => {
    newTaskForm.style.display = 'none'
    newTaskForm.close()
})

closeUpdateBox.addEventListener('click', () => {
    updateTaskForm.style.display = 'none'
    updateTaskForm.close()
})

deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        updateTaskForm.style.left = `${window.innerWidth / 2 - DIALOG_FORM_WIDTH/ 2}px`
        updateTaskForm.style.top = `${window.innerHeight / 2 - DIALOG_FORM_HEIGHT / 2}px`
        updateTaskForm.style.display = 'block'
        updateTaskForm.showModal()
    })
})