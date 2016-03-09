import _ from 'lodash';
import async from 'async';
import mongobless, {ObjectId} from 'mongobless';

@mongobless({collection: 'deals'})
export default class Deal {
};
