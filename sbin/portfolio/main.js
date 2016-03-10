// run as: "babel-node --stage 0 main.js"

import _ from 'lodash'
import { fetchData } from './fetch_db'
import { printBench, add, sub, foldl } from './utils'


const prepareHashCompanies = (companies) => _
  .chain(companies)
  .groupBy('_id')
  .mapValues(([v]) => { return {...v, deals: []} })
  .toPlainObject()
  .value()


const constructCompanies = (products, quotes) => foldl ( (companies, deal) => {
  const id = deal.companyId
  const product = products.find(x => x._id.toString() === deal.productId.toString())
  const d = {...deal, product}

  companies[id].deals.push(d)
  return companies
})

// Entry point for computation
printBench("BEGIN")
fetchData(data => {                           // Fetch data on DB
  printBench("Construct companies")

  const companies = constructCompanies
      (data.products, data.quotes)            // Tuple as first argument
      (prepareHashCompanies(data.companies))  // Accumulator for partial foldl
      (data.deals)                            // Traversable for partial foldl
  //console.log(_.map(companies, x => x.deals[0])[0])
  printBench("END")
})




/*
mongobless.connect(params.db, (err) => {
  if (err) throw err
  async.waterfall([getAllCompanies, mapCompanies], (err, companies) => {
    mongobless.close()
    companies.forEach(x => {console.log(computeCompanyPositions(x))})
  })
});

const getAllCompanies = (done) => {
  Company.findAll({}, done)
}

const mapCompanies = (companies, done) => {
  async.map(companies, mapDeals, (err, companies) => {
    done(err, companies)
  })
}

const calcPrice = (total, deal, calc) => calc (total) (deal.product.price * deal.quantity)
const computeCompanyPositions = company => company.deals.reduce((total, deal) =>
  (deal.buyOrSell == "buy") ? calcPrice(total, deal, add) : calcPrice(total, deal, sub)
, 0)

const mapDeals = (company, done) => {
  Deal.findAll({companyId: company._id}, (err, deals) => {

    async.map(deals, (deal, cb) => {
      getProductByDeal(deal, cb)
    }, (err, deals) => {
      done (err, { ...company, deals })
    })

  })
}

const getProductByDeal = (deal, done) => {
  Product.findOne({_id: deal.productId}, (err, product) => {
    Quote.findOne({ date: { $lte: new Date() }, productId: product._id }, (err, quote) => {
      const price = quote ? quote.price : 0
      done(err, { ...deal, product: { ...product, price } })
    })
  })
}
*/
