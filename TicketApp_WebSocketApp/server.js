'use strict';

const path = require('path');
const express = require('express');
const app = express();

const pg = require('pg');
const pool = new pg.Pool({
    host: 'database-test.cnbndhjcuspi.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'test',
    user: 'postgres',
    password: '4dm1n3214dm1n321'
});

// Settings
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));

    // Postgres connection
    pool.connect()
        .then(client => {

            // A escucha de la creación/actualización de colas
            client.query('LISTEN update_cola');
            client.on('notification', (data) => {
                
                var payload = JSON.parse(data.payload);
                console.log('row cola updated', payload);

                io.to('room1').emit('update_cola', payload);
                io.to('room2').emit('update_cola', payload);
            });

            // A escucha de la creación/actualización de tickets
            client.query('LISTEN update_ticket');
            client.on('notification', (data) => {

                var payload = JSON.parse(data.payload);
                console.log('row ticket updated', payload);

                io.to('room1').emit('update_ticket', payload);
                io.to('room2').emit('update_ticket', payload);
            });

            console.log('postgres connected successfully!');
        }).catch(error => {
            console.log('ERROR: postgres:', error);
        });
});

const io = require('socket.io')(server);
var rooms = [], countClients = 0;

io.on('connection', (socket) => {
    console.log('A user connected');
    countClients++;

    // Enviando mensaje generico a todos
    io.sockets.emit('updateServer', 'A new user connected a server!!');

    // Evento cuando socket pide cambiar de room
    socket.on('switchRoom', function (newRoom) {
        if (rooms.indexOf(newRoom) === -1) {
            rooms.push(newRoom);
        }

        // saliendo de la sala actual (almacenada en sesión)
        socket.leave(socket.room);
        // Entrando a la nueva sala, recibida del nombre del parámetro
        socket.join(newRoom);
        socket.emit('updateRoom', 'SERVER', 'You have connected to ' + newRoom + ' successfully!');
        // Mandando mensaje a la sala anterior
        socket.broadcast.to(socket.room).emit('updateRoom', 'SERVER', socket.username + ' has left this room');
        // Actualizando datos de la sesión del socket titular
        socket.room = newRoom;
        socket.broadcast.to(newRoom).emit('updateRoom', 'SERVER', socket.username + ' has joined this room');
        socket.emit('updateRooms', rooms, newRoom);
    });

    socket.on('disconnect', () => {
        countClients--;
        console.log('User disconnected');
    });

    console.log('Clients connected', countClients);
});