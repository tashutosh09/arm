import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';

import { ModalController, NavController, Platform, PopoverController } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeWhile';

import { logMessage } from '../helpers/LogHelper';
import { GetConfigAction } from '../modules/AppConfig/app-config.module';
import { ShowSmallMenuAction, ViewGoToSplashAction, ShowLargeMenuAction } from '../modules/AppViews/app-views.actions';
import { LoginAction, UpdateFromStorageAction, SetUserNameAction } from '../modules/Auth/auth.actions';
import { AuthState } from '../modules/Auth/auth.state';
import { PopMenuPage } from '../pages/pop-menu/pop-menu';
import { AppStoreState } from './app.store.state';
//import { AdalService } from 'adal-angular4';
import { environment } from './environment';
//import { MsalService } from 'msal-angular';
import { MsalService } from './msal.service';
import { AppSettings } from './app.settings';

import {OnDestroy, OnInit} from '@angular/core';
//import {BroadcastService} from "@azure/msal-angular";
//import { MsalService} from "@azure/msal-angular";
import {Subscription} from "rxjs/Subscription";
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
//import routes from '../../../server/src/routes/Router'
//import routes from '../Server/routes/Router';
// import { NavigationEnd, NavigationStart, Router } from '@angular/router';//Add Subrata 11-02-2021
// import * as moment from 'moment'; //Add Subrata 11-02-2021

@Component({
  templateUrl: 'app.html'
})
export class MyAppComponent implements OnDestroy
//implements OnInit, AfterViewInit
{
  private getOut : boolean = false;
  /*ngOnInit() {
       this.getOut = true;
  }
    ngAfterViewInit() {
      console.log('This line will also be logged.');
      if(this.getOut){
         return;
      }
      console.log('This line will also be saghdaghsagh.');
    }*/
    private ngUnsubscribe = new Subject();
    authData = {
      username: '',
      password: ''
    };

  @ViewChild('content') nav: NavController;

  isAlive: boolean;

  //root: any = 'SplashPage';
  root: any = 'DashboardPage'; //Add Subrata 24022021

  authState: AuthState;

  public now: Date = new Date();

  isLoginVisible: boolean = false;

  showSmallMenu: boolean = false;

  title: string = '';
  setTrue:boolean= true;
  //Start Subrata 11-02-2021
  // lastIn: any= '';
  // currentPage = '';
  // timeSpentOnPages = [];
  //End Subrata 11-02-2021

  constructor(
    public platform: Platform,
    private modalCtrl: ModalController,
    private store: Store<AppStoreState>,
    public popoverCtrl: PopoverController,
    private storage: Storage, 
    private msalService: MsalService,
    //private router: Router
    ){
      this.isAlive = true;
      this.initializeApp();
      //Start Subrata 11-02-2021
      // this.router.events.subscribe((event: any)=> {
      //   if (event instanceof NavigationEnd){
      //     console.log(event.url);
      //     if (!this.currentPage) {
      //       this.currentPage = event.url;
      //       this.lastIn = Date.now();
      //     }
      //     if (this.currentPage !== event.url) {
      //       const timeSpent = moment(Date.now() - this.lastIn).utc().format('H:mm:ss');  
      //       //Date.now() - this.lastIn;
      //       const pageInfo = {
      //         pageUrl : this.currentPage,
      //         timeSpent
      //       }
      //       this.timeSpentOnPages.push(pageInfo);
      //       this.lastIn = Date.now();
      //       this.currentPage = event.url;
      //       console.log(JSON.stringify(this.timeSpentOnPages));
      //       console.log("Length: "+this.timeSpentOnPages.length);
      //       //moment.utc(pageInfo.timeSpent).format('H:mm:ss');
            
      //       var jsonObjUserLog = this.timeSpentOnPages;
      //       //var jsonObjUserLog = {username:this.adalSvc.userInfo.userName, page:this.timeSpentOnPages[0].pageUrl, timespent:this.timeSpentOnPages[0].timeSpent};
      //       console.log("JSON Object User Log: "+JSON.stringify(jsonObjUserLog));
      //       // this.http.post<any>(`${Constants.HOST}/captureauditlog`,{username:this.adalSvc.userInfo.userName, pageinfo: this.timeSpentOnPages})
      //       // .subscribe((response)=>{
      //       //   console.log("User Log ")
      //       // },(error)=>{
      //       //   console.log(error);
      //       // });
      //       console.log("Result12345: "+{pageinfo: this.timeSpentOnPages});
      //       this.timeSpentOnPages = [];
      //     }
      //  }
      // })
      //End Subrata 11-02-2021
   
  }
  
  initializeApp() {
    //console.log("initializeApp");
    //console.log("App Component Adal Token 12345"+localStorage.getItem('msal.idtoken'));
    logMessage('Init app component');
    
    /*const url = window.location.href;
    console.log("URL "+url);
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get('token');
    }
    console.log("ARM token "+paramValue);*/

    // For clock
    setInterval(() => {
      this.now = new Date();
    }, 1);

    // Listen for View state
    this.store
      .select((state) => state.AppViews)
      .takeWhile(res=> this.isAlive)
      .do(response=>{
        this.title = response.title;
        this.showSmallMenu = response.showSmallMenu;
      })
      .distinctUntilChanged()
      .debounceTime(500)
      .subscribe((response) => {
        this.nav.setRoot(response.page, response.pageData);
      });

    // Load auth state from storage
    this.storage.get('Auth').then((response) => {
      if (response) {
        logMessage('Get from storage');

        this.store.dispatch(new UpdateFromStorageAction(response));
      }
      this.authChangeListener();
    });

    //Start Subrata 30112020
    this.platform.ready().then(() => {
     if (!this.msalService.isOnline()) {
       this.msalService.login();
      }
      if (this.msalService.isOnline()) {
        this.store.dispatch(new SetUserNameAction({username: this.msalService.userProfile().idToken.preferred_username, password: ''}));
      }
  });
    //End Subrata 30112020
  }
  
  authChangeListener() {
    this.store.select((state) => state.Auth)
      .debounceTime(200)

      .subscribe((authState) => {
        if (authState != null && authState.isReady) {
          this.authState = authState;
          // Put state in Storage
          if (!authState.isFromStorage) {
            this.storage.set('Auth', authState);
          }

          if (!authState.isLoggedIn) {
            this.askForLogin();
          } else {
            setTimeout(() => { this.store.dispatch(new GetConfigAction()); }, 500);
          }
        } else {
          console.log("askForLogin2");
          this.askForLogin();
        }
      });
  }

  askForLogin() {
    /*this.nav.setRoot('SplashPage')
    logMessage('Show login popup');
    const loginModal = this.modalCtrl
      .create('LoginPage', {}, { cssClass: 'login-box', enableBackdropDismiss: false });
    loginModal.onDidDismiss(() => {
      this.isLoginVisible = false;
    });
    if (!this.isLoginVisible) {
      this.isLoginVisible = true;
      loginModal.present();
    }*/
    this.store.dispatch(new LoginAction(this.authData));
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopMenuPage, { authState: this.authState });
    popover.present({
      ev: myEvent
    });
  }

  goToHome() {
    this.store.dispatch(new ViewGoToSplashAction());
    window.location.href = "http://10.0.3.27:10040/";
  }

  toogleMenu(){
    if(this.showSmallMenu){
      this.store.dispatch(new ShowLargeMenuAction());
    } else {
      this.store.dispatch(new ShowSmallMenuAction());
    }
  }
  ngOnDestroy(){
    this.isAlive = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
