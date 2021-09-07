import * as appConfig from './app-config.actions';
import { AppConfigState, initialAppConfigState } from './app-config.state';

export function appConfigReducer(state = initialAppConfigState, action: appConfig.Actions): AppConfigState {
  switch (action.type) {
    case appConfig.GET_CONFIG: {
      return {
        ...state,
        loading: true
      }
    }

    case appConfig.GET_CONFIG_SUCCESS: {

      return {
        ...state,
        loading: false,
        config: action.payload
      };
    }

    case appConfig.GET_CONFIG_ERROR: {

      return {
        ...state,
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}
