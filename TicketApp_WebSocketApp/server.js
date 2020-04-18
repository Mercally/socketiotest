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
            client.query('LISTEN new_testevent');
            client.on('notification', (data) => {
                var payload = JSON.parse(data.payload);
                console.log('row added', payload);
                io.sockets.emit('new-user-queue', payload);
            });
            console.log('postgres connected successfully!');
        }).catch(error => {
            console.log('ERROR: postgres:', error);
        });
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    io.sockets.emit('message', 'a new user connected!!');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});