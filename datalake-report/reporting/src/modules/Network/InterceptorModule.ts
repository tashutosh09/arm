import { HttpsRequestInterceptor } from './MyHttpIntercept';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpsRequestInterceptor, multi: true }
    ]
})
export class InterceptorModule { }