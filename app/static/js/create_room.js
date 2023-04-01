const createRoom = document.getElementById('create-room-btn')
const roomForm = document.getElementById('room-form')
const chooseImage = document.getElementById('choose-image')
const chooseImageInput = document.getElementById('choose-image-input')
const closeBtn = document.getElementById('room-close-btn')
const errorMsg = document.getElementById('error-message')
const roomName = document.getElementById('room-name')

// 30rem -> *16 to convert in pixels
const ROOM_FORM_WIDTH = 30 * 16
const ROOM_FORM_HEIGHT = 25 * 16

// show the room creation dialog
createRoom.addEventListener('click', () => {
    roomForm.style.left = `${window.innerWidth / 2 - ROOM_FORM_WIDTH / 2}px`
    roomForm.style.top = `${window.innerHeight / 2 - ROOM_FORM_HEIGHT / 2}px`
    roomForm.showModal()
})

// pick an image
chooseImage.addEventListener('click', () => {
    chooseImageInput.click()
})

chooseImageInput.addEventListener('change', () => {
    const image = chooseImageInput.files[0]
    const reader = new FileReader()
    reader.onload = () => {
        const imgContainer = document.getElementById('new-img-container')
        // remove duplicate images
        imgContainer.querySelectorAll('img').forEach(img => img.remove())
        const newImage = document.createElement('img')
        newImage.src = reader.result
        newImage.setAttribute('name', 'new-image')
        imgContainer.appendChild(newImage)
        roomForm.style.height = '25rem'
    }
    reader.readAsDataURL(image)
})

// error handling
roomName.addEventListener('input', () => {
    if (Number(roomName.value.length) > 100) {
        errorMsg.style.display = 'flex'
    } else {
        errorMsg.style.display = 'none'
    }
})

// close dialog box
closeBtn.addEventListener('click', () => {
    roomForm.close()
})