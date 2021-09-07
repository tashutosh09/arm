import * as Msal from 'msal';
import { Injectable } from '@angular/core';
import {AppSettings} from  './app.settings';
declare var window: any;
//declare var cordova: any;


@Injectable()
export class MsalService{
    public access_token: string;
    public user: string;
    private authority: string;
    private tenantConfig: any;
    private clientApplication: any;
 
    constructor() {
        this.initAuthApp();
       
    }
    public loggerCallback(logLevel, message, piiLoggingEnabled) {
        console.log("?????" + message);
    }

    protected initAuthApp() {
        var __this=this;
        var logger = new Msal.Logger(this.loggerCallback, { level: Msal.LogLevel.Verbose, correlationId:'12345' }); // level and correlationId are optional parameters.
		//Logger has other optional parameters like piiLoggingEnabled which can be assigned as shown aabove. Please refer to the docs to see the full list and their default values.
	
        this.tenantConfig = {
            tenant: AppSettings.tenant, 
            clientID: AppSettings.clientId,
            //signUpSignInPolicy:AppSettings.signUpSignInPolicy,
            //b2cScopes: AppSettings.b2cScopes,
            //webApi: AppSettings.WebApi,
            navigateToLoginRequestUrl: false,
            redirectUri: window.location.origin,
            cacheLocation: "localStorage",
        };
        //this.authority =AppSettings.authority; 
        this.authority =AppSettings.authorityOnly; //Subrata
        this.clientApplication = new Msal.UserAgentApplication(
            this.tenantConfig.clientID, 
            this.authority,
            function (errorDesc: any, token: any, error: any, tokenType: any) {
                if (token) {
                    // Called after loginRedirect or acquireTokenPopup
                    //alert('1:' + token);
                    console.log('Token===========:' + token);


                    //__this.setLoggedInUserData(token);

                }
                else {
                    console.log("ERROR"  + error + ":" + errorDesc);
                }
                
            }, { 
                redirectUri: this.tenantConfig.redirectUri,
                navigateToLoginRequestUrl:false,
                //logger: logger, 
                cacheLocation: 'localStorage'
            }
        );

        //this.clientApplication.redirectUri = AppSettings.RedirectUri;
    }
    // public setLoggedInUserData(token:string):void{      
        
    //     super.setLoggedInUserData(token, this.createUser(token ));
    // }

    public login(): void {
        //this.initAuthApp();
        this.clientApplication.loginRedirect();
    }
   
    public acquireTokenSilent():Promise<any>
    {
      //console.log("acquireToken:"+ JSON.stringify(this.clientApplication.acquireTokenSilent()));
      return   this.clientApplication.acquireTokenSilent()
    }

    public logout(): void {
        
        this.clientApplication.logout();
    };

    public isOnline(): boolean {
        //console.log("=====this.clientApplication.getUser()====="+JSON.stringify(this.clientApplication.getUser()));
        
        return this.clientApplication.getUser() != null; 
    };

    public userProfile(){
        return this.clientApplication.getUser();
    }

 }
