var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Const from './Const';
import { EventEmitter } from 'events';

export var Filter = function (_EventEmitter) {
  _inherits(Filter, _EventEmitter);

  function Filter(data) {
    _classCallCheck(this, Filter);

    var _this = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, data));

    _this.currentFilter = {};
    return _this;
  }

  _createClass(Filter, [{
    key: 'handleFilter',
    value: function handleFilter(dataField, value, type, filterObj) {
      var filterType = type || Const.FILTER_TYPE.CUSTOM;

      var props = {
        cond: filterObj.condition // Only for select and text filter
      };

      if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        // value of the filter is an object
        var hasValue = true;
        for (var prop in value) {
          if (!value[prop] || value[prop] === '') {
            hasValue = false;
            break;
          }
        }
        // if one of the object properties is undefined or empty, we remove the filter
        if (hasValue) {
          this.currentFilter[dataField] = { value: value, type: filterType, props: props };
        } else {
          delete this.currentFilter[dataField];
        }
      } else if (!value || value.trim() === '') {
        delete this.currentFilter[dataField];
      } else {
        this.currentFilter[dataField] = { value: value.trim(), type: filterType, props: props };
      }
      this.emit('onFilterChange', this.currentFilter);
    }
  }]);

  return Filter;
}(EventEmitter);