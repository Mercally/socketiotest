import { Component } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent {

  socketUrl = 'wss://testwebsocketnode.azurewebsites.net/socket.io/';
  //socketUrl = 'wss://localhost:3000/';
  //ticketSocket: WebSocketSubject<any> = webSocket<any>(this.socketUrl);
  objectSocket$ = webSocket(this.socketUrl);

  constructor() {

  }

  onClickSubscribe() {
    this.objectSocket$.subscribe((next) => {
      console.log('next', next);
    }, (error) => {
        console.log('error', error);
    }, () => {
        console.log('complete connection ws');
    });
  }
}
