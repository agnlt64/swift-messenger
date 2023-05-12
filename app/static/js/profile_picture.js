const selectImage = document.getElementById('choose-image')
const selectImageInput = document.getElementById('choose-image-input')

selectImage.addEventListener('click', () => {
    selectImageInput.click()
})

selectImageInput.addEventListener('change', () => {
    const image = selectImageInput.files[0]
    const reader = new FileReader()
    reader.onload = () => {
        const imgContainer = document.getElementById('new-img-container')
        // remove duplicate images
        imgContainer.querySelectorAll('img').forEach(img => img.remove())
        const newImage = document.createElement('img')
        newImage.src = reader.result
        newImage.setAttribute('name', 'new-image')
        imgContainer.appendChild(newImage)
    }
    reader.readAsDataURL(image)
})