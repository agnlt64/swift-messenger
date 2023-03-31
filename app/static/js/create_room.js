const createRoom = document.getElementById('create-room-btn')
const roomForm = document.getElementById('room-form')
const closeBtn = document.getElementById('room-close-btn')
const errorMsg = document.getElementById('error-message')
const roomName = document.getElementById('room-name')

createRoom.addEventListener('click', () => {
    roomForm.showModal()
})

roomName.addEventListener('input', () => {
    if (Number(roomName.value.length) > 100) {
        errorMsg.style.display = 'block'
    } else {
        errorMsg.style.display = 'none'
    }
})

closeBtn.addEventListener('click', () => {
    roomForm.close()
})