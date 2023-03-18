const createRoom = document.getElementById('create-room-btn')
const roomForm = document.getElementById('room-form')
const closeBtn = document.getElementById('room-close-btn')

createRoom.addEventListener('click', () => {
    roomForm.showModal()
})

closeBtn.addEventListener('click', () => {
    roomForm.close()
})