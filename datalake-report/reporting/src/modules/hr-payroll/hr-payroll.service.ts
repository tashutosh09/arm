import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HRPayrollService {

  constructor(private http: Http) { console.log("Hello 1001")}

}
