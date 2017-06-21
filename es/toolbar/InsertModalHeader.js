var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';

var InsertModalHeader = function (_Component) {
  _inherits(InsertModalHeader, _Component);

  function InsertModalHeader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InsertModalHeader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InsertModalHeader.__proto__ || Object.getPrototypeOf(InsertModalHeader)).call.apply(_ref, [this].concat(args))), _this), _this.handleCloseBtnClick = function (e) {
      var _this$props = _this.props,
          onModalClose = _this$props.onModalClose,
          beforeClose = _this$props.beforeClose;

      beforeClose && beforeClose(e);
      onModalClose();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InsertModalHeader, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          title = _props.title,
          hideClose = _props.hideClose,
          className = _props.className,
          children = _props.children;


      var closeBtn = hideClose ? null : React.createElement(
        'button',
        { type: 'button',
          className: 'close', onClick: this.handleCloseBtnClick },
        React.createElement(
          'span',
          { 'aria-hidden': 'true' },
          '\xD7'
        ),
        React.createElement(
          'span',
          { className: 'sr-only' },
          'Close'
        )
      );

      var content = children || React.createElement(
        'span',
        null,
        closeBtn,
        React.createElement(
          'h4',
          { className: 'modal-title' },
          title
        )
      );

      return React.createElement(
        'div',
        { className: 'modal-header ' + className },
        content
      );
    }
  }]);

  return InsertModalHeader;
}(Component);

InsertModalHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onModalClose: PropTypes.func,
  hideClose: PropTypes.bool,
  beforeClose: PropTypes.func
};
InsertModalHeader.defaultProps = {
  className: '',
  title: 'Add Row',
  onModalClose: undefined,
  hideClose: false,
  beforeClose: undefined
};

export default InsertModalHeader;