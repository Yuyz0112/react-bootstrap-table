var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
// import classSet from 'classnames';
import Const from '../Const';
// import editor from '../Editor';
import Notifier from '../Notification.js';
import InsertModal from './InsertModal';
import InsertButton from './InsertButton';
import DeleteButton from './DeleteButton';
import ExportCSVButton from './ExportCSVButton';
import ShowSelectedOnlyButton from './ShowSelectedOnlyButton';
import SearchField from './SearchField';
import ClearSearchButton from './ClearSearchButton';

var ToolBar = function (_Component) {
  _inherits(ToolBar, _Component);

  function ToolBar(props) {
    var _arguments = arguments;

    _classCallCheck(this, ToolBar);

    var _this = _possibleConstructorReturn(this, (ToolBar.__proto__ || Object.getPrototypeOf(ToolBar)).call(this, props));

    _this.displayCommonMessage = function () {
      _this.refs.notifier.notice('error', 'Form validate errors, please checking!', 'Pressed ESC can cancel');
    };

    _this.handleSaveBtnClick = function (newRow) {
      if (!_this.validateNewRow(newRow)) {
        // validation fail
        return;
      }
      var msg = _this.props.onAddRow(newRow);
      if (msg !== false) {
        _this.afterHandleSaveBtnClick(msg);
      }
    };

    _this.afterHandleSaveBtnClick = function (msg) {
      if (msg) {
        _this.refs.notifier.notice('error', msg, 'Pressed ESC can cancel');
        _this.clearTimeout();
        // shake form and hack prevent modal hide
        _this.setState(function () {
          return {
            shakeEditor: true,
            validateState: 'this is hack for prevent bootstrap modal hide'
          };
        });
        // clear animate class
        _this.timeouteClear = setTimeout(function () {
          _this.setState(function () {
            return { shakeEditor: false };
          });
        }, 300);
      } else {
        // reset state and hide modal hide
        _this.setState(function () {
          return {
            validateState: null,
            shakeEditor: false,
            isInsertModalOpen: false
          };
        });
      }
    };

    _this.handleModalClose = function () {
      _this.setState(function () {
        return { isInsertModalOpen: false };
      });
    };

    _this.handleModalOpen = function () {
      _this.setState(function () {
        return { isInsertModalOpen: true };
      });
    };

    _this.handleShowOnlyToggle = function () {
      _this.setState(function () {
        return {
          showSelected: !_this.state.showSelected
        };
      });
      _this.props.onShowOnlySelected();
    };

    _this.handleDropRowBtnClick = function () {
      _this.props.onDropRow();
    };

    _this.handleDebounce = function (func, wait, immediate) {
      var timeout = void 0;

      return function () {
        var later = function later() {
          timeout = null;

          if (!immediate) {
            func.apply(_this, _arguments);
          }
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait || 0);

        if (callNow) {
          func.appy(_this, _arguments);
        }
      };
    };

    _this.handleKeyUp = function (event) {
      event.persist();
      _this.debounceCallback(event);
    };

    _this.handleExportCSV = function () {
      _this.props.onExportCSV();
    };

    _this.handleClearBtnClick = function () {
      var seachInput = _this.refs.seachInput;

      seachInput && seachInput.setValue('');
      _this.props.onSearch('');
    };

    _this.timeouteClear = 0;
    _this.modalClassName;
    _this.state = {
      isInsertModalOpen: false,
      validateState: null,
      shakeEditor: false,
      showSelected: false
    };
    return _this;
  }

  _createClass(ToolBar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var delay = this.props.searchDelayTime ? this.props.searchDelayTime : 0;
      this.debounceCallback = this.handleDebounce(function () {
        var seachInput = _this2.refs.seachInput;

        seachInput && _this2.props.onSearch(seachInput.getValue());
      }, delay);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reset) {
        this.setSearchInput('');
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearTimeout();
    }
  }, {
    key: 'setSearchInput',
    value: function setSearchInput(text) {
      var seachInput = this.refs.seachInput;

      if (seachInput && seachInput.value !== text) {
        seachInput.value = text;
      }
    }
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
      if (this.timeouteClear) {
        clearTimeout(this.timeouteClear);
        this.timeouteClear = 0;
      }
    })
  }, {
    key: 'validateNewRow',
    value: function validateNewRow(newRow) {
      var _this3 = this;

      var validateState = {};
      var isValid = true;
      var tempMsg = void 0;
      var responseType = void 0;

      this.props.columns.forEach(function (column) {
        if (column.isKey && column.keyValidator) {
          // key validator for checking exist key
          tempMsg = _this3.props.isValidKey(newRow[column.field]);
          if (tempMsg) {
            _this3.displayCommonMessage();
            isValid = false;
            validateState[column.field] = tempMsg;
          }
        } else if (column.editable && column.editable.validator) {
          // process validate
          tempMsg = column.editable.validator(newRow[column.field]);
          responseType = typeof tempMsg === 'undefined' ? 'undefined' : _typeof(tempMsg);
          if (responseType !== 'object' && tempMsg !== true) {
            _this3.displayCommonMessage();
            isValid = false;
            validateState[column.field] = tempMsg;
          } else if (responseType === 'object' && tempMsg.isValid !== true) {
            _this3.refs.notifier.notice(tempMsg.notification.type, tempMsg.notification.msg, tempMsg.notification.title);
            isValid = false;
            validateState[column.field] = tempMsg.notification.msg;
          }
        }
      });

      if (isValid) {
        return true;
      } else {
        this.clearTimeout();
        // show error in form and shake it
        this.setState(function () {
          return { validateState: validateState, shakeEditor: true };
        });
        this.timeouteClear = setTimeout(function () {
          _this3.setState(function () {
            return { shakeEditor: false };
          });
        }, 300);
        return null;
      }
    }
  }, {
    key: 'handleCloseBtn',
    value: function handleCloseBtn() {
      this.refs.warning.style.display = 'none';
    }
  }, {
    key: 'render',
    value: function render() {
      this.modalClassName = 'bs-table-modal-sm' + ToolBar.modalSeq++;
      var toolbar = null;
      var btnGroup = null;
      var insertBtn = null;
      var deleteBtn = null;
      var exportCSVBtn = null;
      var showSelectedOnlyBtn = null;

      if (this.props.enableInsert) {
        if (this.props.insertBtn) {
          insertBtn = this.renderCustomBtn(this.props.insertBtn, [this.handleModalOpen], InsertButton.name, 'onClick', this.handleModalOpen);
        } else {
          insertBtn = React.createElement(InsertButton, { btnText: this.props.insertText,
            onClick: this.handleModalOpen });
        }
      }

      if (this.props.enableDelete) {
        if (this.props.deleteBtn) {
          deleteBtn = this.renderCustomBtn(this.props.deleteBtn, [this.handleDropRowBtnClick], DeleteButton.name, 'onClick', this.handleDropRowBtnClick);
        } else {
          deleteBtn = React.createElement(DeleteButton, { btnText: this.props.deleteText,
            onClick: this.handleDropRowBtnClick });
        }
      }

      if (this.props.enableShowOnlySelected) {
        if (this.props.showSelectedOnlyBtn) {
          showSelectedOnlyBtn = this.renderCustomBtn(this.props.showSelectedOnlyBtn, [this.handleShowOnlyToggle, this.state.showSelected], ShowSelectedOnlyButton.name, 'onClick', this.handleShowOnlyToggle);
        } else {
          showSelectedOnlyBtn = React.createElement(ShowSelectedOnlyButton, { toggle: this.state.showSelected,
            onClick: this.handleShowOnlyToggle });
        }
      }

      if (this.props.enableExportCSV) {
        if (this.props.exportCSVBtn) {
          exportCSVBtn = this.renderCustomBtn(this.props.exportCSVBtn, [this.handleExportCSV], ExportCSVButton.name, 'onClick', this.handleExportCSV);
        } else {
          exportCSVBtn = React.createElement(ExportCSVButton, { btnText: this.props.exportCSVText,
            onClick: this.handleExportCSV });
        }
      }

      if (this.props.btnGroup) {
        btnGroup = this.props.btnGroup({
          exportCSVBtn: exportCSVBtn,
          insertBtn: insertBtn,
          deleteBtn: deleteBtn,
          showSelectedOnlyBtn: showSelectedOnlyBtn
        });
      } else {
        btnGroup = React.createElement(
          'div',
          { className: 'btn-group btn-group-sm', role: 'group' },
          exportCSVBtn,
          insertBtn,
          deleteBtn,
          showSelectedOnlyBtn
        );
      }

      var _renderSearchPanel = this.renderSearchPanel(),
          _renderSearchPanel2 = _slicedToArray(_renderSearchPanel, 3),
          searchPanel = _renderSearchPanel2[0],
          searchField = _renderSearchPanel2[1],
          clearBtn = _renderSearchPanel2[2];

      var modal = this.props.enableInsert ? this.renderInsertRowModal() : null;

      if (this.props.toolBar) {
        toolbar = this.props.toolBar({
          components: {
            exportCSVBtn: exportCSVBtn,
            insertBtn: insertBtn,
            deleteBtn: deleteBtn,
            showSelectedOnlyBtn: showSelectedOnlyBtn,
            searchPanel: searchPanel,
            btnGroup: btnGroup,
            searchField: searchField,
            clearBtn: clearBtn
          },
          event: {
            openInsertModal: this.handleModalOpen,
            closeInsertModal: this.handleModalClose,
            dropRow: this.handleDropRowBtnClick,
            showOnlyToogle: this.handleShowOnlyToggle,
            exportCSV: this.handleExportCSV,
            search: this.props.onSearch
          }
        });
      } else {
        toolbar = React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'col-xs-6 col-sm-6 col-md-6 col-lg-8' },
            this.props.searchPosition === 'left' ? searchPanel : btnGroup
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6 col-sm-6 col-md-6 col-lg-4' },
            this.props.searchPosition === 'left' ? btnGroup : searchPanel
          )
        );
      }

      return React.createElement(
        'div',
        { className: 'row' },
        toolbar,
        React.createElement(Notifier, { ref: 'notifier' }),
        modal
      );
    }
  }, {
    key: 'renderSearchPanel',
    value: function renderSearchPanel() {
      if (this.props.enableSearch) {
        var classNames = 'form-group form-group-sm react-bs-table-search-form';
        var clearBtn = null;
        var searchField = null;
        var searchPanel = null;
        if (this.props.clearSearch) {
          if (this.props.clearSearchBtn) {
            clearBtn = this.renderCustomBtn(this.props.clearSearchBtn, [this.handleClearBtnClick], ClearSearchButton.name, 'onClick', this.handleClearBtnClick); /* eslint max-len: 0*/
          } else {
            clearBtn = React.createElement(ClearSearchButton, { onClick: this.handleClearBtnClick });
          }
          classNames += ' input-group input-group-sm';
        }

        if (this.props.searchField) {
          searchField = this.props.searchField({
            search: this.handleKeyUp,
            defaultValue: this.props.defaultSearch,
            placeholder: this.props.searchPlaceholder
          });
          if (searchField.type.name === SearchField.name) {
            searchField = React.cloneElement(searchField, {
              ref: 'seachInput',
              onKeyUp: this.handleKeyUp
            });
          } else {
            searchField = React.cloneElement(searchField, {
              ref: 'seachInput'
            });
          }
        } else {
          searchField = React.createElement(SearchField, { ref: 'seachInput',
            defaultValue: this.props.defaultSearch,
            placeholder: this.props.searchPlaceholder,
            onKeyUp: this.handleKeyUp });
        }
        if (this.props.searchPanel) {
          searchPanel = this.props.searchPanel({
            searchField: searchField, clearBtn: clearBtn,
            search: this.props.onSearch,
            defaultValue: this.props.defaultSearch,
            placeholder: this.props.searchPlaceholder,
            clearBtnClick: this.handleClearBtnClick
          });
        } else {
          searchPanel = React.createElement(
            'div',
            { className: classNames },
            searchField,
            React.createElement(
              'span',
              { className: 'input-group-btn' },
              clearBtn
            )
          );
        }
        return [searchPanel, searchField, clearBtn];
      } else {
        return [];
      }
    }
  }, {
    key: 'renderInsertRowModal',
    value: function renderInsertRowModal() {
      var validateState = this.state.validateState || {};
      var _props = this.props,
          columns = _props.columns,
          ignoreEditable = _props.ignoreEditable,
          insertModalHeader = _props.insertModalHeader,
          insertModalBody = _props.insertModalBody,
          insertModalFooter = _props.insertModalFooter,
          insertModal = _props.insertModal;


      var modal = void 0;
      modal = insertModal && insertModal(this.handleModalClose, this.handleSaveBtnClick, columns, validateState, ignoreEditable);

      if (!modal) {
        modal = React.createElement(InsertModal, {
          columns: columns,
          validateState: validateState,
          ignoreEditable: ignoreEditable,
          onModalClose: this.handleModalClose,
          onSave: this.handleSaveBtnClick,
          headerComponent: insertModalHeader,
          bodyComponent: insertModalBody,
          footerComponent: insertModalFooter });
      }

      return React.createElement(
        Modal,
        { className: 'react-bs-insert-modal modal-dialog',
          isOpen: this.state.isInsertModalOpen,
          onRequestClose: this.handleModalClose,
          contentLabel: 'Modal' },
        modal
      );
    }
  }, {
    key: 'renderCustomBtn',
    value: function renderCustomBtn(cb, params, componentName, eventName, event) {
      var element = cb.apply(null, params);
      if (element.type.name === componentName && !element.props[eventName]) {
        var props = {};
        props[eventName] = event;
        element = React.cloneElement(element, props);
      }
      return element;
    }
  }]);

  return ToolBar;
}(Component);

