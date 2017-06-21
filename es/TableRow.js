var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint no-nested-ternary: 0 */
import classSet from 'classnames';
import Utils from './util';
import React, { Component, PropTypes } from 'react';

var TableRow = function (_Component) {
  _inherits(TableRow, _Component);

  function TableRow(props) {
    _classCallCheck(this, TableRow);

    var _this = _possibleConstructorReturn(this, (TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call(this, props));

    _this.rowClick = function (e) {
      var rowIndex = _this.props.index + 1;
      var cellIndex = e.target.cellIndex;
      if (_this.props.onRowClick) _this.props.onRowClick(rowIndex, cellIndex);
      var _this$props = _this.props,
          selectRow = _this$props.selectRow,
          unselectableRow = _this$props.unselectableRow,
          isSelected = _this$props.isSelected,
          onSelectRow = _this$props.onSelectRow,
          onExpandRow = _this$props.onExpandRow;

      if (selectRow) {
        if (selectRow.clickToSelect && !unselectableRow) {
          onSelectRow(rowIndex, !isSelected, e);
        } else if (selectRow.clickToSelectAndEditCell && !unselectableRow) {
          _this.clickNum++;
          /** if clickToSelectAndEditCell is enabled,
           *  there should be a delay to prevent a selection changed when
           *  user dblick to edit cell on same row but different cell
          **/
          setTimeout(function () {
            if (_this.clickNum === 1) {
              onSelectRow(rowIndex, !isSelected, e);
              onExpandRow(rowIndex, cellIndex);
            }
            _this.clickNum = 0;
          }, 200);
        } else {
          _this.expandRow(rowIndex, cellIndex);
        }
      }
    };

    _this.expandRow = function (rowIndex, cellIndex) {
      _this.clickNum++;
      setTimeout(function () {
        if (_this.clickNum === 1) {
          _this.props.onExpandRow(rowIndex, cellIndex);
        }
        _this.clickNum = 0;
      }, 200);
    };

    _this.rowDoubleClick = function (e) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'TEXTAREA') {
        if (_this.props.onRowDoubleClick) {
          _this.props.onRowDoubleClick(_this.props.index);
        }
      }
    };

    _this.rowMouseOut = function (e) {
      var rowIndex = _this.props.index;
      if (_this.props.onRowMouseOut) {
        _this.props.onRowMouseOut(rowIndex, e);
      }
    };

    _this.rowMouseOver = function (e) {
      var rowIndex = _this.props.index;
      if (_this.props.onRowMouseOver) {
        _this.props.onRowMouseOver(rowIndex, e);
      }
    };

    _this.clickNum = 0;
    return _this;
  }

  _createClass(TableRow, [{
    key: 'render',
    value: function render() {
      this.clickNum = 0;
      var _props = this.props,
          selectRow = _props.selectRow,
          row = _props.row,
          isSelected = _props.isSelected,
          className = _props.className;

      var backgroundColor = null;
      var selectRowClass = null;

      if (selectRow) {
        backgroundColor = Utils.isFunction(selectRow.bgColor) ? selectRow.bgColor(row, isSelected) : isSelected ? selectRow.bgColor : null;

        selectRowClass = Utils.isFunction(selectRow.className) ? selectRow.className(row, isSelected) : isSelected ? selectRow.className : null;
      }

      var trCss = {
        style: { backgroundColor: backgroundColor },
        className: classSet(selectRowClass, className)
      };

      return React.createElement(
        'tr',
        _extends({}, trCss, {
          onMouseOver: this.rowMouseOver,
          onMouseOut: this.rowMouseOut,
          onClick: this.rowClick,
          onDoubleClick: this.rowDoubleClick }),
        this.props.children
      );
    }
  }]);

  return TableRow;
}(Component);

TableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.any,
  isSelected: PropTypes.bool,
  enableCellEdit: PropTypes.bool,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onSelectRow: PropTypes.func,
  onExpandRow: PropTypes.func,
  onRowMouseOut: PropTypes.func,
  onRowMouseOver: PropTypes.func,
  unselectableRow: PropTypes.bool
};
TableRow.defaultProps = {
  onRowClick: undefined,
  onRowDoubleClick: undefined
};
export default TableRow;