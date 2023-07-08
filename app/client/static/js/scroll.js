const navbar = document.getElementById('navbar')
let shadow = false

window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        navbar.classList.add('shadow')
    } else {
        navbar.classList.remove('shadow')
    }
})