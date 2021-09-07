import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CONFIG_UI } from '../../app/app.config';

@Injectable()
export class MetaDataService {

  constructor(private http: HttpClient) { }

  get(userName: string): Observable<any> {
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}rulemetadata/get`, {
      user: userName
    });
  }

}
