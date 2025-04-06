const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const app = express();

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

// Enable CORS middleware for Express
app.use(cors({
    origin: 'http://localhost:3000', // Allow only React app from localhost:3000
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000", // Allow connections from React app
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket) => {
    
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });  
        
        if (error) {
            if (typeof callback === 'function') callback(error); // Safely call the callback with error
            return;
        }

        socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        socket.join(user.room);

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});

        if (typeof callback === 'function') callback(); // Safely call the callback
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: user.name, text: message });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }

        if (typeof callback === 'function') callback(); // Safely call the callback
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
        }

        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
