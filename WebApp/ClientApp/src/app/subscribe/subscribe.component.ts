import { Component } from '@angular/core';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent {

  socket: any = null;
  socketUrl: string = 'wss://nodejswebsocket-ticketapp.uc.r.appspot.com/';
  userName: string = '1';
  roomName: string = 'room_1';

  constructor() {}

  onClickSubscribe() {

    // Conectando con el servidor
    this.connectWs();

    // Evendo cuando se conecta
    this.socket.on('connect', () => {
      console.log('ws connected!')
    });

    // Evento cuando se desconecta
    this.socket.on('disconnect', () => {
      console.log('ws disconnected!');
    });
  }

  /**Función para conectar con websocket */
  connectWs() {
    // Creando conexión
    this.socket = io.connect(this.socketUrl, {
      // Opcionales adicionales
      query: { // Parámetros a enviar en la petición de conexión
        id: this.userName,
        username: this.userName,
        room: this.roomName
      }
    });

    // Cambiando de nombre de usuario
    //this.socket.emit('setUsername', this.userName);

    // Cambiando de sala
    //this.socket.emit('switchRoom', this.roomName);

    // Evento cuando cambia de sala
    this.socket.on('updateRooms', (current_room) => {
      console.log('updateRooms', current_room);
    });

    // Evento cuando actualiza estado cualquier socket en la sala
    this.socket.on('updateRoom', (message) => {
      console.log('updateRoom', message);
    });

    // Evento recibe mensaje generico
    this.socket.on('updateServer', (args) => {
      console.log('updateServer', args);
    });

    // Evento recibe mensaje especifico
    this.socket.on('newQueue', (args) => {
      console.log('newQueue', args);
    });

    // Evento recibe mensaje especifico
    this.socket.on('updateQueue', (args) => {
      console.log('updateQueue', args);
    });

    // Evento recibe mensaje especifico
    this.socket.on('newTicket', (args) => {
      console.log('newTicket', args);
    });

    // Evento recibe mensaje especifico
    this.socket.on('updateTicket', (args) => {
      console.log('updateTicket', args);
    });
  }
}
