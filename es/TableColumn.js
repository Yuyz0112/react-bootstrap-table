var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Const from './Const';
import Util from './util';

var TableColumn = function (_Component) {
  _inherits(TableColumn, _Component);

  function TableColumn(props) {
    _classCallCheck(this, TableColumn);

    var _this = _possibleConstructorReturn(this, (TableColumn.__proto__ || Object.getPrototypeOf(TableColumn)).call(this, props));

    _this.handleCellEdit = function (e) {
      if (_this.props.cellEdit.mode === Const.CELL_EDIT_DBCLICK) {
        if (document.selection && document.selection.empty) {
          document.selection.empty();
        } else if (window.getSelection) {
          var sel = window.getSelection();
          sel.removeAllRanges();
        }
      }
      _this.props.onEdit(_this.props.rIndex + 1, e.currentTarget.cellIndex, e);
      if (_this.props.cellEdit.mode !== Const.CELL_EDIT_DBCLICK) {
        _this.props.onClick(_this.props.rIndex + 1, e.currentTarget.cellIndex, e);
      }
    };

    _this.handleCellClick = function (e) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          rIndex = _this$props.rIndex;

      if (onClick) {
        onClick(rIndex + 1, e.currentTarget.cellIndex, e);
      }
    };

    _this.handleKeyDown = function (e) {
      if (_this.props.keyBoardNav) {
        _this.props.onKeyDown(e);
      }
    };

    return _this;
  }
  /* eslint no-unused-vars: [0, { "args": "after-used" }] */


  _createClass(TableColumn, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var children = this.props.children;

      var shouldUpdated = this.props.width !== nextProps.width || this.props.className !== nextProps.className || this.props.hidden !== nextProps.hidden || this.props.dataAlign !== nextProps.dataAlign || this.props.isFocus !== nextProps.isFocus || (typeof children === 'undefined' ? 'undefined' : _typeof(children)) !== _typeof(nextProps.children) || ('' + this.props.onEdit).toString() !== ('' + nextProps.onEdit).toString();

      if (shouldUpdated) {
        return shouldUpdated;
      }

      if ((typeof children === 'undefined' ? 'undefined' : _typeof(children)) === 'object' && children !== null && children.props !== null) {
        if (children.props.type === 'checkbox' || children.props.type === 'radio') {
          shouldUpdated = shouldUpdated || children.props.type !== nextProps.children.props.type || children.props.checked !== nextProps.children.props.checked || children.props.disabled !== nextProps.children.props.disabled;
        } else {
          shouldUpdated = true;
        }
      } else {
        shouldUpdated = shouldUpdated || children !== nextProps.children;
      }

      if (shouldUpdated) {
        return shouldUpdated;
      }

      if (!(this.props.cellEdit && nextProps.cellEdit)) {
        return false;
      } else {
        return shouldUpdated || this.props.cellEdit.mode !== nextProps.cellEdit.mode;
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var dom = ReactDOM.findDOMNode(this);
      if (this.props.isFocus) {
        dom.focus();
      } else {
        dom.blur();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var dom = ReactDOM.findDOMNode(this);
      if (this.props.isFocus) {
        dom.focus();
      } else {
        dom.blur();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          columnTitle = _props.columnTitle,
          dataAlign = _props.dataAlign,
          hidden = _props.hidden,
          cellEdit = _props.cellEdit,
          attrs = _props.attrs,
          style = _props.style,
          isFocus = _props.isFocus,
          keyBoardNav = _props.keyBoardNav,
          tabIndex = _props.tabIndex,
          customNavStyle = _props.customNavStyle,
          row = _props.row;
      var className = this.props.className;


      var tdStyle = _extends({
        textAlign: dataAlign,
        display: hidden ? 'none' : null
      }, style);

      var opts = {};

      if (cellEdit) {
        if (cellEdit.mode === Const.CELL_EDIT_CLICK) {
          opts.onClick = this.handleCellEdit;
        } else if (cellEdit.mode === Const.CELL_EDIT_DBCLICK) {
          opts.onDoubleClick = this.handleCellEdit;
        } else {
          opts.onClick = this.handleCellClick;
        }
      }

      if (keyBoardNav && isFocus) {
        opts.onKeyDown = this.handleKeyDown;
      }

      if (isFocus) {
        if (customNavStyle) {
          var cusmtStyle = Util.isFunction(customNavStyle) ? customNavStyle(children, row) : customNavStyle;
          tdStyle = _extends({}, tdStyle, cusmtStyle);
        } else {
          className = className + ' default-focus-cell';
        }
      }
      return React.createElement(
        'td',
        _extends({ tabIndex: tabIndex, style: tdStyle,
          title: columnTitle,
          className: className
        }, opts, attrs),
        typeof children === 'boolean' ? children.toString() : children
      );
    }
  }]);

  return TableColumn;
}(Component);

TableColumn.propTypes = {
  rIndex: PropTypes.number,
  dataAlign: PropTypes.string,
  hidden: PropTypes.bool,
  className: PropTypes.string,
  columnTitle: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  attrs: PropTypes.object,
  style: PropTypes.object,
  isFocus: PropTypes.bool,
  onKeyDown: PropTypes.func,
  tabIndex: PropTypes.string,
  keyBoardNav: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  customNavStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  row: PropTypes.any /* only used on custom styling for navigation */
};

TableColumn.defaultProps = {
  dataAlign: 'left',
  hidden: false,
  className: '',
  isFocus: false,
  keyBoardNav: false
};
export default TableColumn;