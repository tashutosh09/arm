import * as metaData from './meta-data.actions';
import { MetaDataState, initialMetaDataState } from './meta-data.state';

export function metaDataReducer(state = initialMetaDataState, action: metaData.Actions): MetaDataState {
  switch (action.type) {
    case metaData.GET: {
      return {
        ...state,
        loading: true
      };
    }

    case metaData.GET_SUCCESS: {

      return {
        ...state,
        loading: false,
        ruleCounts:action.payload
      };
    }

     case metaData.GET_ERROR: {

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
