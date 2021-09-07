import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG_UI } from '../../app/app.config';
import { MsalService } from '../../app/msal.service'

@Injectable()
export class CompanyNamesService {

  constructor(private http: HttpClient, private msalService: MsalService) { }
/* Chinmay
  get(flag: string): Observable<any> {
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}companies/get`, {
      flag: flag
    });
  }
*/

  get(flag: string): Observable<any> {
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}companies/get`, {
      UserName: this.msalService.userProfile().idToken.preferred_username
    });
  }

}
