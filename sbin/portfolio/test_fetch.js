import _ from 'lodash'
import mongobless from 'mongobless'
import params from '../../params'

/*** Bench ***/
let benchTime = Date.now()
export const printBench = (str = "") => {
  console.log("[" + Math.floor(Date.now() - benchTime) / 1000 + "s] - " + str)
  benchTime = Date.now()
}

/*** Connection ***/
 printBench("connecting...")
 mongobless.connect(params.db, (err) => {
    printBench("connected.")
    mongobless.close()
    printBench("closed.")
 })
