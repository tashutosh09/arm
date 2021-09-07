import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { AppViewsService } from './app-views.service';
import * as appViews from './app-views.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class AppViewsEffects {

  constructor(
    private appViewsService: AppViewsService,
    private actions$: Actions
  ) { }

}
