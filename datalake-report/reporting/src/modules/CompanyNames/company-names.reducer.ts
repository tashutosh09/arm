import * as companyNames from './company-names.actions';
import { CompanyNamesState, initialCompanyNamesState } from './company-names.state';

export function companyNamesReducer(state = initialCompanyNamesState, action: companyNames.Actions): CompanyNamesState {
  switch (action.type) {
    case companyNames.GET: {
      return {
        ...state,
        loading: true
      }
    }

    case companyNames.GET_SUCCESS: {

      return {
        ...state,
        loading: false,
        result: action.payload
      };
    }

    case companyNames.GET_ERROR: {

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
