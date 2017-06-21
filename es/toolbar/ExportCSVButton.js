var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import Const from '../Const';

var exportCsvBtnDefaultClass = 'react-bs-table-csv-btn';

var ExportCSVButton = function (_Component) {
  _inherits(ExportCSVButton, _Component);

  function ExportCSVButton() {
    _classCallCheck(this, ExportCSVButton);

    return _possibleConstructorReturn(this, (ExportCSVButton.__proto__ || Object.getPrototypeOf(ExportCSVButton)).apply(this, arguments));
  }

  _createClass(ExportCSVButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          btnContextual = _props.btnContextual,
          className = _props.className,
          onClick = _props.onClick,
          btnGlyphicon = _props.btnGlyphicon,
          btnText = _props.btnText,
          children = _props.children,
          rest = _objectWithoutProperties(_props, ['btnContextual', 'className', 'onClick', 'btnGlyphicon', 'btnText', 'children']);

      var content = children || React.createElement(
        'span',
        null,
        React.createElement('i', { className: 'glyphicon ' + btnGlyphicon }),
        ' ',
        btnText
      );
      return React.createElement(
        'button',
        _extends({ type: 'button',
          className: 'btn ' + btnContextual + ' ' + exportCsvBtnDefaultClass + ' ' + className + ' hidden-print',
          onClick: onClick
        }, rest),
        content
      );
    }
  }]);

  return ExportCSVButton;
}(Component);

ExportCSVButton.propTypes = {
  btnText: PropTypes.string,
  btnContextual: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  btnGlyphicon: PropTypes.string
};
ExportCSVButton.defaultProps = {
  btnText: Const.EXPORT_CSV_TEXT,
  btnContextual: 'btn-success',
  className: '',
  onClick: undefined,
  btnGlyphicon: 'glyphicon-export'
};

export default ExportCSVButton;