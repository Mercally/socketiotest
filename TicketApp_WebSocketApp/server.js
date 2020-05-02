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
            // A escucha de la creación/actualización de colas y tickets:
            client.query('LISTEN create_cola');
            client.query('LISTEN update_cola');
            client.query('LISTEN create_ticket');
            client.query('LISTEN update_ticket');
            // Cuando se recibe una notificación de la base de datos:
            client.on('notification', (data) => {
                console.log('NOTIFICATION CHANNEL:', data.channel);
                var payload = JSON.parse(data.payload);
                switch (data.channel) {
                    case 'create_cola':
                        onCreateQueue(payload);
                        break;
                    case 'update_cola':
                        onUpdateQueue(payload);
                        break;
                    case 'create_ticket':
                        onCreateTicket(payload);
                        break;
                    case 'update_ticket':
                        onUpdateTicket(payload);
                        break;
                }
            });
            console.log('postgres connected successfully!');
        }).catch(error => {
            console.log('ERROR: postgres:', error);
        });
});

const onCreateQueue = (payload) => {
    var room = getRoomId(payload);
    console.log('New queue/room:', room);
    io.to(room).emit('newQueue', payload);
}

const onUpdateQueue = (payload) => {
    var room = getRoomId(payload);
    console.log('Update queue/room:', room);
    io.to(room).emit('updateQueue', payload);
}

const onCreateTicket = (payload) => {
    var room = getRoomId(payload);
    console.log('New ticket in queue/room:', room);
    io.to(room).emit('newTicket', payload);
}

const onUpdateTicket = (payload) => {  
    var room = getRoomId(payload);
    var socketid = getSocketId(payload);
    console.log('Update ticket for user:', socketid);
    // Emitir notificación al propietario del socket:
    io.to(room).emit('updateTicket', { socketid: socketid, payload: payload });
    //io.to(socketid).emit('updateTicket', payload);
}

const getRoomId = (payload) => {
    return `room_${payload.id_cola}`;
}

const getSocketId = (payload) => {
    return `${getRoomId(payload)}_socket_${payload.id_ticket}`;
}

// Inicializando servidor de websockets:
const io = require('socket.io')(server);
var rooms = [], countClients = 0;

io.on('connection', (socket) => {
    countClients++;

    var username = socket.handshake.query.username;
    var room = socket.handshake.query.room;

    onSwitchRoom(socket, room);
    onSetUsername(socket, username);

    // Evento cuando socket pide cambiar username
    socket.on('setUsername', (username) => {
        onSetUsername(socket, username);
    });

    // Evento cuando socket pide cambiar de room
    socket.on('switchRoom', function (room) {
        onSwitchRoom(socket, room);
    });

    socket.on('disconnect', () => {
        countClients--;
        console.log('User disconnected (' + countClients  + ' connected)');
    });

    var connected = { UserConnected: { room: room, username: username }, ClientsActive: countClients };
    console.log("User connected", connected);
    // Enviando mensaje generico a todos
    io.sockets.emit('updateServer', 'A new user connected a server!');
});

const onSetUsername = (socket, username) => {
    socket.username = username;
    socket.emit('updateServer', 'Username ' + username + ' set successfully!');
}

/**
 * Función para evento cuando un usuario se agrega a una sala.
 * @param {any} room
 */
const onSwitchRoom = (socket, room) => {
    if (rooms.indexOf(room) === -1) {
        rooms.push(room);
    }
    // saliendo de la sala actual (almacenada en sesión)
    if (socket.room) {
        socket.leave(socket.room, () => {
            // Mandando mensaje a la sala anterior
            socket.to(socket.room).emit('updateRoom', socket.username + ' has left this room!');
        });
    }
    // Actualizando datos de la sesión del socket titular
    socket.room = room;
    // Entrando a la nueva sala, recibida del nombre del parámetro
    socket.join(room, () => {
        socket.emit('updateRoom', 'You have connected to ' + room + ' successfully!');
        socket.to(room).emit('updateRoom', socket.username + ' has joined ' + room + ' room!');
    });
}