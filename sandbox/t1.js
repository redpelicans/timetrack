import config from '../config';
import { deepMerge } from '../src/util';

console.log(deepMerge({a: 2, d: 4, e: 1}, {a: {x: 1}, c: 3, e: { a: 2, c: 3}}));
