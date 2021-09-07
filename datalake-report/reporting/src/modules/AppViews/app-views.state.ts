export interface AppViewsState {
    title:string;
    page: string,
    pageData?: any
    showSmallMenu: boolean;
}

export const initialAppViewsState: AppViewsState = {
    title: 'Audit Reporting',
    //page: 'SplashPage',
    page: 'DashboardPage',
    showSmallMenu: false
};
