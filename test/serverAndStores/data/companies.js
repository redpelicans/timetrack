var ObjectId = require('mongobless').ObjectId;
export let data={
  collections:{
    companies: [
      {
        "type" : "client",
        "name" : "Jacobs - Waters",
        "phones" : [
          {
            "label" : "sensor",
            "phone" : "(282) 360-9506 x474"
          },
          {
            "label" : "card",
            "phone" : "(912) 039-8735"
          },
          {
            "label" : "bus",
            "phone" : "1-939-925-5062 x9918"
          }
        ],
        "address" : {
          "number" : 52809,
          "street" : "Spencer Lights",
          "country" : "San Marino"
        },
        "website" : "http://rahul.info",
        "createdAt" : new Date(),
      },
      {
        "type" : "client",
        "name" : "Kub Inc",
        "phones" : [
          {
            "label" : "capacitor",
            "phone" : "1-011-622-2223 x704"
          },
          {
            "label" : "bandwidth",
            "phone" : "666.354.6605 x02463"
          }
        ],
        "address" : {
          "number" : 89247,
          "street" : "Crist Drive",
          "country" : "Comoros"
        },
        "website" : "http://oma.net",
        "createdAt" : new Date(),
      }]
    }
}
