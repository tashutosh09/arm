export class AppSettings {

    public static tenant = "05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e";//GT
    public static clientId = 'b31826af-124a-4267-be3a-25d155a435ab';//GT

    //public static tenant = "3e1ac12e-949e-46ae-9303-2f391e4f8b76";//Boenci
    //public static clientId = 'd075bff8-3205-4433-abc3-edd18a4674be';//Boenci

    //public static signUpSignInPolicy = "b2c_1_susi";
    //public static Scopes = [ "https://clearrinsights-testarn.wcgt.in/"]; 
    //public static WebApi = [ "https://clearrinsights-testarn.wcgt.in/"];
    public static authorityOnly = "https://login.microsoftonline.com/"+ AppSettings.tenant ;//+ "/";
    //public static authority = AppSettings.authorityOnly + AppSettings.signUpSignInPolicy; 
   //public static B2C_AD_RedirectUri_MobileDevice = "msal"+AppSettings.clientId+"://auth";
    public static RedirectUri = "https://clearrinsights-testarn.wcgt.in/";
    //public static RedirectUri = "window.location.origin";
    //public static B2C_AD_RedirectUri =  AppSettings.B2C_AD_RedirectUri_Browser;
    public static cacheLocation = "localstorage"; 
    public static consentScopes: "['user.readbasic.all', 'calendars.read']";

}
