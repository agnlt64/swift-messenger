/**
 * observer code from here:
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */

let groupContainer = document.getElementById('group-container')
let allGroups = document.querySelectorAll('.group span')

const groupObserver = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            try {
                allGroups = document.querySelectorAll('.group span')
                allGroups.forEach(group => {
                        group.parentElement.addEventListener('click', () => {
                        allGroups.forEach(g => {
                            g.parentElement.classList.remove('active')
                        })
                        group.parentElement.classList.add('active')
                    })
                })
            }
            catch {
                // we are not at the correct page
            }
        }
    }
});

groupObserver.observe(groupContainer !== null ? groupContainer : document.body, { attributes: true, childList: true, subtree: true });