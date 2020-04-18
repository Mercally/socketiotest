import { Component } from '@angular/core';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent {

  socket;
  socketUrl = 'wss://server16.eastus.cloudapp.azure.com/';

  constructor() {
   
  }

  onClickSubscribe() {
    // Creando conexión
    this.socket = io(this.socketUrl);

    // Cambiando de room
    this.socket.emit('switchRoom', 'room2');

    // Evento cuando cambia de sala
    this.socket.on('updateRooms', (rooms, current_room) => {
      console.log('updateRooms', rooms, current_room);
    });

    // Evento cuando actualiza estado cualquier socket en la sala
    this.socket.on('updateRoom', (from, message) => {
      console.log('updateRoom', from, message);
    });

    // Evento recibe mensaje generico
    this.socket.on('updateServer', (args) => {
      console.log('updateServer', args);
    });

    // Evento recibe mensaje especifico
    this.socket.on('new-user-queue', (args) => {
      console.log('new-user-queue', args);
    });
  }
}
