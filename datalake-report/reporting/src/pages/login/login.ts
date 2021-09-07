import { LoginAction } from './../../modules/Auth/auth.actions';
import { AppStoreState } from './../../app/app.store.state';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { AuthState, initialAuthState } from '../../modules/Auth/auth.state';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  authState: AuthState;
  private errorMessage: string;

  authData = {
    username: '',
    password: ''
  };

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams,
    private store: Store<AppStoreState>) {
    this.store.select(store => store.Auth)
      .map(res => res.errorMessage)
      .subscribe(res => {
        this.errorMessage = res;
      });
  }

  performLogin() {
    //this.authState = this.navParams.get('authState');
    // this.authState.displayName = this.authData.username;
    //console.log('hi dude');
    //this.store.dispatch(new LoginAction(this.authData));
  }

  ionViewDidLoad() {
    this.store.select(state => state.Auth)
      .distinct(authState => authState.isLoggedIn)
      .subscribe(response => {
        if (response.isLoggedIn) {
          this.viewCtrl.dismiss();
        }
      });
  }

}
