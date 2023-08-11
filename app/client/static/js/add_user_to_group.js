
let users = []

function toggleSearchField() {
    fetch('/api/users/all')
        .then(res => res.json())
        .then(data => {
            users = data.map(user => {
                console.log(user)
                users.push({
                    name: user.name,
                    profilePicture: user.profile_picture,
                    role: user.role,
                    chatGroups: user.chat_groups,
                    joinDate: user.join_date
                })
            })
        })
    const addButton = document.querySelector('.title-container i')
    const searchuserField = document.getElementById('new-user')
    addButton.addEventListener('click', () => {
        searchuserField.classList.toggle('invisible')
    })
    searchuserField.addEventListener('input', () => {
        
    })
}

const addUserToGroupObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            try {
                toggleSearchField()
            }
            catch (error) {
                // we are not at the correct page
            }
        }
    }
})

addUserToGroupObserver.observe(document.body, config)