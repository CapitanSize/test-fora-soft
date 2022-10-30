const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000'],
    },
});

let users = []
let rooms = []

io.on('connection', socket => {
    socket.on('send-message', (message, room) => {
        socket.to(room).emit('receive-message', message)
    })
    socket.on('set-username', username => {
        socket.data.username = username
    })
    socket.on('join-room', async (room) => {
        socket.join(room)
        users = await io.in(room).fetchSockets().then(response => response.map((user) => user.data.username ))
        await io.emit('get-room-users', users)
        rooms = Array.from(socket.rooms)
        rooms.shift()
        await io.emit('get-all-rooms', rooms)
    })
    socket.on('disconnect', () => {
        io.emit('get-room-users', users)
        console.log(`User disconnected`)
    })
})