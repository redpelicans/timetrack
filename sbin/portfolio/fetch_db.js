import mongobless from 'mongobless'
import async from 'async'
import { Company, Deal, Product, Quote } from '../../src/server/models'
import params from '../../params'
import { printBench } from './utils'

export const getIds = xs => xs.map(x => x._id)

export const fetchData = (cb) => {
  mongobless.connect(params.db, (err) => {
    printBench("connected")
    if (err) throw err
    async.waterfall([getCompanies, getDeals, getProducts, getQuotes], (err, data) => {
      mongobless.close()
      const {companies, deals, products, quotes} = data

      if (!companies || !deals || !products || !quotes)
        console.log("Someone is missing.")

      printBench("companies, deals, products and quotes fetched")

      cb(data)
    })
  });

  const getCompanies = (done) => {
    Company.findAll({}, done)
  }

  const getDeals = (companies, done) => {
    Deal.findAll({
       companyId: {
         $in: getIds(companies)
       }
     }, (err, deals) => {
       done(err, {companies, deals})
     })
  }

  const getProducts = (data, done) => {
    Product.findAll({
      _id: {
        $in: data.deals.map(x => x.productId)
      }
    }, (err, products) => {
      done(err, {...data, products})
    })
  }

  const getQuotes = (data, done) => {
    Quote.findAll({
      productId: { $in: getIds(data.products) },
      date: { $lte: new Date() }
    }, (err, quotes) => {
      done(err, {...data, quotes})
    })
  }
}
