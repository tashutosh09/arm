import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG_UI } from '../../app/app.config';

@Injectable()
export class FeedService {

    constructor(private http: HttpClient) { }

    get(name: string): Observable<any> {
        return this.http.get(`${CONFIG_UI.API.METASTORE_BASE_PATH}feeds/${name}`);
    }
}