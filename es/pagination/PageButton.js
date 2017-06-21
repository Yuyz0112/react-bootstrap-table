var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';

var PageButton = function (_Component) {
  _inherits(PageButton, _Component);

  function PageButton(props) {
    _classCallCheck(this, PageButton);

    var _this = _possibleConstructorReturn(this, (PageButton.__proto__ || Object.getPrototypeOf(PageButton)).call(this, props));

    _this.pageBtnClick = function (e) {
      e.preventDefault();
      _this.props.changePage(e.currentTarget.textContent);
    };

    return _this;
  }

  _createClass(PageButton, [{
    key: 'render',
    value: function render() {
      var classes = classSet({
        'active': this.props.active,
        'disabled': this.props.disable,
        'hidden': this.props.hidden,
        'page-item': true
      });
      return React.createElement(
        'li',
        { className: classes, title: this.props.title },
        React.createElement(
          'a',
          { href: '#', onClick: this.pageBtnClick, className: 'page-link' },
          this.props.children
        )
      );
    }
  }]);

  return PageButton;
}(Component);

PageButton.propTypes = {
  title: PropTypes.string,
  changePage: PropTypes.func,
  active: PropTypes.bool,
  disable: PropTypes.bool,
  hidden: PropTypes.bool,
  children: PropTypes.node
};

export default PageButton;