ToolBar.modalSeq = 0;


ToolBar.propTypes = {
  onAddRow: PropTypes.func,
  onDropRow: PropTypes.func,
  onShowOnlySelected: PropTypes.func,
  enableInsert: PropTypes.bool,
  enableDelete: PropTypes.bool,
  enableSearch: PropTypes.bool,
  enableShowOnlySelected: PropTypes.bool,
  columns: PropTypes.array,
  searchPlaceholder: PropTypes.string,
  exportCSVText: PropTypes.string,
  insertText: PropTypes.string,
  deleteText: PropTypes.string,
  saveText: PropTypes.string,
  closeText: PropTypes.string,
  clearSearch: PropTypes.bool,
  ignoreEditable: PropTypes.bool,
  defaultSearch: PropTypes.string,
  insertModalHeader: PropTypes.func,
  insertModalBody: PropTypes.func,
  insertModalFooter: PropTypes.func,
  insertModal: PropTypes.func,
  insertBtn: PropTypes.func,
  deleteBtn: PropTypes.func,
  showSelectedOnlyBtn: PropTypes.func,
  exportCSVBtn: PropTypes.func,
  clearSearchBtn: PropTypes.func,
  searchField: PropTypes.func,
  searchPanel: PropTypes.func,
  btnGroup: PropTypes.func,
  toolBar: PropTypes.func,
  searchPosition: PropTypes.string,
  reset: PropTypes.bool,
  isValidKey: PropTypes.func
};

ToolBar.defaultProps = {
  reset: false,
  enableInsert: false,
  enableDelete: false,
  enableSearch: false,
  enableShowOnlySelected: false,
  clearSearch: false,
  ignoreEditable: false,
  exportCSVText: Const.EXPORT_CSV_TEXT,
  insertText: Const.INSERT_BTN_TEXT,
  deleteText: Const.DELETE_BTN_TEXT,
  saveText: Const.SAVE_BTN_TEXT,
  closeText: Const.CLOSE_BTN_TEXT
};

export default ToolBar;