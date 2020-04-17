'use strict';

const socketUrl = 'ws://testwebsocketnode.azurewebsites.net';
const socket = io(socketUrl);

socket.on('event_test_ticket', function(data) {
    console.log('c1', data);
});

socket.on('event_test_cola', function(data) {
    console.log('c1', data);
});


const socketUrl2 = 'wss://testwebsocketnode.azurewebsites.net';
const socket2 = io(socketUrl2);

socket2.on('event_test_ticket', function (data) {
    console.log('c2', data);
});

socket2.on('event_test_cola', function (data) {
    console.log('c2', data);
});