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
    this.socket = io(this.socketUrl);

    this.socket.on('message', (args) => {
      console.log('message', args);
    });

    this.socket.on('new-user-queue', (args) => {
      console.log('new-user-queue', args);
    });
  }
}
