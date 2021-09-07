import { HttpClient } from '@angular/common/http';
import { CONFIG_UI } from '../../app/app.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IndustryRuleService {

  constructor(private http: HttpClient) { }

  get(rulegroupid: String): Observable<any> {
    console.log("===Subrata 22 rulegroupid"+ rulegroupid);
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}industryrule/get`, {rulegroupID: rulegroupid});
  }

}
