import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@NgModule({
    imports: [AppModule, ServerModule, ModuleMapLoaderModule],
    bootstrap: [AppComponent]
})
export class AppServerModule {

  socketUrl = 'ws://testwebsocketnode.azurewebsites.net/';
  ticketSocket: WebSocketSubject<any> = webSocket<any>(this.socketUrl);
  objectSocket$ = this.ticketSocket.asObservable();

  constructor() {

  }
}
