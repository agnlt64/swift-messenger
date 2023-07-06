/**
 * observer code from here:
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */

const groupContainer = document.getElementById('group-container')

let allGroups = document.querySelectorAll('.group span')

allGroups.forEach(group => {
  group.parentElement.addEventListener('click', () => {
    allGroups.forEach(g => {
      g.parentElement.classList.remove('active')
    })
    group.parentElement.classList.add('active')
  })
})

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

// config is defined in ajax.js
groupObserver.observe(groupContainer, config);