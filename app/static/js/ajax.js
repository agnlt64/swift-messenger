const buttons = document.querySelectorAll('.btn')
const xhr = new XMLHttpRequest()

buttons.forEach(b => {
    b.addEventListener('click', () => {
        const url = b.getAttribute('url')
        xhr.open('GET', url, true)
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.write(xhr.responseText)
            }
        }
        xhr.send()
        window.history.pushState({ prevUrl: window.location.href }, '', url)
    })
})

window.addEventListener('popstate', () => {
    console.log('page changed')
})