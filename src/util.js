import R from 'ramda';

const merge = (a, b) => R.is(Object, a) && R.is(Object, b) ? deepMerge(a, b) : b;
export const deepMerge = (a, b) => R.mergeWith(merge, a, b);
