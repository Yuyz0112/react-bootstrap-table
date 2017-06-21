var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import Const from '../Const';

var InsertModalFooter = function (_Component) {
  _inherits(InsertModalFooter, _Component);

  function InsertModalFooter() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InsertModalFooter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InsertModalFooter.__proto__ || Object.getPrototypeOf(InsertModalFooter)).call.apply(_ref, [this].concat(args))), _this), _this.handleCloseBtnClick = function (e) {
      var _this$props = _this.props,
          beforeClose = _this$props.beforeClose,
          onModalClose = _this$props.onModalClose;

      beforeClose && beforeClose(e);
      onModalClose();
    }, _this.handleSaveBtnClick = function (e) {
      var _this$props2 = _this.props,
          beforeSave = _this$props2.beforeSave,
          onSave = _this$props2.onSave;

      beforeSave && beforeSave(e);
      onSave();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InsertModalFooter, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          saveBtnText = _props.saveBtnText,
          closeBtnText = _props.closeBtnText,
          closeBtnContextual = _props.closeBtnContextual,
          saveBtnContextual = _props.saveBtnContextual,
          closeBtnClass = _props.closeBtnClass,
          saveBtnClass = _props.saveBtnClass,
          children = _props.children;


      var content = children || React.createElement(
        'span',
        null,
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'btn ' + closeBtnContextual + ' ' + closeBtnClass,
            onClick: this.handleCloseBtnClick },
          closeBtnText
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'btn ' + saveBtnContextual + ' ' + saveBtnClass,
            onClick: this.handleSaveBtnClick },
          saveBtnText
        )
      );

      return React.createElement(
        'div',
        { className: 'modal-footer ' + className },
        content
      );
    }
  }]);

  return InsertModalFooter;
}(Component);

InsertModalFooter.propTypes = {
  className: PropTypes.string,
  saveBtnText: PropTypes.string,
  closeBtnText: PropTypes.string,
  closeBtnContextual: PropTypes.string,
  saveBtnContextual: PropTypes.string,
  closeBtnClass: PropTypes.string,
  saveBtnClass: PropTypes.string,
  beforeClose: PropTypes.func,
  beforeSave: PropTypes.func,
  onSave: PropTypes.func,
  onModalClose: PropTypes.func
};
InsertModalFooter.defaultProps = {
  className: '',
  saveBtnText: Const.SAVE_BTN_TEXT,
  closeBtnText: Const.CLOSE_BTN_TEXT,
  closeBtnContextual: 'btn-default',
  saveBtnContextual: 'btn-primary',
  closeBtnClass: '',
  saveBtnClass: '',
  beforeClose: undefined,
  beforeSave: undefined
};

export default InsertModalFooter;