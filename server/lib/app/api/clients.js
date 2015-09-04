'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

_faker2['default'].locale = 'en';

var fakeSchema = {
  id: 'random.uuid',
  name: 'company.companyName',
  phones: [{
    label: 'hacker.noun',
    phone: 'phone.phoneNumber'
  }],
  address: {
    number: 'random.number',
    street: 'address.streetName',
    country: 'address.country'
  },
  emails: ['internet.email'],
  website: 'internet.url',
  color: 'internet.color',
  image: 'internet.avatar',
  legalForm: 'hacker.adjective',
  createdAt: 'date.recent',
  note: 'lorem.paragraphs'
};

// const locale = "fr";
// const fakerUrl = "http://faker.hook.io?property=";
//
//
// function requestFakeObject(schema, cb){
//   function requestFakeProperty(property, cb){
//     if(typeof schema[property] === 'string'){
//       let options = {
//         url: fakerUrl + schema[property],
//         headers: { 'Content-Type': 'application/json'}
//       };
//       request(options, (err, res, body) => {
//         if(err || res.statusCode != 200) return cb(null, {[property]: 'unknown'});
//         console.log(body)
//         cb(null, {[property]: JSON.parse(body)});
//       });
//     }else{
//       cb(null, {[property]: 'unknown'});
//     }
//   }
//
//   async.map(
//     Object.keys(schema),
//     requestFakeProperty,
//     (err, data) => {
//       if(err)return next(err);
//       cb(null, _.assign(...data));
//     }
//   )
// }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeFakeObject(schema) {
  function fakeMe(property) {
    var _property$split = property.split('.');

    var _property$split2 = _slicedToArray(_property$split, 2);

    var p1 = _property$split2[0];
    var p2 = _property$split2[1];

    return _faker2['default'][p1][p2]();
  }

  var res = {};
  //for(let [key, property] of Object.entries(schema)){
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function () {
      var _step$value = _slicedToArray(_step.value, 2);

      var key = _step$value[0];
      var property = _step$value[1];

      if (_lodash2['default'].isString(property)) {
        res[key] = fakeMe(property);
      } else if (_lodash2['default'].isArray(property)) {
        if (_lodash2['default'].isString(property[0])) {
          res[key] = _lodash2['default'].times(getRandomInt(1, 3), function () {
            return fakeMe(property[0]);
          });
        } else {
          res[key] = _lodash2['default'].times(getRandomInt(1, 3), function () {
            return makeFakeObject(property[0]);
          });
        }
      } else if (_lodash2['default'].isObject(property)) {
        res[key] = makeFakeObject(property);
      }
    };

    for (var _iterator = _lodash2['default'].pairs(schema)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return res;
}

function init(app) {
  app.get('/clients', function (req, res, next) {
    //let obj = makeFakeObject(fakeSchema);
    res.json(_lodash2['default'].times(getRandomInt(10, 30), makeFakeObject.bind(null, fakeSchema)));
  });
}
//# sourceMappingURL=../../app/api/clients.js.map