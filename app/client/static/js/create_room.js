let createRoom = document.getElementById("create-room-btn");
let roomForm = document.getElementById("room-form");
let chooseImage = document.getElementById("choose-image");
let chooseImageInput = document.getElementById("choose-image-input");
let closeBtn = document.getElementById("room-close-btn");
let errorMsg = document.getElementById("error-message");
let roomName = document.getElementById("room-name");
let submitForm = document.getElementById("submit-form");

const roomObserver = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            try {
                createRoom = document.getElementById("create-room-btn");
                roomForm = document.getElementById("room-form");
                chooseImage = document.getElementById("choose-image");
                chooseImageInput = document.getElementById("choose-image-input");
                closeBtn = document.getElementById("room-close-btn");
                errorMsg = document.getElementById("error-message");
                roomName = document.getElementById("room-name");
                submitForm = document.getElementById("submit-form");

                // show the room creation dialog
                createRoom.addEventListener("click", () => {
                    roomForm.showModal();
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
                    newImage.setAttribute("name", "new-image");
                    imgContainer.appendChild(newImage);
                    roomForm.style.height = "25rem";
                    };
                    reader.readAsDataURL(image);
                });
                
                // error handling
                roomName.addEventListener("input", () => {
                    if (Number(roomName.value.length) > 100) {
                    errorMsg.style.display = "flex";
                    } else {
                    errorMsg.style.display = "none";
                    }
                });

                // close dialog box
                closeBtn.addEventListener("click", () => {
                    roomForm.close();
                });

                submitForm.addEventListener("click", () => {
                    if (roomName.value !== "" && document.getElementById("new-img-container").innerHTML !== "") {
                        roomForm.close();
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