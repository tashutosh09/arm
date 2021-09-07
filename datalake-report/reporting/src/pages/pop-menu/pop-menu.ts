import { LogsService } from './../../modules/Logs/logs.service';
import { AuthState } from './../../modules/Auth/auth.state';
import { LogoutAction } from './../../modules/Auth/auth.actions';
import { AppStoreState } from './../../app/app.store.state';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { saveAs as importedSaveAs } from "file-saver";
import * as moment from 'moment';
import { CONFIG_UI } from '../../app/app.config';
import { MsalService } from '../../app/msal.service'

@Component({
  selector: 'page-pop-menu',
  templateUrl: 'pop-menu.html',
})
export class PopMenuPage {
//token: String;
  authState: AuthState;
  isLogAdmin: boolean = false;
  userName: String; //Subrata
  v1 : any ;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<AppStoreState>,
    private viewCtrl: ViewController,
    private logsService: LogsService,private msalService: MsalService) {
    this.authState = this.navParams.get('authState');
    //TODO: VLUSERS not there in config--> need value for these
    this.isLogAdmin = (CONFIG_UI.VLUSERS.indexOf(this.authState.systemName) > -1);
  }

  //Start Subrata
  ngOnInit() {
    //this.userName = this.v1.preferred_username;
    if(this.msalService.userProfile() != null){
      this.userName = this.msalService.userProfile().idToken.preferred_username;
    }
  }
  //End Subrata


  logout() {
    this.msalService.logout();
    //window.location.href = 'http://13.232.71.81:8080/auth/realms/CLEARR Insights web/protocol/openid-connect/logout?redirect_uri=http://10.0.3.27:4300';
    //localStorage.removeItem("ang-token");
    //localStorage.removeItem("ang-refresh-token");
    //this.viewCtrl.dismiss();
    //this.store.dispatch(new LogoutAction());
  }

  downloadLogs() {
    this.logsService.download().subscribe(res => {
      importedSaveAs(res, `${moment().toISOString()}.log`);
    });
  }

  downloadUserLogs(){
    this.logsService.downloadUserLogs().subscribe(res => {
      importedSaveAs(res, `${moment().toISOString()}.log`);
    });
  }
}
