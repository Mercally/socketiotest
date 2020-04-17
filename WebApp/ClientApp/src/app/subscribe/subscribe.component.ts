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
    this.socket = io(this.socketUrl);
  }

  onClickSubscribe() {
    this.socket.setupSocketConnection();
  }
}
