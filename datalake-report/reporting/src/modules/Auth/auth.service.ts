import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG_UI } from '../../app/app.config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  get(username: string, password: string): Observable<any> {
    //console.log("username"+username+"password");
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}auth/login`, {
      token: btoa(username + ":" + password)
    });
  }

}
