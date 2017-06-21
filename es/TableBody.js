var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import Utils from './util';
import Const from './Const';
import TableRow from './TableRow';
import TableColumn from './TableColumn';
import TableEditColumn from './TableEditColumn';
import classSet from 'classnames';
import ExpandComponent from './ExpandComponent';

var TableBody = function (_Component) {
  _inherits(TableBody, _Component);

  function TableBody(props) {
    _classCallCheck(this, TableBody);

    var _this = _possibleConstructorReturn(this, (TableBody.__proto__ || Object.getPrototypeOf(TableBody)).call(this, props));

    _this.handleCellKeyDown = function (e, lastEditCell) {
      e.preventDefault();
      var _this$props = _this.props,
          keyBoardNav = _this$props.keyBoardNav,
          onNavigateCell = _this$props.onNavigateCell,
          cellEdit = _this$props.cellEdit;

      var offset = void 0;
      if (e.keyCode === 37) {
        offset = { x: -1, y: 0 };
      } else if (e.keyCode === 38) {
        offset = { x: 0, y: -1 };
      } else if (e.keyCode === 39 || e.keyCode === 9) {
        offset = { x: 1, y: 0 };
        if (e.keyCode === 9 && lastEditCell) {
          offset = _extends({}, offset, {
            lastEditCell: lastEditCell
          });
        }
      } else if (e.keyCode === 40) {
        offset = { x: 0, y: 1 };
      } else if (e.keyCode === 13) {
        var enterToEdit = (typeof keyBoardNav === 'undefined' ? 'undefined' : _typeof(keyBoardNav)) === 'object' ? keyBoardNav.enterToEdit : false;
        var enterToExpand = (typeof keyBoardNav === 'undefined' ? 'undefined' : _typeof(keyBoardNav)) === 'object' ? keyBoardNav.enterToExpand : false;

        if (cellEdit && enterToEdit) {
          _this.handleEditCell(e.target.parentElement.rowIndex + 1, e.currentTarget.cellIndex, '', e);
        }

        if (enterToExpand) {
          _this.handleClickCell(_this.props.y + 1, _this.props.x);
        }
      }
      if (offset && keyBoardNav) {
        onNavigateCell(offset);
      }
    };

    _this.handleRowMouseOut = function (rowIndex, event) {
      var targetRow = _this.props.data[rowIndex];
      _this.props.onRowMouseOut(targetRow, event);
    };

    _this.handleRowMouseOver = function (rowIndex, event) {
      var targetRow = _this.props.data[rowIndex];
      _this.props.onRowMouseOver(targetRow, event);
    };

    _this.handleRowClick = function (rowIndex, cellIndex) {
      var onRowClick = _this.props.onRowClick;

      if (_this._isSelectRowDefined()) cellIndex--;
      if (_this._isExpandColumnVisible()) cellIndex--;
      onRowClick(_this.props.data[rowIndex - 1], rowIndex - 1, cellIndex);
    };

    _this.handleRowDoubleClick = function (rowIndex) {
      var onRowDoubleClick = _this.props.onRowDoubleClick;

      var targetRow = _this.props.data[rowIndex];
      onRowDoubleClick(targetRow);
    };

    _this.handleSelectRow = function (rowIndex, isSelected, e) {
      var selectedRow = void 0;
      var _this$props2 = _this.props,
          data = _this$props2.data,
          onSelectRow = _this$props2.onSelectRow;

      data.forEach(function (row, i) {
        if (i === rowIndex - 1) {
          selectedRow = row;
          return false;
        }
      });
      onSelectRow(selectedRow, isSelected, e);
    };

    _this.handleSelectRowColumChange = function (e, rowIndex) {
      if (!_this.props.selectRow.clickToSelect || !_this.props.selectRow.clickToSelectAndEditCell) {
        _this.handleSelectRow(rowIndex + 1, e.currentTarget.checked, e);
      }
    };

    _this.handleClickCell = function (rowIndex) {
      var columnIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      var _this$props3 = _this.props,
          columns = _this$props3.columns,
          keyField = _this$props3.keyField,
          expandBy = _this$props3.expandBy,
          expandableRow = _this$props3.expandableRow,
          _this$props3$selectRo = _this$props3.selectRow,
          clickToExpand = _this$props3$selectRo.clickToExpand,
          hideSelectColumn = _this$props3$selectRo.hideSelectColumn,
          onlyOneExpanding = _this$props3.onlyOneExpanding;

      var selectRowAndExpand = _this._isSelectRowDefined() && !clickToExpand ? false : true;
      columnIndex = _this._isSelectRowDefined() && !hideSelectColumn ? columnIndex - 1 : columnIndex;
      columnIndex = _this._isExpandColumnVisible() ? columnIndex - 1 : columnIndex;
      if (expandableRow && selectRowAndExpand && (expandBy === Const.EXPAND_BY_ROW ||
      /* Below will allow expanding trigger by clicking on selection column
      if configure as expanding by column */
      expandBy === Const.EXPAND_BY_COL && columnIndex < 0 || expandBy === Const.EXPAND_BY_COL && columns[columnIndex].expandable)) {
        var expanding = _this.props.expanding;
        var rowKey = _this.props.data[rowIndex - 1][keyField];
        var isRowExpanding = expanding.indexOf(rowKey) > -1;

        if (isRowExpanding) {
          // collapse
          expanding = expanding.filter(function (k) {
            return k !== rowKey;
          });
        } else {
          // expand
          if (onlyOneExpanding) expanding = [rowKey];else expanding.push(rowKey);
        }
        _this.props.onExpand(expanding, rowKey, isRowExpanding);
      }
    };

    _this.handleEditCell = function (rowIndex, columnIndex, action, e) {
      var selectRow = _this.props.selectRow;

      var defineSelectRow = _this._isSelectRowDefined();
      var expandColumnVisible = _this._isExpandColumnVisible();
      if (defineSelectRow) {
        columnIndex--;
        if (selectRow.hideSelectColumn) columnIndex++;
      }
      if (expandColumnVisible) {
        columnIndex--;
      }
      rowIndex--;

      if (action === 'tab') {
        if (defineSelectRow && !selectRow.hideSelectColumn) columnIndex++;
        if (expandColumnVisible) columnIndex++;
        _this.handleCompleteEditCell(e.target.value, rowIndex, columnIndex - 1);
        if (columnIndex >= _this.props.columns.length) {
          _this.handleCellKeyDown(e, true);
        } else {
          _this.handleCellKeyDown(e);
        }

        var _this$nextEditableCel = _this.nextEditableCell(rowIndex, columnIndex),
            nextRIndex = _this$nextEditableCel.nextRIndex,
            nextCIndex = _this$nextEditableCel.nextCIndex;

        rowIndex = nextRIndex;
        columnIndex = nextCIndex;
      }

      var stateObj = {
        currEditCell: {
          rid: rowIndex,
          cid: columnIndex
        }
      };

      if (_this.props.selectRow.clickToSelectAndEditCell && _this.props.cellEdit.mode !== Const.CELL_EDIT_DBCLICK) {
        var selected = _this.props.selectedRowKeys.indexOf(_this.props.data[rowIndex][_this.props.keyField]) !== -1;
        _this.handleSelectRow(rowIndex + 1, !selected, e);
      }
      _this.setState(function () {
        return stateObj;
      });
    };

    _this.nextEditableCell = function (rIndex, cIndex) {
      var keyField = _this.props.keyField;

      var nextRIndex = rIndex;
      var nextCIndex = cIndex;
      var row = void 0;
      var column = void 0;
      do {
        if (nextCIndex >= _this.props.columns.length) {
          nextRIndex++;
          nextCIndex = 0;
        }
        row = _this.props.data[nextRIndex];
        column = _this.props.columns[nextCIndex];
        if (!row) break;
        var editable = column.editable;
        if (Utils.isFunction(column.editable)) {
          editable = column.editable(column, row, nextRIndex, nextCIndex);
        }
        if (editable && editable.readOnly !== true && !column.hidden && keyField !== column.name) {
          break;
        } else {
          nextCIndex++;
        }
      } while (row);
      return { nextRIndex: nextRIndex, nextCIndex: nextCIndex };
    };

    _this.handleCompleteEditCell = function (newVal, rowIndex, columnIndex) {
      if (newVal !== null) {
        var result = _this.props.cellEdit.__onCompleteEdit__(newVal, rowIndex, columnIndex);
        if (result !== Const.AWAIT_BEFORE_CELL_EDIT) {
          _this.setState(function () {
            return { currEditCell: null };
          });
        }
      } else {
        _this.setState(function () {
          return { currEditCell: null };
        });
      }
    };

    _this.cancelEditCell = function () {
      _this.setState(function () {
        return { currEditCell: null };
      });
    };

    _this.handleClickonSelectColumn = function (e, isSelect, rowIndex, row) {
      e.stopPropagation();
      if (e.target.tagName === 'TD' && (_this.props.selectRow.clickToSelect || _this.props.selectRow.clickToSelectAndEditCell)) {
        var unselectable = _this.props.selectRow.unselectable || [];
        if (unselectable.indexOf(row[_this.props.keyField]) === -1) {
          _this.handleSelectRow(rowIndex + 1, isSelect, e);
          _this.handleClickCell(rowIndex + 1);
        }
      }
    };

    _this.getHeaderColGrouop = function () {
      return _this.refs.header.childNodes;
    };

    _this.state = {
      currEditCell: null
    };
    return _this;
  }

  _createClass(TableBody, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          cellEdit = _props.cellEdit,
          beforeShowError = _props.beforeShowError,
          x = _props.x,
          y = _props.y,
          keyBoardNav = _props.keyBoardNav;

      var tableClasses = classSet('table', {
        'table-striped': this.props.striped,
        'table-bordered': this.props.bordered,
        'table-hover': this.props.hover,
        'table-condensed': this.props.condensed
      }, this.props.tableBodyClass);

      var noneditableRows = cellEdit.nonEditableRows && cellEdit.nonEditableRows() || [];
      var unselectable = this.props.selectRow.unselectable || [];
      var isSelectRowDefined = this._isSelectRowDefined();
      var tableHeader = Utils.renderColGroup(this.props.columns, this.props.selectRow, this.props.expandColumnOptions);
      var inputType = this.props.selectRow.mode === Const.ROW_SELECT_SINGLE ? 'radio' : 'checkbox';
      var CustomComponent = this.props.selectRow.customComponent;
      var enableKeyBoardNav = keyBoardNav === true || (typeof keyBoardNav === 'undefined' ? 'undefined' : _typeof(keyBoardNav)) === 'object';
      var customEditAndNavStyle = (typeof keyBoardNav === 'undefined' ? 'undefined' : _typeof(keyBoardNav)) === 'object' ? keyBoardNav.customStyleOnEditCell : null;
      var customNavStyle = (typeof keyBoardNav === 'undefined' ? 'undefined' : _typeof(keyBoardNav)) === 'object' ? keyBoardNav.customStyle : null;
      var ExpandColumnCustomComponent = this.props.expandColumnOptions.expandColumnComponent;
      var expandColSpan = this.props.columns.filter(function (col) {
        return col && !col.hidden;
      }).length;
      if (isSelectRowDefined && !this.props.selectRow.hideSelectColumn) {
        expandColSpan += 1;
      }
      var tabIndex = 1;
      if (this.props.expandColumnOptions.expandColumnVisible) {
        expandColSpan += 1;
      }

      var tableRows = this.props.data.map(function (data, r) {
        var tableColumns = this.props.columns.filter(function (_) {
          return _ != null;
        }).map(function (column, i) {
          var fieldValue = data[column.name];
          var isFocusCell = r === y && i === x;
          if (column.name !== this.props.keyField && // Key field can't be edit
          column.editable && // column is editable? default is true, user can set it false
          column.editable.readOnly !== true && this.state.currEditCell !== null && this.state.currEditCell.rid === r && this.state.currEditCell.cid === i && noneditableRows.indexOf(data[this.props.keyField]) === -1) {
            var editable = column.editable;
            var format = column.format ? function (value) {
              return column.format(value, data, column.formatExtraData, r).replace(/<.*?>/g, '');
            } : false;
            if (Utils.isFunction(column.editable)) {
              editable = column.editable(fieldValue, data, r, i);
            }

            return React.createElement(TableEditColumn, {
              completeEdit: this.handleCompleteEditCell
              // add by bluespring for column editor customize
              , editable: editable,
              customEditor: column.customEditor,
              format: column.format ? format : false,
              key: i,
              blurToSave: cellEdit.blurToSave,
              onTab: this.handleEditCell,
              rowIndex: r,
              colIndex: i,
              row: data,
              fieldValue: fieldValue,
              className: column.editClassName,
              invalidColumnClassName: column.invalidEditColumnClassName,
              beforeShowError: beforeShowError,
              isFocus: isFocusCell,
              customStyleWithNav: customEditAndNavStyle });
          } else {
            // add by bluespring for className customize
            var columnChild = fieldValue && fieldValue.toString();
            var columnTitle = null;
            var tdClassName = column.className;
            if (Utils.isFunction(column.className)) {
              tdClassName = column.className(fieldValue, data, r, i);
            }

            if (typeof column.format !== 'undefined') {
              var formattedValue = column.format(fieldValue, data, column.formatExtraData, r);
              if (!React.isValidElement(formattedValue)) {
                columnChild = React.createElement('div', { dangerouslySetInnerHTML: { __html: formattedValue } });
              } else {
                columnChild = formattedValue;
                columnTitle = column.columnTitle && formattedValue ? formattedValue.toString() : null;
              }
            } else {
              columnTitle = column.columnTitle && fieldValue ? fieldValue.toString() : null;
            }
            return React.createElement(
              TableColumn,
              { key: i,
                rIndex: r,
                dataAlign: column.align,
                className: tdClassName,
                columnTitle: columnTitle,
                cellEdit: cellEdit,
                hidden: column.hidden,
                onEdit: this.handleEditCell,
                width: column.width,
                onClick: this.handleClickCell,
                attrs: column.attrs,
                style: column.style,
                tabIndex: tabIndex++ + '',
                isFocus: isFocusCell,
                keyBoardNav: enableKeyBoardNav,
                onKeyDown: this.handleCellKeyDown,
                customNavStyle: customNavStyle,
                row: data },
              columnChild
            );
          }
        }, this);
        var key = data[this.props.keyField];
        var disable = unselectable.indexOf(key) !== -1;
        var selected = this.props.selectedRowKeys.indexOf(key) !== -1;
        var selectRowColumn = isSelectRowDefined && !this.props.selectRow.hideSelectColumn ? this.renderSelectRowColumn(selected, inputType, disable, CustomComponent, r, data) : null;
        var expandedRowColumn = this.renderExpandRowColumn(this.props.expandableRow && this.props.expandableRow(data), this.props.expanding.indexOf(key) > -1, ExpandColumnCustomComponent, r, data);
        var haveExpandContent = this.props.expandableRow && this.props.expandableRow(data);
        var isExpanding = haveExpandContent && this.props.expanding.indexOf(key) > -1;

        // add by bluespring for className customize
        var trClassName = this.props.trClassName;
        if (Utils.isFunction(this.props.trClassName)) {
          trClassName = this.props.trClassName(data, r);
        }
        if (isExpanding && this.props.expandParentClass) {
          trClassName += Utils.isFunction(this.props.expandParentClass) ? this.props.expandParentClass(data, r) : this.props.expandParentClass;
        }
        var result = [React.createElement(
          TableRow,
          { isSelected: selected, key: key, className: trClassName,
            index: r,
            row: data,
            selectRow: isSelectRowDefined ? this.props.selectRow : undefined,
            enableCellEdit: cellEdit.mode !== Const.CELL_EDIT_NONE,
            onRowClick: this.handleRowClick,
            onRowDoubleClick: this.handleRowDoubleClick,
            onRowMouseOver: this.handleRowMouseOver,
            onRowMouseOut: this.handleRowMouseOut,
            onSelectRow: this.handleSelectRow,
            onExpandRow: this.handleClickCell,
            unselectableRow: disable },
          this.props.expandColumnOptions.expandColumnVisible && this.props.expandColumnOptions.expandColumnBeforeSelectColumn && expandedRowColumn,
          selectRowColumn,
          this.props.expandColumnOptions.expandColumnVisible && !this.props.expandColumnOptions.expandColumnBeforeSelectColumn && expandedRowColumn,
          tableColumns
        )];

        if (haveExpandContent) {
          var expandBodyClass = Utils.isFunction(this.props.expandBodyClass) ? this.props.expandBodyClass(data, r) : this.props.expandBodyClass;
          result.push(React.createElement(
            ExpandComponent,
            {
              key: key + '-expand',
              row: data,
              className: expandBodyClass,
              bgColor: this.props.expandRowBgColor || this.props.selectRow.bgColor || undefined,
              hidden: !isExpanding,
              colSpan: expandColSpan,
              width: "100%" },
            this.props.expandComponent(data)
          ));
        }
        return result;
      }, this);

      if (tableRows.length === 0 && !this.props.withoutNoDataText) {
        var colSpan = this.props.columns.filter(function (c) {
          return !c.hidden;
        }).length + (isSelectRowDefined ? 1 : 0);
        tableRows = [React.createElement(
          TableRow,
          { key: '##table-empty##' },
          React.createElement(
            'td',
            { 'data-toggle': 'collapse',
              colSpan: colSpan,
              className: 'react-bs-table-no-data' },
            this.props.noDataText || Const.NO_DATA_TEXT
          )
        )];
      }

      return React.createElement(
        'div',
        { ref: 'container',
          className: classSet('react-bs-container-body', this.props.bodyContainerClass),
          style: this.props.style },
        React.createElement(
          'table',
          { className: tableClasses },
          React.cloneElement(tableHeader, { ref: 'header' }),
          React.createElement(
            'tbody',
            { ref: 'tbody' },
            tableRows
          )
        )
      );
    }
  }, {
    key: 'renderSelectRowColumn',
    value: function renderSelectRowColumn(selected, inputType, disabled) {
      var CustomComponent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var _this2 = this;

      var rowIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var row = arguments[5];

      return React.createElement(
        'td',
        { onClick: function onClick(e) {
            _this2.handleClickonSelectColumn(e, !selected, rowIndex, row);
          }, style: { textAlign: 'center' } },
        CustomComponent ? React.createElement(CustomComponent, { type: inputType, checked: selected, disabled: disabled,
          rowIndex: rowIndex,
          onChange: function onChange(e) {
            return _this2.handleSelectRowColumChange(e, rowIndex);
          } }) : React.createElement('input', { type: inputType, checked: selected, disabled: disabled,
          onChange: function onChange(e) {
            return _this2.handleSelectRowColumChange(e, rowIndex);
          } })
      );
    }
  }, {
    key: 'renderExpandRowColumn',
    value: function renderExpandRowColumn(isExpandableRow, isExpanded, CustomComponent) {
      var _this3 = this;

      var rowIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var content = null;
      if (CustomComponent) {
        content = React.createElement(CustomComponent, { isExpandableRow: isExpandableRow, isExpanded: isExpanded });
      } else if (isExpandableRow) {
        content = isExpanded ? React.createElement('span', { className: 'glyphicon glyphicon-minus' }) : React.createElement('span', { className: 'glyphicon glyphicon-plus' });
      } else {
        content = ' ';
      }

      return React.createElement(
        'td',
        {
          className: 'react-bs-table-expand-cell',
          onClick: function onClick() {
            return _this3.handleClickCell(rowIndex + 1);
          } },
        content
      );
    }
  }, {
    key: '_isSelectRowDefined',
    value: function _isSelectRowDefined() {
      return this.props.selectRow.mode === Const.ROW_SELECT_SINGLE || this.props.selectRow.mode === Const.ROW_SELECT_MULTI;
    }
  }, {
    key: '_isExpandColumnVisible',
    value: function _isExpandColumnVisible() {
      return this.props.expandColumnOptions.expandColumnVisible;
    }
  }]);

  return TableBody;
}(Component);

TableBody.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  striped: PropTypes.bool,
  bordered: PropTypes.bool,
  hover: PropTypes.bool,
  condensed: PropTypes.bool,
  keyField: PropTypes.string,
  selectedRowKeys: PropTypes.array,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onSelectRow: PropTypes.func,
  noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  withoutNoDataText: PropTypes.bool,
  style: PropTypes.object,
  tableBodyClass: PropTypes.string,
  bodyContainerClass: PropTypes.string,
  expandableRow: PropTypes.func,
  expandComponent: PropTypes.func,
  expandRowBgColor: PropTypes.string,
  expandBy: PropTypes.string,
  expanding: PropTypes.array,
  onExpand: PropTypes.func,
  expandBodyClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  expandParentClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onlyOneExpanding: PropTypes.bool,
  beforeShowError: PropTypes.func,
  keyBoardNav: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  x: PropTypes.number,
  y: PropTypes.number,
  onNavigateCell: PropTypes.func
};
export default TableBody;