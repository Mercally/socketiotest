'use strict';
const path = require('path');
const express = require('express');
const app = express();
// Postgres:
//const Pool = require('pg').Pool
//const pool = new Pool({
//    user: 'postgres',
//    host: 'localhost',
//    database: 'test',
//    password: 'admin'
//});

// Settings
app.set('port', process.env.PORT || 3000); // Port
app.use(express.static(path.join(__dirname, 'public'))); // Static files

// Start server
const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
    console.log('rutepath', __dirname);

    // Postgres connection
    //pool.connect()
    //    .then(client => {
    //        client.query('LISTEN new_testevent');
    //        client.on('notification', (data) => {
    //            const payload = JSON.parse(data.payload);
    //            console.log('row added', payload);
    //            io.sockets.emit(payload);
    //        });
    //        console.log('postgres connected successfully!');
    //    }).catch(error => {
    //        console.log('ERROR: postgres:', error);
    //    });
});

// Websockets
const io = require('socket.io')(server, {
    transports: ['polling', 'websocket'],
    path: '/socket.io'
});
//const io = socketio(server);

io.on('connection', (socket) => {
    setInterval(() => {
        io.sockets.emit('event_test_ticket', {
            'id_ticket': 1,
            'id_cola': 1,
            'posicion': 1,
            'estado': 'VIGENTE',
            'generado_en': null,
            'inicio_turno': null,
            'vencimiento': null,
            'atendido_en': null,
            'ultima_notificacion': null,
            'device_id': null
        });

        io.sockets.emit('event_test_cola', {
            'id_cola': 1,
            'descripcion': 'Cola test websocket',
            'id_establecimiento': 1,
            'cupos': 1000000,
            'ultimo_atendido': 10,
            'duracion_vencimiento': 5
        });
    }, 6000);

    console.log('new connection', socket.id);
    //io.on('new-user-queue', () => {
    //    console.log("nuevo usuario encolado...");
    //    io.sockets.emit('nuevo usuario encolado...');
    //});
});