import alt from '../../alt';
import { createActions } from 'alt/utils/decorators';

@createActions(alt)
export default class CompanyActions {
  constructor(){
    this.generateActions(
        'fetch'
      , 'loading'
      , 'loaded'
      , 'fetchFailed'
      , 'filterMainList'
      , 'filterStarredList'
      , 'sortMainList'
      , 'star'
      , 'starred'
    );
  }
}

