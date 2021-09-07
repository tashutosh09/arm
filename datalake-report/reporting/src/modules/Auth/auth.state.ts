export interface AuthState {
    loading: boolean;
    isLoggedIn: boolean;
    accessToken: string;
    expiresIn: number;
    systemName: string;
    isReady: boolean;
    isFromStorage: boolean;
    displayName: string;
    email: string;
    errorMessage: string;
}

export const initialAuthState: AuthState = {
    loading: false,
    isLoggedIn: false,
    accessToken: null,
    expiresIn: 0,
    systemName: null,
    isReady: false,
    isFromStorage: false,
    displayName: null,
    email: null,
    errorMessage: null
}