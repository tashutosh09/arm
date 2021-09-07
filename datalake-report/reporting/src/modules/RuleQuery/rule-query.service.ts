import { HttpClient } from '@angular/common/http';
import { CONFIG_UI } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RuleQueryService {

  constructor(private http: HttpClient) { }

  getAll(ruleID: string): Observable<any> {
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}rulequery/get`, {
      RuleID: ruleID 
    });
  }

}
