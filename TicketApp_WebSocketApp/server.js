'use strict';
const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const https = require('https');
//const socketIo = require('socket.io');
const webSocket = require('ws');
const app = express();

// Settings
app.set('port', process.env.PORT || 8080); // Port

//app.set('cert', fs.readFileSync('/path/to/cert.pem'));
//app.set('key', fs.readFileSync('/path/to/key.pem'));

app.use(express.static(path.join(__dirname, 'public'))); // Static files


const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
    //console.log('rutepath', __dirname);

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


const io = new webSocket.Server({ server });

io.on('connection', (socket) => {
    setInterval(() => {
        io.emit('event_test_ticket', {
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

        io.emit('event_test_cola', {
            'id_cola': 1,
            'descripcion': 'Cola test websocket',
            'id_establecimiento': 1,
            'cupos': 1000000,
            'ultimo_atendido': 10,
            'duracion_vencimiento': 5
        });
    }, 6000);

    console.log('new connection', socket);
});