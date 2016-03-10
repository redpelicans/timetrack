import _ from 'lodash'

/*** Bench ***/
let benchTime = Date.now()
export const printBench = (str = "") => {
  console.log("[" + Math.floor(Date.now() - benchTime) / 1000 + "s] - " + str)
  benchTime = Date.now()
}

/*** Utils ***/
export const id = x => x
export const add = x => y => x + y
export const sub = x => y => x - y
export const foldl = f => acc => xs => _.reduce(xs, f, acc)
