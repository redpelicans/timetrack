import {ENTER_ROUTE} from '../actions/sitemap';

function sitemapReducer(state={}, action){
  switch(action.type){
    case ENTER_ROUTE:
      return {currentRoute: action.currentRoute}
    default:
      return state;
  }
}

export default sitemapReducer;
