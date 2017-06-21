var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint default-case: 0 */
/* eslint guard-for-in: 0 */
import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';
import Const from './Const';
import Util from './util';
import DateFilter from './filters/Date';
import TextFilter from './filters/Text';
import RegexFilter from './filters/Regex';
import SelectFilter from './filters/Select';
import NumberFilter from './filters/Number';

var TableHeaderColumn = function (_Component) {
  _inherits(TableHeaderColumn, _Component);

  function TableHeaderColumn(props) {
    _classCallCheck(this, TableHeaderColumn);

    var _this = _possibleConstructorReturn(this, (TableHeaderColumn.__proto__ || Object.getPrototypeOf(TableHeaderColumn)).call(this, props));

    _this.handleColumnClick = function () {
      if (_this.props.isOnlyHead || !_this.props.dataSort) return;
      var order = _this.props.sort;

      if (!order && _this.props.defaultASC) order = Const.SORT_ASC;else order = _this.props.sort === Const.SORT_DESC ? Const.SORT_ASC : Const.SORT_DESC;
      _this.props.onSort(order, _this.props.dataField);
    };

    _this.handleFilter = _this.handleFilter.bind(_this);
    return _this;
  }

  _createClass(TableHeaderColumn, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reset) {
        this.cleanFiltered();
      }
    }
  }, {
    key: 'handleFilter',
    value: function handleFilter(value, type) {
      var filter = this.props.filter;

      filter.emitter.handleFilter(this.props.dataField, value, type, filter);
    }
  }, {
    key: 'getFilters',
    value: function getFilters() {
      var _props = this.props,
          headerText = _props.headerText,
          children = _props.children;

      switch (this.props.filter.type) {
        case Const.FILTER_TYPE.TEXT:
          {
            return React.createElement(TextFilter, _extends({ ref: 'textFilter' }, this.props.filter, {
              columnName: headerText || children, filterHandler: this.handleFilter }));
          }
        case Const.FILTER_TYPE.REGEX:
          {
            return React.createElement(RegexFilter, _extends({ ref: 'regexFilter' }, this.props.filter, {
              columnName: headerText || children, filterHandler: this.handleFilter }));
          }
        case Const.FILTER_TYPE.SELECT:
          {
            return React.createElement(SelectFilter, _extends({ ref: 'selectFilter' }, this.props.filter, {
              columnName: headerText || children, filterHandler: this.handleFilter }));
          }
        case Const.FILTER_TYPE.NUMBER:
          {
            return React.createElement(NumberFilter, _extends({ ref: 'numberFilter' }, this.props.filter, {
              columnName: headerText || children, filterHandler: this.handleFilter }));
          }
        case Const.FILTER_TYPE.DATE:
          {
            return React.createElement(DateFilter, _extends({ ref: 'dateFilter' }, this.props.filter, {
              columnName: headerText || children, filterHandler: this.handleFilter }));
          }
        case Const.FILTER_TYPE.CUSTOM:
          {
            var elm = this.props.filter.getElement(this.handleFilter, this.props.filter.customFilterParameters);

            return React.cloneElement(elm, { ref: 'customFilter' });
          }
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refs['header-col'].setAttribute('data-field', this.props.dataField);
    }
  }, {
    key: 'render',
    value: function render() {
      var defaultCaret = void 0;
      var sortCaret = void 0;
      var _props2 = this.props,
          headerText = _props2.headerText,
          dataAlign = _props2.dataAlign,
          dataField = _props2.dataField,
          headerAlign = _props2.headerAlign,
          headerTitle = _props2.headerTitle,
          hidden = _props2.hidden,
          sort = _props2.sort,
          dataSort = _props2.dataSort,
          sortIndicator = _props2.sortIndicator,
          children = _props2.children,
          caretRender = _props2.caretRender,
          className = _props2.className,
          isOnlyHead = _props2.isOnlyHead,
          style = _props2.thStyle;

      var thStyle = _extends({
        textAlign: headerAlign || dataAlign,
        display: hidden ? 'none' : null
      }, style);
      if (!isOnlyHead) {
        if (sortIndicator) {
          defaultCaret = !dataSort ? null : React.createElement(
            'span',
            { className: 'order' },
            React.createElement(
              'span',
              { className: 'dropdown' },
              React.createElement('span', { className: 'caret', style: { margin: '10px 0 10px 5px', color: '#ccc' } })
            ),
            React.createElement(
              'span',
              { className: 'dropup' },
              React.createElement('span', { className: 'caret', style: { margin: '10px 0', color: '#ccc' } })
            )
          );
        }
        sortCaret = sort ? Util.renderReactSortCaret(sort) : defaultCaret;
        if (caretRender) {
          sortCaret = caretRender(sort, dataField);
        }
      }

      var classes = classSet(Util.isFunction(className) ? className() : className, !isOnlyHead && dataSort ? 'sort-column' : '');

      var attr = {};
      if (headerTitle) {
        if (typeof children === 'string' && !headerText) {
          attr.title = children;
        } else {
          attr.title = headerText;
        }
      }
      return React.createElement(
        'th',
        _extends({ ref: 'header-col',
          className: classes,
          style: thStyle,
          onClick: this.handleColumnClick,
          rowSpan: this.props.rowSpan,
          colSpan: this.props.colSpan,
          'data-is-only-head': this.props.isOnlyHead
        }, attr),
        children,
        sortCaret,
        React.createElement(
          'div',
          { onClick: function onClick(e) {
              return e.stopPropagation();
            } },
          this.props.filter && !isOnlyHead ? this.getFilters() : null
        )
      );
    }
  }, {
    key: 'cleanFiltered',
    value: function cleanFiltered() {
      if (this.props.filter === undefined) {
        return;
      }

      switch (this.props.filter.type) {
        case Const.FILTER_TYPE.TEXT:
          {
            this.refs.textFilter.cleanFiltered();
            break;
          }
        case Const.FILTER_TYPE.REGEX:
          {
            this.refs.regexFilter.cleanFiltered();
            break;
          }
        case Const.FILTER_TYPE.SELECT:
          {
            this.refs.selectFilter.cleanFiltered();
            break;
          }
        case Const.FILTER_TYPE.NUMBER:
          {
            this.refs.numberFilter.cleanFiltered();
            break;
          }
        case Const.FILTER_TYPE.DATE:
          {
            this.refs.dateFilter.cleanFiltered();
            break;
          }
        case Const.FILTER_TYPE.CUSTOM:
          {
            this.refs.customFilter.cleanFiltered();
            break;
          }
      }
    }
  }, {
    key: 'applyFilter',
    value: function applyFilter(val) {
      if (this.props.filter === undefined) return;
      switch (this.props.filter.type) {
        case Const.FILTER_TYPE.TEXT:
          {
            this.refs.textFilter.applyFilter(val);
            break;
          }
        case Const.FILTER_TYPE.REGEX:
          {
            this.refs.regexFilter.applyFilter(val);
            break;
          }
        case Const.FILTER_TYPE.SELECT:
          {
            this.refs.selectFilter.applyFilter(val);
            break;
          }
        case Const.FILTER_TYPE.NUMBER:
          {
            this.refs.numberFilter.applyFilter(val);
            break;
          }
        case Const.FILTER_TYPE.DATE:
          {
            this.refs.dateFilter.applyFilter(val);
            break;
          }
      }
    }
  }]);

  return TableHeaderColumn;
}(Component);

