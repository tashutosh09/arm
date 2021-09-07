import { LogoutAction } from './../Auth/auth.actions';
import { AppStoreState } from './../../app/app.store.state';
import { Store } from '@ngrx/store';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
    token: string;
    constructor(private store: Store<AppStoreState>) {
        this.store.select(state => state.Auth).subscribe(response => {
            this.token = response.accessToken;
        })
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                //'x-access-token': `${this.token}`  //chinmay
            }
        });
        return next.handle(request)
            .do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.store.dispatch(new LogoutAction());
                    }
                }
            });
    }
}