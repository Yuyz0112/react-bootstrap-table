var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import Const from './Const';
import classSet from 'classnames';

var TableFilter = function (_Component) {
  _inherits(TableFilter, _Component);

  function TableFilter(props) {
    _classCallCheck(this, TableFilter);

    var _this = _possibleConstructorReturn(this, (TableFilter.__proto__ || Object.getPrototypeOf(TableFilter)).call(this, props));

    _this.handleKeyUp = function (e) {
      var _e$currentTarget = e.currentTarget,
          value = _e$currentTarget.value,
          name = _e$currentTarget.name;

      if (value.trim() === '') {
        delete _this.filterObj[name];
      } else {
        _this.filterObj[name] = value;
      }
      _this.props.onFilter(_this.filterObj);
    };

    _this.filterObj = {};
    return _this;
  }

  _createClass(TableFilter, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          striped = _props.striped,
          condensed = _props.condensed,
          rowSelectType = _props.rowSelectType,
          columns = _props.columns;

      var tableClasses = classSet('table', {
        'table-striped': striped,
        'table-condensed': condensed
      });
      var selectRowHeader = null;

      if (rowSelectType === Const.ROW_SELECT_SINGLE || rowSelectType === Const.ROW_SELECT_MULTI) {
        var style = {
          width: 35,
          paddingLeft: 0,
          paddingRight: 0
        };
        selectRowHeader = React.createElement(
          'th',
          { style: style, key: -1 },
          'Filter'
        );
      }

      var filterField = columns.map(function (column) {
        var hidden = column.hidden,
            width = column.width,
            name = column.name;

        var thStyle = {
          display: hidden ? 'none' : null,
          width: width
        };
        return React.createElement(
          'th',
          { key: name, style: thStyle },
          React.createElement(
            'div',
            { className: 'th-inner table-header-column' },
            React.createElement('input', { size: '10', type: 'text',
              placeholder: name, name: name, onKeyUp: this.handleKeyUp })
          )
        );
      }, this);

      return React.createElement(
        'table',
        { className: tableClasses, style: { marginTop: 5 } },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            { style: { borderBottomStyle: 'hidden' } },
            selectRowHeader,
            filterField
          )
        )
      );
    }
  }]);

  return TableFilter;
}(Component);

TableFilter.propTypes = {
  columns: PropTypes.array,
  rowSelectType: PropTypes.string,
  onFilter: PropTypes.func
};
export default TableFilter;