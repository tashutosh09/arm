import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG_UI } from '../../app/app.config';

@Injectable()
export class AppConfigService {

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}config/get`, {});
  }

}
