'use strict';

const path = require('path');
const express = require('express');
const app = express();

const pg = require('pg');
const pool = new pg.Pool({
    host: 'bd.idea4.quenecesito.org',
    port: 1003,
    database: 'ticketapptest',
    user: 'ticketuser',
    password: 'T!3537App'
});

// Settings
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));

    // Postgres connection
    pool.connect()
        .then(client => {

            // A escucha de la creaci�n/actualizaci�n de colas
            client.query('LISTEN create_cola');
            client.on('notification', (data) => {
                var payload = JSON.parse(data.payload);
                var room = `room_${payload.id_establecimiento}_${payload.id_cola}`;
                console.log('New queue/room:', room);
                
                io.to(room).emit('newQueue', payload);
            });

            client.query('LISTEN update_cola');
            client.on('notification', (data) => {
                var payload = JSON.parse(data.payload);
                var room = `room_${payload.id_establecimiento}_${payload.id_cola}`;
                console.log('Update queue/room:', room);

                io.to(room).emit('updateQueue', payload);
            });

            // A escucha de la creaci�n/actualizaci�n de tickets
            client.query('LISTEN create_ticket');
            client.on('notification', (data) => {
                var payload = JSON.parse(data.payload);
                var room = `rm_${payload.id_cola}`;
                console.log('New ticket in queue/room:', room);

                io.to(room).emit('newTicket', payload);
            });

            client.query('LISTEN update_ticket');
            client.on('notification', (data) => {
                var payload = JSON.parse(data.payload);
                var socketid = `rm_${payload.id_cola}_${payload.id_ticket}`;
                console.log('New ticket in queue/room:', room);

                // Emitir notificaci�n al propietario del socket:
                io.to(socketid).emit('updateTicket', payload);
            });

            console.log('postgres connected successfully!');
        }).catch(error => {
            console.log('ERROR: postgres:', error);
        });
});

// Inicializando servidor de websockets:
const io = require('socket.io')(server);
var rooms = [], countClients = 0;

io.on('connection', (socket) => {
    countClients++;

    var username = socket.handshake.query.username;
    var room = socket.handshake.query.room;

    console.log(`A user connected (${room}/${username})(${countClients} connected in server)`);

    onSetUsername(socket, username);
    onSwitchRoom(socket, room);

    // Enviando mensaje generico a todos
    io.sockets.emit('updateServer', 'A new user connected a server!');

    // Evento cuando socket pide cambiar username
    socket.on('setUsername', (username) => {
        onSetUsername(socket, username);
    });

    // Evento cuando socket pide cambiar de room
    socket.on('switchRoom', function (newRoom) {
        onSwitchRoom(socket, newRoom);
    });

    socket.on('disconnect', () => {
        countClients--;
        console.log('User disconnected (' + countClients  + ' connected)');
    });
});

const onSetUsername = (socket, username) => {
    socket.id = username;
    socket.username = username;
    socket.emit('updateServer', 'Username ' + username + ' set successfully!');
}

/**
 * Funci�n para evento cuando un usuario se agrega a una sala.
 * @param {any} newRoom
 */
const onSwitchRoom = (socket, newRoom) => {
    if (rooms.indexOf(newRoom) === -1) {
        rooms.push(newRoom);
    }

    // saliendo de la sala actual (almacenada en sesi�n)
    socket.leave(socket.room);
    // Entrando a la nueva sala, recibida del nombre del par�metro
    socket.join(newRoom);
    socket.emit('updateRoom', 'SERVER', 'You have connected to ' + newRoom + ' successfully!');
    // Mandando mensaje a la sala anterior
    socket.broadcast.to(socket.room).emit('updateRoom', 'SERVER', socket.username + ' has left this room');
    // Actualizando datos de la sesi�n del socket titular
    socket.room = newRoom;
    socket.broadcast.to(newRoom).emit('updateRoom', 'SERVER', socket.username + ' has joined this room');
    socket.emit('updateRooms', rooms, newRoom);
}