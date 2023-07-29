let createRoom = document.getElementById("new-chat-group-btn");
let newGroupForm = document.getElementById("new-group-form");
let chooseImage = document.getElementById("choose-image");
let chooseImageInput = document.getElementById("choose-image-input");
let closeBtn = document.getElementById("group-close-btn");
let errorMsg = document.getElementById("error-message");
let groupName = document.getElementById("group-name");
let submitForm = document.getElementById("submit-form");

const roomObserver = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            try {
                createRoom = document.getElementById("new-chat-group-btn");
                newGroupForm = document.getElementById("new-group-form");
                chooseImage = document.getElementById("choose-image");
                chooseImageInput = document.getElementById("choose-image-input");
                closeBtn = document.getElementById("group-close-btn");
                errorMsg = document.getElementById("error-message");
                groupName = document.getElementById("group-name");
                submitForm = document.getElementById("submit-form");

                // show the room creation dialog
                createRoom.addEventListener("click", () => {
                    newGroupForm.showModal();
                });

                // pick an image
                chooseImage.addEventListener("click", () => {
                    chooseImageInput.click();
                });

                chooseImageInput.addEventListener("change", () => {
                    const image = chooseImageInput.files[0];
                    const reader = new FileReader();
                    reader.onload = () => {
                        const imgContainer = document.getElementById("new-img-container");
                        // remove duplicate images
                        imgContainer.querySelectorAll("img").forEach((img) => img.remove());
                        const newImage = document.createElement("img");
                        newImage.src = reader.result;
                        newImage.className = 'new-group-picture'
                        newImage.setAttribute("name", "new-image");
                        imgContainer.appendChild(newImage);
                    };
                    reader.readAsDataURL(image);
                });
                
                // error handling
                groupName.addEventListener("input", () => {
                    if (Number(groupName.value.length) > 100) {
                    errorMsg.style.display = "flex";
                    } else {
                    errorMsg.style.display = "none";
                    }
                });

                // close dialog box
                closeBtn.addEventListener("click", () => {
                    newGroupForm.close();
                });

                submitForm.addEventListener("click", () => {
                    if (groupName.value !== "" && document.getElementById("new-img-container").innerHTML !== "") {
                        newGroupForm.close();
                    }
                });
            }
            catch (error) {
                // we are not at the correct page
            }
        }
    }
});

roomObserver.observe(document.body, { attributes: true, childList: true, subtree: true })