/**
 * observer code from here:
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */

const allGroups = document.querySelectorAll('.group span')

const groupContainer = document.getElementById('group-container')
const config = { attributes: true, childList: true, subtree: true };

const groupCallback = (mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
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
  }
};

const groupObserver = new MutationObserver(groupCallback);

groupObserver.observe(groupContainer, config);