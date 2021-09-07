import { NgModule } from '@angular/core';
import { IOSocket } from './io.socket.service';

@NgModule({
    providers: [IOSocket]
})
export class IOSocketModule { }

export { IOSocket } from './io.socket.service';