const user = document.getElementById('user').getAttribute('data-user')

document.addEventListener('DOMContentLoaded', function() {
    const socket = io.connect('http://localhost:8080')
    const message = document.getElementById('message')

    socket.on('message', function(data) {
        const p = document.createElement('p')
        p.innerHTML = `${user}: ${data}`
        document.getElementById('messages-container').appendChild(p)
    })

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement === message) {
            socket.send(message.value)
            message.value = ''
        }
    })
})