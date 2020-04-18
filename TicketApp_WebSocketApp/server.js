'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public'))); // Static files

const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

const io = require('socket.io')(server);
//io.listen;

io.on('connection', (socket) => {
    console.log('a user connected');

    io.sockets.emit('message', 'a new user connected!!');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});