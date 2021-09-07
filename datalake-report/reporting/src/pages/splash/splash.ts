import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppStoreState } from '../../app/app.store.state';
import { UpdateFromStorageAction, SetUserNameAction } from '../../modules/Auth/auth.actions';
import { AuthState } from '../../modules/Auth/auth.state';
import { GetRuleMetaDataAction } from '../../modules/MetaData/meta-data.actions';
import { MsalService } from '../../app/msal.service';

@IonicPage({
  segment: 'home'
})
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {
  authState: AuthState;
  ruleCounts: any;
  userName: String; //Subrata
  
  constructor(
    public navCtrl: NavController,
    private store: Store<AppStoreState>,
    private storage: Storage, 
    private msalService: MsalService) {

    // this.store.select(state => state.MetaData)
    // .filter(response=> !response.loading && !!response.ruleCounts)
    // .map(response => response.ruleCounts)
    // .subscribe(response=>{
    //   this.ruleCounts = response;
    // })

  }

  ngOnInit() {
    if(this.msalService.userProfile() != null){
      this.userName = this.msalService.userProfile().name;
      //this.store.dispatch(new SetUserNameAction({username: this.msalService.userProfile().name, password: ''}));
    }
    //this.userName = this.msalService.userProfile().idToken.preferred_username;
    this.store.select(state => state.Auth)
      .filter(response => response.isLoggedIn && !!response.systemName)
      .subscribe(authState => {
 //	console.log('testui log in splash');
  //      console.log(this.authState.accessToken);
        this.authState = authState;
//        this.store.dispatch(new GetRuleMetaDataAction(this.authState.systemName))
      })
      
  }

}
