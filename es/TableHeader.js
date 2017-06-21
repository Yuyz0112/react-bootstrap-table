var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Const from './Const';
import classSet from 'classnames';
import SelectRowHeaderColumn from './SelectRowHeaderColumn';

var Checkbox = function (_Component) {
  _inherits(Checkbox, _Component);

  function Checkbox() {
    _classCallCheck(this, Checkbox);

    return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
  }

  _createClass(Checkbox, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.update(this.props.checked);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      this.update(props.checked);
    }
  }, {
    key: 'update',
    value: function update(checked) {
      ReactDOM.findDOMNode(this).indeterminate = checked === 'indeterminate';
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('input', { className: 'react-bs-select-all',
        type: 'checkbox',
        checked: this.props.checked,
        onChange: this.props.onChange });
    }
  }]);

  return Checkbox;
}(Component);

function getSortOrder(sortList, field, enableSort) {
  if (!enableSort) return undefined;
  var result = sortList.filter(function (sortObj) {
    return sortObj.sortField === field;
  });
  if (result.length > 0) {
    return result[0].order;
  } else {
    return undefined;
  }
}

var TableHeader = function (_Component2) {
  _inherits(TableHeader, _Component2);

  function TableHeader() {
    var _ref;

    var _temp, _this2, _ret;

    _classCallCheck(this, TableHeader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = TableHeader.__proto__ || Object.getPrototypeOf(TableHeader)).call.apply(_ref, [this].concat(args))), _this2), _this2.getHeaderColGrouop = function () {
      return _this2.refs.headerGrp.childNodes;
    }, _temp), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(TableHeader, [{
    key: 'render',
    value: function render() {
      var containerClasses = classSet('react-bs-container-header', 'table-header-wrapper', this.props.headerContainerClass);
      var tableClasses = classSet('table', 'table-hover', {
        'table-bordered': this.props.bordered,
        'table-condensed': this.props.condensed
      }, this.props.tableHeaderClass);

      var rowCount = Math.max.apply(Math, _toConsumableArray(React.Children.map(this.props.children, function (elm) {
        return elm && elm.props.row ? Number(elm.props.row) : 0;
      })));

      var rows = [];
      var rowKey = 0;

      rows[0] = [];
      rows[0].push([this.props.expandColumnVisible && this.props.expandColumnBeforeSelectColumn && React.createElement(
        'th',
        { className: 'react-bs-table-expand-cell' },
        ' '
      )], [this.renderSelectRowHeader(rowCount + 1, rowKey++)], [this.props.expandColumnVisible && !this.props.expandColumnBeforeSelectColumn && React.createElement(
        'th',
        { className: 'react-bs-table-expand-cell' },
        ' '
      )]);
      var _props = this.props,
          sortIndicator = _props.sortIndicator,
          sortList = _props.sortList,
          onSort = _props.onSort,
          reset = _props.reset;


      React.Children.forEach(this.props.children, function (elm) {
        if (elm === null || elm === undefined) {
          // Skip null or undefined elements.
          return;
        }
        var _elm$props = elm.props,
            dataField = _elm$props.dataField,
            dataSort = _elm$props.dataSort;

        var sort = getSortOrder(sortList, dataField, dataSort);
        var rowIndex = elm.props.row ? Number(elm.props.row) : 0;
        var rowSpan = elm.props.rowSpan ? Number(elm.props.rowSpan) : 1;
        if (rows[rowIndex] === undefined) {
          rows[rowIndex] = [];
        }
        if (rowSpan + rowIndex === rowCount + 1) {
          rows[rowIndex].push(React.cloneElement(elm, { reset: reset, key: rowKey++, onSort: onSort, sort: sort, sortIndicator: sortIndicator, isOnlyHead: false }));
        } else {
          rows[rowIndex].push(React.cloneElement(elm, { key: rowKey++, isOnlyHead: true }));
        }
      });

      var trs = rows.map(function (row, indexRow) {
        return React.createElement(
          'tr',
          { key: indexRow },
          row
        );
      });

      return React.createElement(
        'div',
        { ref: 'container', className: containerClasses, style: this.props.style },
        React.createElement(
          'table',
          { className: tableClasses },
          React.cloneElement(this.props.colGroups, { ref: 'headerGrp' }),
          React.createElement(
            'thead',
            { ref: 'header' },
            trs
          )
        )
      );
    }
  }, {
    key: 'renderSelectRowHeader',
    value: function renderSelectRowHeader(rowCount, rowKey) {
      if (this.props.hideSelectColumn) {
        return null;
      } else if (this.props.customComponent) {
        var CustomComponent = this.props.customComponent;
        return React.createElement(
          SelectRowHeaderColumn,
          { key: rowKey, rowCount: rowCount },
          React.createElement(CustomComponent, { type: 'checkbox', checked: this.props.isSelectAll,
            indeterminate: this.props.isSelectAll === 'indeterminate', disabled: false,
            onChange: this.props.onSelectAllRow, rowIndex: 'Header' })
        );
      } else if (this.props.rowSelectType === Const.ROW_SELECT_SINGLE) {
        return React.createElement(SelectRowHeaderColumn, { key: rowKey, rowCount: rowCount });
      } else if (this.props.rowSelectType === Const.ROW_SELECT_MULTI) {
        return React.createElement(
          SelectRowHeaderColumn,
          { key: rowKey, rowCount: rowCount },
          React.createElement(Checkbox, {
            onChange: this.props.onSelectAllRow,
            checked: this.props.isSelectAll })
        );
      } else {
        return null;
      }
    }
  }]);

  return TableHeader;
}(Component);

TableHeader.propTypes = {
  headerContainerClass: PropTypes.string,
  tableHeaderClass: PropTypes.string,
  style: PropTypes.object,
  rowSelectType: PropTypes.string,
  onSort: PropTypes.func,
  onSelectAllRow: PropTypes.func,
  sortList: PropTypes.array,
  hideSelectColumn: PropTypes.bool,
  bordered: PropTypes.bool,
  condensed: PropTypes.bool,
  isFiltered: PropTypes.bool,
  isSelectAll: PropTypes.oneOf([true, 'indeterminate', false]),
  sortIndicator: PropTypes.bool,
  customComponent: PropTypes.func,
  colGroups: PropTypes.element,
  reset: PropTypes.bool,
  expandColumnVisible: PropTypes.bool,
  expandColumnComponent: PropTypes.func,
  expandColumnBeforeSelectColumn: PropTypes.bool
};

export default TableHeader;