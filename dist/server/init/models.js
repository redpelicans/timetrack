'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

// load models

var _models = require('../models');

var _ = require('lodash'),
    debug = require('debug')('timetrack:models');

function init(params) {
  return function (cb) {
    _mongobless2['default'].connect(_.extend({ verbose: false }, params), function (err, db) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      ensureIndexes(function (err) {
        debug('Timetrack models are ready to help you ...');
        cb(err, db);
      });
    });
  };
}

// TODO: should be transfered to mongobless: one day ....
function ensureIndexes(cb) {
  _async2['default'].parallel([person_email, person_company_id, person_skills, company_country, company_city, company_tags, person_tags, note_entityId], cb);
}

function person_email(cb) {
  //Person.collection.ensureIndex({email:1}, {unique: true, sparse: true, background: true}, cb);
  _models.Person.collection.ensureIndex({ email: 1 }, { unique: false, background: true }, cb);
}

function person_company_id(cb) {
  _models.Person.collection.ensureIndex({ company_id: 1 }, { background: true }, cb);
}

function note_entityId(cb) {
  _models.Note.collection.ensureIndex({ entityId: 1 }, { background: true }, cb);
}

function person_skills(cb) {
  _models.Person.collection.ensureIndex({ skills: 1 }, { background: true }, cb);
}

function company_city(cb) {
  _models.Company.collection.ensureIndex({ 'address.city': 1 }, { background: true }, cb);
}

function company_country(cb) {
  _models.Company.collection.ensureIndex({ 'address.country': 1 }, { background: true }, cb);
}

function company_tags(cb) {
  _models.Company.collection.ensureIndex({ 'tags': 1 }, { background: true }, cb);
}

function person_tags(cb) {
  _models.Person.collection.ensureIndex({ 'tags': 1 }, { background: true }, cb);
}
module.exports = exports['default'];
//# sourceMappingURL=models.js.map
