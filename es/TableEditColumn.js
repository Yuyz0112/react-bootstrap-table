var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import editor from './Editor';
import Notifier from './Notification.js';
import classSet from 'classnames';
import Const from './Const';
import Util from './util';

var TableEditColumn = function (_Component) {
  _inherits(TableEditColumn, _Component);

  function TableEditColumn(props) {
    _classCallCheck(this, TableEditColumn);

    var _this = _possibleConstructorReturn(this, (TableEditColumn.__proto__ || Object.getPrototypeOf(TableEditColumn)).call(this, props));

    _this.handleKeyPress = function (e) {
      if (e.keyCode === 13 || e.keyCode === 9) {
        // Pressed ENTER
        var value = e.currentTarget.type === 'checkbox' ? _this._getCheckBoxValue(e) : e.currentTarget.value;

        if (!_this.validator(value)) {
          return;
        }
        if (e.keyCode === 13) {
          _this.props.completeEdit(value, _this.props.rowIndex, _this.props.colIndex);
        } else {
          _this.props.onTab(_this.props.rowIndex + 1, _this.props.colIndex + 1, 'tab', e);
          e.preventDefault();
        }
      } else if (e.keyCode === 27) {
        _this.props.completeEdit(null, _this.props.rowIndex, _this.props.colIndex);
      } else if (e.type === 'click' && !_this.props.blurToSave) {
        // textarea click save button
        var _value = e.target.parentElement.firstChild.value;
        if (!_this.validator(_value)) {
          return;
        }
        _this.props.completeEdit(_value, _this.props.rowIndex, _this.props.colIndex);
      }
    };

    _this.handleBlur = function (e) {
      e.stopPropagation();
      if (_this.props.blurToSave) {
        var value = e.currentTarget.type === 'checkbox' ? _this._getCheckBoxValue(e) : e.currentTarget.value;
        if (!_this.validator(value)) {
          return false;
        }
        _this.props.completeEdit(value, _this.props.rowIndex, _this.props.colIndex);
      }
    };

    _this.handleCustomUpdate = function (value) {
      if (!_this.validator(value)) {
        return;
      }
      _this.props.completeEdit(value, _this.props.rowIndex, _this.props.colIndex);
    };

    _this.notifyToastr = function (type, message, title) {
      var toastr = true;
      var beforeShowError = _this.props.beforeShowError;

      if (beforeShowError) {
        toastr = beforeShowError(type, message, title);
      }
      if (toastr) {
        _this.refs.notifier.notice(type, message, title);
      }
    };

    _this.handleClick = function (e) {
      if (e.target.tagName !== 'TD') {
        e.stopPropagation();
      }
    };

    _this.timeouteClear = 0;
    var _this$props = _this.props,
        fieldValue = _this$props.fieldValue,
        row = _this$props.row,
        className = _this$props.className;

    _this.focusInEditor = _this.focusInEditor.bind(_this);
    _this.state = {
      shakeEditor: false,
      className: Util.isFunction(className) ? className(fieldValue, row) : className
    };
    return _this;
  }

  _createClass(TableEditColumn, [{
    key: 'valueShortCircuit',
    value: function valueShortCircuit(value) {
      return value === null || typeof value === 'undefined' ? '' : value;
    }
  }, {
    key: 'validator',


    // modified by iuculanop
    // BEGIN
    value: function validator(value) {
      var ts = this;
      var valid = true;
      if (ts.props.editable.validator) {
        var checkVal = ts.props.editable.validator(value, this.props.row);
        var responseType = typeof checkVal === 'undefined' ? 'undefined' : _typeof(checkVal);
        if (responseType !== 'object' && checkVal !== true) {
          valid = false;
          this.notifyToastr('error', checkVal, Const.CANCEL_TOASTR);
        } else if (responseType === 'object' && checkVal.isValid !== true) {
          valid = false;
          this.notifyToastr(checkVal.notification.type, checkVal.notification.msg, checkVal.notification.title);
        }
        if (!valid) {
          // animate input
          ts.clearTimeout();
          var _props = this.props,
              invalidColumnClassName = _props.invalidColumnClassName,
              row = _props.row;

          var className = Util.isFunction(invalidColumnClassName) ? invalidColumnClassName(value, row) : invalidColumnClassName;
          ts.setState({ shakeEditor: true, className: className });
          ts.timeouteClear = setTimeout(function () {
            ts.setState({ shakeEditor: false });
          }, 300);
          this.focusInEditor();
          return valid;
        }
      }
      return valid;
    }
    // END

  }, {
    key: 'clearTimeout',
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this.timeouteClear !== 0) {
        clearTimeout(this.timeouteClear);
        this.timeouteClear = 0;
      }
    })
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.focusInEditor();
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
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearTimeout();
    }
  }, {
    key: 'focusInEditor',
    value: function focusInEditor() {
      if (Util.isFunction(this.refs.inputRef.focus)) {
        this.refs.inputRef.focus();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          editable = _props2.editable,
          format = _props2.format,
          customEditor = _props2.customEditor,
          isFocus = _props2.isFocus,
          customStyleWithNav = _props2.customStyleWithNav,
          row = _props2.row;
      var shakeEditor = this.state.shakeEditor;

      var attr = {
        ref: 'inputRef',
        onKeyDown: this.handleKeyPress,
        onBlur: this.handleBlur
      };
      var style = { position: 'relative' };
      var fieldValue = this.props.fieldValue;
      var className = this.state.className;
      // put placeholder if exist

      editable.placeholder && (attr.placeholder = editable.placeholder);

      var editorClass = classSet({ 'animated': shakeEditor, 'shake': shakeEditor });
      fieldValue = fieldValue === 0 ? '0' : fieldValue;
      var cellEditor = void 0;
      if (customEditor) {
        var customEditorProps = _extends({
          row: row
        }, attr, {
          defaultValue: this.valueShortCircuit(fieldValue)
        }, customEditor.customEditorParameters);
        cellEditor = customEditor.getElement(this.handleCustomUpdate, customEditorProps);
      } else {
        cellEditor = editor(editable, attr, format, editorClass, this.valueShortCircuit(fieldValue));
      }

      if (isFocus) {
        if (customStyleWithNav) {
          var customStyle = Util.isFunction(customStyleWithNav) ? customStyleWithNav(fieldValue, row) : customStyleWithNav;
          style = _extends({}, style, customStyle);
        } else {
          className = className + ' default-focus-cell';
        }
      }

      return React.createElement(
        'td',
        { ref: 'td',
          style: style,
          className: className,
          onClick: this.handleClick },
        cellEditor,
        React.createElement(Notifier, { ref: 'notifier' })
      );
    }
  }, {
    key: '_getCheckBoxValue',
    value: function _getCheckBoxValue(e) {
      var value = '';
      var values = e.currentTarget.value.split(':');
      value = e.currentTarget.checked ? values[0] : values[1];
      return value;
    }
  }]);

  return TableEditColumn;
}(Component);

TableEditColumn.propTypes = {
  completeEdit: PropTypes.func,
  rowIndex: PropTypes.number,
  colIndex: PropTypes.number,
  blurToSave: PropTypes.bool,
  editable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  format: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  row: PropTypes.any,
  fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.array, PropTypes.object]),
  className: PropTypes.any,
  beforeShowError: PropTypes.func,
  isFocus: PropTypes.bool,
  customStyleWithNav: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default TableEditColumn;