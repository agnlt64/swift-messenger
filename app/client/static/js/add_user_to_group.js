
let users = []

try {
    // using templates
    const memberTemplate = document.querySelector('[data-member-template]')
    const membersContainer = document.querySelector('[data-members-container]')

    fetch('/api/users/all')
        .then(res => res.json())
        .then(data => {
            users = data.map(user => {
                const newMember = memberTemplate.content.cloneNode(true).children[0]

                // populate the template
                const profilePicture = newMember.querySelector('[data-profile-picture]')
                const username = newMember.querySelector('[data-member-name]')

                profilePicture.src = `/static/${user.profile_picture}`
                username.textContent = user.name

                membersContainer.appendChild(newMember)

                return {
                    name: user.name,
                    profilePicture: user.profile_picture,
                    role: user.role,
                    chatGroups: user.chat_groups,
                    joinDate: user.join_date,
                    element: newMember
                }
            })
        })
}
catch {}

function toggleSearchField() {
    const addButton = document.querySelector('.title-container .bx-plus')
    const searchUserField = document.getElementById('new-user')
    const membersContainer = document.querySelector('[data-members-container]')
    const actualGroupMembers = document.querySelectorAll('.members .member:not([data-user-list])')

    searchUserField.addEventListener('input', e => {
        const value = e.target.value
        users.forEach(user => {
            const visible = user.name.includes(value)
            membersContainer.toggleAttribute('data-showing-users', value !== '')
            user.element.classList.toggle('invisible', !visible)
            actualGroupMembers.forEach(m => m.classList.add('invisible'))
        })
    })
    searchUserField.addEventListener('blur', () => {
        actualGroupMembers.forEach(m => m.classList.remove('invisible'))
        users.forEach(user => user.element.classList.add('invisible'))
    })

    addButton.addEventListener('click', () => {
        searchUserField.classList.toggle('invisible')
    })
}

try {
    toggleSearchField()
}
catch (error) {
    // we are not at the correct page
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