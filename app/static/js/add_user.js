addUserButton = document.getElementById('add-user')
userForm = document.getElementById('user-form')
closeButton = document.getElementById('user-close-btn')

addUserButton.addEventListener('click', () => {
    userForm.showModal()
})

closeButton.addEventListener('click', () => {
    userForm.close()
})