const closeMessage = document.getElementById('close-message')

closeMessage.addEventListener('click', () => {
    document.getElementById('message').style.display = 'none'
    document.getElementById('close-message').style.display = 'none'
})