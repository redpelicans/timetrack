import _ from 'lodash';
import async from 'async';
import mongobless, {ObjectId} from 'mongobless';

@mongobless({collection: 'products'})
export default class Product {
};
