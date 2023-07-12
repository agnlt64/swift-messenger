let selectImage = document.getElementById("choose-image");
let selectImageInput = document.getElementById("choose-image-input");

const profilePictureObserver = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            try {
                selectImage = document.getElementById("choose-image");
                selectImageInput = document.getElementById("choose-image-input");
                
                selectImage.addEventListener("click", () => {
                    selectImageInput.click();
                });
    
                selectImageInput.addEventListener("change", () => {
                    const image = selectImageInput.files[0];
                    const reader = new FileReader();
                    reader.onload = () => {
                    const imgContainer = document.getElementById("new-img-container");
                    // remove duplicate images
                    imgContainer.querySelectorAll("img").forEach((img) => img.remove());
                    const newImage = document.createElement("img");
                    newImage.src = reader.result;
                    newImage.classList.add("new-profile-picture");
                    newImage.setAttribute("name", "new-image");
                    imgContainer.appendChild(newImage);
                    };
                    reader.readAsDataURL(image);
                });
            }
            catch (error) {
                // we are not at the correct page
            }
        }
    }
});


profilePictureObserver.observe(document.body, { attributes: true, childList: true, subtree: true })