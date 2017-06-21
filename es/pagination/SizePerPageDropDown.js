var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';

var sizePerPageDefaultClass = 'react-bs-table-sizePerPage-dropdown';

var SizePerPageDropDown = function (_Component) {
  _inherits(SizePerPageDropDown, _Component);

  function SizePerPageDropDown() {
    _classCallCheck(this, SizePerPageDropDown);

    return _possibleConstructorReturn(this, (SizePerPageDropDown.__proto__ || Object.getPrototypeOf(SizePerPageDropDown)).apply(this, arguments));
  }

  _createClass(SizePerPageDropDown, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          open = _props.open,
          hidden = _props.hidden,
          onClick = _props.onClick,
          options = _props.options,
          className = _props.className,
          variation = _props.variation,
          btnContextual = _props.btnContextual,
          currSizePerPage = _props.currSizePerPage;


      var openClass = open ? 'open' : '';
      var dropDownStyle = { visibility: hidden ? 'hidden' : 'visible' };

      return React.createElement(
        'span',
        { style: dropDownStyle,
          className: variation + ' ' + openClass + ' ' + className + ' ' + sizePerPageDefaultClass },
        React.createElement(
          'button',
          { className: 'btn ' + btnContextual + ' dropdown-toggle',
            id: 'pageDropDown', 'data-toggle': 'dropdown',
            'aria-expanded': open,
            onClick: onClick },
          currSizePerPage,
          React.createElement(
            'span',
            null,
            ' ',
            React.createElement('span', { className: 'caret' })
          )
        ),
        React.createElement(
          'ul',
          { className: 'dropdown-menu', role: 'menu', 'aria-labelledby': 'pageDropDown' },
          options
        )
      );
    }
  }]);

  return SizePerPageDropDown;
}(Component);

SizePerPageDropDown.propTypes = {
  open: PropTypes.bool,
  hidden: PropTypes.bool,
  btnContextual: PropTypes.string,
  currSizePerPage: PropTypes.string,
  options: PropTypes.array,
  variation: PropTypes.oneOf(['dropdown', 'dropup']),
  className: PropTypes.string,
  onClick: PropTypes.func
};
SizePerPageDropDown.defaultProps = {
  open: false,
  hidden: false,
  btnContextual: 'btn-default',
  variation: 'dropdown',
  className: ''
};

export default SizePerPageDropDown;