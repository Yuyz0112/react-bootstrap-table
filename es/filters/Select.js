var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';
import Const from '../Const';

function optionsEquals(options1, options2) {
  var keys = Object.keys(options1);
  for (var k in keys) {
    if (options1[k] !== options2[k]) {
      return false;
    }
  }
  return Object.keys(options1).length === Object.keys(options2).length;
}

var SelectFilter = function (_Component) {
  _inherits(SelectFilter, _Component);

  function SelectFilter(props) {
    _classCallCheck(this, SelectFilter);

    var _this = _possibleConstructorReturn(this, (SelectFilter.__proto__ || Object.getPrototypeOf(SelectFilter)).call(this, props));

    _this.filter = _this.filter.bind(_this);
    _this.state = {
      isPlaceholderSelected: _this.props.defaultValue === undefined || !_this.props.options.hasOwnProperty(_this.props.defaultValue)
    };
    return _this;
  }

  _createClass(SelectFilter, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var isPlaceholderSelected = nextProps.defaultValue === undefined || !nextProps.options.hasOwnProperty(nextProps.defaultValue);
      this.setState(function () {
        return {
          isPlaceholderSelected: isPlaceholderSelected
        };
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var needFilter = false;
      if (this.props.defaultValue !== prevProps.defaultValue) {
        needFilter = true;
      } else if (!optionsEquals(this.props.options, prevProps.options)) {
        needFilter = true;
      }
      if (needFilter) {
        var value = this.refs.selectInput.value;
        if (value) {
          this.props.filterHandler(value, Const.FILTER_TYPE.SELECT);
        }
      }
    }
  }, {
    key: 'filter',
    value: function filter(event) {
      var value = event.target.value;

      this.setState(function () {
        return { isPlaceholderSelected: value === '' };
      });
      this.props.filterHandler(value, Const.FILTER_TYPE.SELECT);
    }
  }, {
    key: 'cleanFiltered',
    value: function cleanFiltered() {
      var value = this.props.defaultValue !== undefined ? this.props.defaultValue : '';
      this.setState(function () {
        return { isPlaceholderSelected: value === '' };
      });
      this.refs.selectInput.value = value;
      this.props.filterHandler(value, Const.FILTER_TYPE.SELECT);
    }
  }, {
    key: 'applyFilter',
    value: function applyFilter(filterOption) {
      filterOption = filterOption + '';
      this.setState(function () {
        return { isPlaceholderSelected: filterOption === '' };
      });
      this.refs.selectInput.value = filterOption;
      this.props.filterHandler(filterOption, Const.FILTER_TYPE.SELECT);
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      var optionTags = [];
      var _props = this.props,
          options = _props.options,
          placeholder = _props.placeholder,
          columnName = _props.columnName,
          selectText = _props.selectText,
          withoutEmptyOption = _props.withoutEmptyOption;

      var selectTextValue = selectText !== undefined ? selectText : 'Select';
      if (!withoutEmptyOption) {
        optionTags.push(React.createElement(
          'option',
          { key: '-1', value: '' },
          placeholder || selectTextValue + ' ' + columnName + '...'
        ));
      }
      Object.keys(options).map(function (key) {
        optionTags.push(React.createElement(
          'option',
          { key: key, value: key },
          options[key] + ''
        ));
      });
      return optionTags;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var value = this.refs.selectInput.value;
      if (value) {
        this.props.filterHandler(value, Const.FILTER_TYPE.SELECT);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var selectClass = classSet('filter', 'select-filter', 'form-control', { 'placeholder-selected': this.state.isPlaceholderSelected });

      return React.createElement(
        'select',
        { ref: 'selectInput',
          style: this.props.style,
          className: selectClass,
          onChange: this.filter,
          defaultValue: this.props.defaultValue !== undefined ? this.props.defaultValue : '' },
        this.getOptions()
      );
    }
  }]);

  return SelectFilter;
}(Component);

SelectFilter.propTypes = {
  filterHandler: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  columnName: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object])
};

export default SelectFilter;