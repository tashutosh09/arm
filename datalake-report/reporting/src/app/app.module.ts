import { AppViewsModule } from './../modules/AppViews/app-views.module';
import { LogsModule } from './../modules/Logs/logs.module';
import { PopMenuPage } from './../pages/pop-menu/pop-menu';
import { NgSvgIconModule } from 'ng-svg-icon';
import { AppAlert } from './../helpers/AppAlert';
import { IOSocketModule } from './../modules/IOSocket/io.socket.module';
import { PipesModule } from './../pipes/pipes.module';
import { ComponentsModule } from './../components/components.module';
import { CompanyNamesModule } from './../modules/CompanyNames/company-names.module';
import { FeedModule } from './../modules/Feeds/feed.module';
import { AuthModule } from './../modules/Auth/auth.module';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MyAppComponent } from './app.component';

import { CONFIG_UI } from './app.config';

import { IonicStorageModule } from '@ionic/storage';
import { AppConfigModule } from '../modules/AppConfig/app-config.module';
import { MsalModule, MsalInterceptor } from  '@azure/msal-angular';
//import { AdalService, AdalGuard, AdalInterceptor } from 'adal-angular4';

import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { MsalService } from './msal.service';
//import { MsalService } from 'msal-angular';
import { HttpServiceHelper } from './HttpServiceHelper';
import { IndustryRuleModule } from '../modules/IndustryRule/industry-rule.module'; //24022021
import { HRPayrollModule } from './../modules/hr-payroll/hr-payroll.module'; //24022021
@NgModule({
  declarations: [
    MyAppComponent,
    PopMenuPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyAppComponent, {
      mode: 'md'
    }),
    PipesModule,
    ComponentsModule,
    NgSvgIconModule.forRoot({

    }),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    }),
    AuthModule.forRoot(),
    AppConfigModule.forRoot(),
    CompanyNamesModule.forRoot(),
    FeedModule.forRoot(),
    IOSocketModule,
    LogsModule.forRoot(),
    AppViewsModule.forRoot(),
    IndustryRuleModule.forRoot(), //24022021
    HRPayrollModule.forRoot(), //24022021
    /*MsalModule.forRoot({
      clientID: 'b31826af-124a-4267-be3a-25d155a435ab',
      //graphScopes: ["openid"],
      authority: 'https://login.microsoftonline.com/05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e.onmicrosoft.com'
    }),*/
    /*MsalModule.forRoot({
      authority: "https://login.microsoftonline.com/common/05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e",
      clientID: 'b31826af-124a-4267-be3a-25d155a435ab',
      redirectUri: 'https://clearrinsights-testarn.wcgt.in/',
      // endpoints: {
      //   "https://clearrinsights-testarn.wcgt.in/" : "https://login.microsoftonline.com/05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e"
      // },
      cacheLocation : "localStorage",
      postLogoutRedirectUri: "https://clearrinsights-test.wcgt.in/",
      
      // clientID: "b31826af-124a-4267-be3a-25d155a435ab",
      // authority: "https://login.microsoftonline.com/common/05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e",
      // validateAuthority: true,
      // redirectUri: "https://clearrinsights-testarn.wcgt.in/",
      // cacheLocation : "localStorage",
      // postLogoutRedirectUri: "https://clearrinsights-test.wcgt.in/",
      // navigateToLoginRequestUrl: true,
      // popUp: false,
      //consentScopes: [ "user.read", "api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user"],
      //unprotectedResources: ["https://www.microsoft.com/en-us/"],
      //protectedResourceMap: protectedResourceMap
  }),*/
   /* AdalService.forRoot({

      // auth: {
      //   clientId: 'b31826af-124a-4267-be3a-25d155a435ab', // This is your client ID
      //   authority: 'https://login.microsoftonline.com/05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e', // This is your tenant ID
      //   redirectUri: 'https://clearrinsights-test.wcgt.in/'// This is your redirect URI
      //   // **** GT=====================
      //   // clientId: 'b31826af-124a-4267-be3a-25d155a435ab', // This is your client ID
      //   // authority: 'https://login.microsoftonline.com/05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e', // This is your tenant ID
      //   // redirectUri: 'https://clearrinsights-test.wcgt.in/'// This is your redirect URI
        
      // },
      // cache: {
      //   cacheLocation: 'localStorage',
      //   //storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      // },

      clientID: "b31826af-124a-4267-be3a-25d155a435ab",
      authority: "https://login.microsoftonline.com/05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e/",
      redirectUri: "https://clearrinsights-testarn.wcgt.in/",
      //validateAuthority : true,
      cacheLocation : "localStorage",
      //storeAuthStateInCookie: false, // dynamically set to true when IE11
      postLogoutRedirectUri: "https://clearrinsights-test.wcgt.in",
      navigateToLoginRequestUrl : true,
      //popUp: true,
      //consentScopes: ["user.read", "api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user"],
      //unprotectedResources: ["https://angularjs.org/"],
      //protectedResourceMap : protectedResourceMap,
      //logger :loggerCallback,
      //correlationId: '1234',
      //level: LogLevel.Verbose,
      //piiLoggingEnabled: true,
    })*/
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyAppComponent,
    PopMenuPage
  ],
  providers: [
    AppAlert,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MsalService,
    //{provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
    
  ]
})


export class AppModule { }
