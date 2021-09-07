import { HttpClient } from '@angular/common/http';
import { CONFIG_UI } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LogsService {
    v1 : any;

    constructor(private http: HttpClient) { }

    download(): Observable<any> {
        return this.http.get(`${CONFIG_UI.API.METASTORE_BASE_PATH}logs/get`, { responseType: 'blob' });
    }

    downloadUserLogs(): Observable<any> {
        return this.http.get(`${CONFIG_UI.API.METASTORE_BASE_PATH}logs/getUserLogs`, { responseType: 'blob' });
    }

}