var filterTypeArray = [];
for (var key in Const.FILTER_TYPE) {
  filterTypeArray.push(Const.FILTER_TYPE[key]);
}

TableHeaderColumn.propTypes = {
  dataField: PropTypes.string,
  dataAlign: PropTypes.string,
  headerAlign: PropTypes.string,
  headerTitle: PropTypes.bool,
  headerText: PropTypes.string,
  dataSort: PropTypes.bool,
  onSort: PropTypes.func,
  dataFormat: PropTypes.func,
  csvFormat: PropTypes.func,
  csvHeader: PropTypes.string,
  isKey: PropTypes.bool,
  editable: PropTypes.any,
  hidden: PropTypes.bool,
  hiddenOnInsert: PropTypes.bool,
  searchable: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  width: PropTypes.string,
  sortFunc: PropTypes.func,
  sortFuncExtraData: PropTypes.any,
  columnClassName: PropTypes.any,
  editColumnClassName: PropTypes.any,
  invalidEditColumnClassName: PropTypes.any,
  columnTitle: PropTypes.bool,
  filterFormatted: PropTypes.bool,
  filterValue: PropTypes.func,
  sort: PropTypes.string,
  caretRender: PropTypes.func,
  formatExtraData: PropTypes.any,
  csvFormatExtraData: PropTypes.any,
  filter: PropTypes.shape({
    type: PropTypes.oneOf(filterTypeArray),
    delay: PropTypes.number,
    options: PropTypes.oneOfType([PropTypes.object, // for SelectFilter
    PropTypes.arrayOf(PropTypes.number) // for NumberFilter
    ]),
    numberComparators: PropTypes.arrayOf(PropTypes.string),
    emitter: PropTypes.object,
    placeholder: PropTypes.string,
    getElement: PropTypes.func,
    customFilterParameters: PropTypes.object,
    condition: PropTypes.oneOf([Const.FILTER_COND_EQ, Const.FILTER_COND_LIKE])
  }),
  sortIndicator: PropTypes.bool,
  export: PropTypes.bool,
  expandable: PropTypes.bool,
  tdAttr: PropTypes.object,
  tdStyle: PropTypes.object,
  thStyle: PropTypes.object,
  keyValidator: PropTypes.bool,
  defaultASC: PropTypes.bool
};

TableHeaderColumn.defaultProps = {
  dataAlign: 'left',
  headerAlign: undefined,
  headerTitle: true,
  dataSort: false,
  dataFormat: undefined,
  csvFormat: undefined,
  csvHeader: undefined,
  isKey: false,
  editable: true,
  onSort: undefined,
  hidden: false,
  hiddenOnInsert: false,
  searchable: true,
  className: '',
  columnTitle: false,
  width: null,
  sortFunc: undefined,
  columnClassName: '',
  editColumnClassName: '',
  invalidEditColumnClassName: '',
  filterFormatted: false,
  filterValue: undefined,
  sort: undefined,
  formatExtraData: undefined,
  sortFuncExtraData: undefined,
  filter: undefined,
  sortIndicator: true,
  expandable: true,
  tdAttr: undefined,
  tdStyle: undefined,
  thStyle: undefined,
  keyValidator: false,
  defaultASC: false
};

export default TableHeaderColumn;