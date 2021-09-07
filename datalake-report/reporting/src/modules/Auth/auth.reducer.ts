import * as auth from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

export function authReducer(state = initialAuthState, action: auth.Actions): AuthState {
  switch (action.type) {
    case auth.LOGIN: {
      /*return {
        ...state,
        loading: true,
        isReady: false,
        isFromStorage: false,
        errorMessage: null
      }*/
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        isReady: true,
        isFromStorage: false,
        errorMessage: null
      }
    }

    case auth.LOGIN_SUCCESS: {

      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        accessToken: action.payload.results.accessToken,
        expiresIn: action.payload.results.expiresIn,
        systemName: action.payload.results.systemName, 
        displayName: action.payload.results.displayName,
        email: action.payload.results.email,
        isReady: true,
        isFromStorage: false,
        errorMessage: null
      };
    }

    case auth.LOGIN_ERROR: {
      return {
        ...state,
        loading: false,
        isReady: true,
        isFromStorage: false,
        errorMessage: action.payload
      };
    }

    case auth.LOGOUT: {
      return {
        ...initialAuthState,
        isReady: true,
        isFromStorage: false,
        errorMessage: null
      };
    }

    case auth.UPDATE_FROM_STORAGE: {
      return {
        ...action.payload,
        isFromStorage: true,
        errorMessage: null
      };
    }

    case auth.SET_USER_NAME: {
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        systemName: action.payload.username, 
        displayName: action.payload.username,
        email: action.payload.username,
        isReady: true,
        isFromStorage: false,
        errorMessage: null
      };
    }

    default: {
      return state;
    }
  }
}
