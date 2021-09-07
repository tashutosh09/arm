import { InterceptorModule } from './../Network/InterceptorModule';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { LogsService } from './logs.service';


@NgModule({
    imports: [
        InterceptorModule,
    ],
    exports: [],
    declarations: []
})
export class LogsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LogsModule,
            providers: [LogsService]
        };
    }
}


export { LogsService } from './logs.service';
