import * as feed from './feed.actions';
import { FeedState, initialFeedState } from './feed.state';

export function feedReducer(state = initialFeedState, action: feed.Actions): FeedState {

    switch (action.type) {
      case feed.GET: {
        return {
          ...state,
          loading: true
        }
      }
      case feed.GET_SUCCESS: {
        return {
          ...state,
          loading: false,
          result: action.payload
        };
      }
      case feed.GET_ERROR: {
        return {
          ...state,
          loading: false,
        };
      }
      case feed.RESET_FEEDS: {
        return {
          result:[],
          loading: false,
        };
      }
      default: {
        return state;
      }
    }
    
}
  