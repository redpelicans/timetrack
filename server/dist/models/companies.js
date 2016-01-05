'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var Company = (function () {
  function Company() {
    _classCallCheck(this, _Company);
  }

  _createClass(Company, [{
    key: 'equals',
    value: function equals(company) {
      return this._id.equals(company._id);
    }
  }], [{
    key: 'bless',

    // constructor({type='step', title, description, startDate, dueDate, progress, projectId, userId} = {}){
    //   this.type = type;
    //   this.title = title;
    //   if(description)this.description = description;
    //   if(startDate)this.startDate = startDate;
    //   if(dueDate)this.dueDate = dueDate;
    //   if(progress || progress == 0)this.establishedProgress = progress;
    //   this.projectId = projectId;
    //   this.userId = userId;
    //  
    // }

    value: function bless(obj) {
      switch (obj.type) {
        case 'client':
          return _mongobless2['default'].bless.bind(Client)(obj);
        case 'tenant':
          return _mongobless2['default'].bless.bind(Tenant)(obj);
        default:
          return _mongobless2['default'].bless.bind(Company)(obj);
      }
    }
  }]);

  var _Company = Company;
  Company = (0, _mongobless2['default'])({ collection: 'companies' })(Company) || Company;
  return Company;
})();

exports.Company = Company;

var Client = (function (_Company2) {
  _inherits(Client, _Company2);

  function Client() {
    _classCallCheck(this, _Client);

    _get(Object.getPrototypeOf(_Client.prototype), 'constructor', this).apply(this, arguments);
  }

  var _Client = Client;
  Client = (0, _mongobless2['default'])()(Client) || Client;
  return Client;
})(Company);

exports.Client = Client;

var Tenant = (function (_Company3) {
  _inherits(Tenant, _Company3);

  function Tenant() {
    _classCallCheck(this, _Tenant);

    _get(Object.getPrototypeOf(_Tenant.prototype), 'constructor', this).apply(this, arguments);
  }

  var _Tenant = Tenant;
  Tenant = (0, _mongobless2['default'])()(Tenant) || Tenant;
  return Tenant;
})(Company);

exports.Tenant = Tenant;
//# sourceMappingURL=companies.js.map
