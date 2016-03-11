// run as: "babel-node --stage 0 main.js"

import _ from 'lodash'
import { fetchData } from './fetch_db'
import { printBench, id, add, sub, foldl } from './utils'

const hashBy = it => xs => f => _
  .chain(xs)
  .groupBy(it)
  .mapValues(([v]) => f (v))
  .toPlainObject()
  .value()

const constructCompanies = products => quotes => foldl ( (companies, deal) => {
  const product = products[deal.productId.toString()]
  product.price = quotes[product._id].price
  companies[deal.companyId].deals.push({...deal, product})
  return companies
})


const calcPosition = (total, deal, calc) =>
  calc (total) (deal.product.price * deal.quantity)

  const calcAllPositions = foldl ((total, deal) =>
    deal.buyOrSell === "buy" ?
      calcPosition(total, deal, add)
    : calcPosition(total, deal, sub)
  ) (0)



// Entry point
printBench("BEGIN")
fetchData(data => {                                 // Fetch data on DB

  const companies = constructCompanies
      (hashBy ('_id') (data.products) (id))
      (hashBy ('productId') (data.quotes) (id))
      (hashBy ('_id') (data.companies) ((o) => { return { ...o, deals: [] } }))   // Accumulator for partial foldl
      (data.deals)                                                                // Traversable for partial foldl

  // compute here
  _.forEach(companies, company => {
    const total = calcAllPositions(company.deals)
    console.log("[" + total + "] - " + company.name)
  })

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
