var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';

import InsertModalHeader from './InsertModalHeader';
import InsertModalFooter from './InsertModalFooter';
import InsertModalBody from './InsertModalBody';

var defaultModalClassName = 'react-bs-table-insert-modal';

var InsertModal = function (_Component) {
  _inherits(InsertModal, _Component);

  function InsertModal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InsertModal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InsertModal.__proto__ || Object.getPrototypeOf(InsertModal)).call.apply(_ref, [this].concat(args))), _this), _this.handleSave = function () {
      var bodyRefs = _this.refs.body;
      if (bodyRefs.getFieldValue) {
        _this.props.onSave(bodyRefs.getFieldValue());
      } else {
        console.error('Custom InsertModalBody should implement getFieldValue function\n        and should return an object presented as the new row that user input.');
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InsertModal, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          headerComponent = _props.headerComponent,
          footerComponent = _props.footerComponent,
          bodyComponent = _props.bodyComponent;
      var _props2 = this.props,
          columns = _props2.columns,
          validateState = _props2.validateState,
          ignoreEditable = _props2.ignoreEditable,
          onModalClose = _props2.onModalClose;

      var bodyAttr = { columns: columns, validateState: validateState, ignoreEditable: ignoreEditable };

      bodyComponent = bodyComponent && bodyComponent(columns, validateState, ignoreEditable);

      headerComponent = headerComponent && headerComponent(onModalClose, this.handleSave);

      footerComponent = footerComponent && footerComponent(onModalClose, this.handleSave);

      if (bodyComponent) {
        bodyComponent = React.cloneElement(bodyComponent, { ref: 'body' });
      }

      if (headerComponent && headerComponent.type.name === InsertModalHeader.name) {
        var eventProps = {};
        if (!headerComponent.props.onModalClose) eventProps.onModalClose = onModalClose;
        if (!headerComponent.props.onSave) eventProps.onSave = this.handleSave;
        if (Object.keys(eventProps).length > 0) {
          headerComponent = React.cloneElement(headerComponent, eventProps);
        }
      } else if (headerComponent && headerComponent.type.name !== InsertModalHeader.name) {
        var className = headerComponent.props.className;

        if (typeof className === 'undefined' || className.indexOf('modal-header') === -1) {
          headerComponent = React.createElement(
            'div',
            { className: 'modal-header' },
            headerComponent
          );
        }
      }

      if (footerComponent && footerComponent.type.name === InsertModalFooter.name) {
        var _eventProps = {};
        if (!footerComponent.props.onModalClose) _eventProps.onModalClose = onModalClose;
        if (!footerComponent.props.onSave) _eventProps.onSave = this.handleSave;
        if (Object.keys(_eventProps).length > 0) {
          footerComponent = React.cloneElement(footerComponent, _eventProps);
        }
      } else if (footerComponent && footerComponent.type.name !== InsertModalFooter.name) {
        var _className = footerComponent.props.className;

        if (typeof _className === 'undefined' || _className.indexOf('modal-footer') === -1) {
          footerComponent = React.createElement(
            'div',
            { className: 'modal-footer' },
            footerComponent
          );
        }
      }

      return React.createElement(
        'div',
        { className: 'modal-content ' + defaultModalClassName },
        headerComponent || React.createElement(InsertModalHeader, {
          className: 'react-bs-table-inser-modal-header',
          onModalClose: onModalClose }),
        bodyComponent || React.createElement(InsertModalBody, _extends({ ref: 'body' }, bodyAttr)),
        footerComponent || React.createElement(InsertModalFooter, {
          className: 'react-bs-table-inser-modal-footer',
          onModalClose: onModalClose,
          onSave: this.handleSave })
      );
    }
  }]);

  return InsertModal;
}(Component);

export default InsertModal;

InsertModal.propTypes = {
  columns: PropTypes.array.isRequired,
  validateState: PropTypes.object.isRequired,
  ignoreEditable: PropTypes.bool,
  headerComponent: PropTypes.func,
  bodyComponent: PropTypes.func,
  footerComponent: PropTypes.func,
  onModalClose: PropTypes.func,
  onSave: PropTypes.func
};

InsertModal.defaultProps = {};