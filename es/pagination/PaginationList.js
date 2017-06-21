var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';
import PageButton from './PageButton.js';
import SizePerPageDropDown from './SizePerPageDropDown';
import Const from '../Const';
import Util from '../util';

var PaginationList = function (_Component) {
  _inherits(PaginationList, _Component);

  function PaginationList(props) {
    _classCallCheck(this, PaginationList);

    var _this = _possibleConstructorReturn(this, (PaginationList.__proto__ || Object.getPrototypeOf(PaginationList)).call(this, props));

    _this.changePage = function (page) {
      var _this$props = _this.props,
          pageStartIndex = _this$props.pageStartIndex,
          prePage = _this$props.prePage,
          currPage = _this$props.currPage,
          nextPage = _this$props.nextPage,
          lastPage = _this$props.lastPage,
          firstPage = _this$props.firstPage,
          sizePerPage = _this$props.sizePerPage,
          keepSizePerPageState = _this$props.keepSizePerPageState;


      if (page === prePage) {
        page = currPage - 1 < pageStartIndex ? pageStartIndex : currPage - 1;
      } else if (page === nextPage) {
        page = currPage + 1 > _this.lastPage ? _this.lastPage : currPage + 1;
      } else if (page === lastPage) {
        page = _this.lastPage;
      } else if (page === firstPage) {
        page = pageStartIndex;
      } else {
        page = parseInt(page, 10);
      }

      if (keepSizePerPageState) {
        _this.setState(function () {
          return { open: false };
        });
      }

      if (page !== currPage) {
        _this.props.changePage(page, sizePerPage);
      }
    };

    _this.changeSizePerPage = function (pageNum) {
      var selectSize = typeof pageNum === 'string' ? parseInt(pageNum, 10) : pageNum;
      var currPage = _this.props.currPage;

      if (selectSize !== _this.props.sizePerPage) {
        _this.totalPages = Math.ceil(_this.props.dataSize / selectSize);
        _this.lastPage = _this.props.pageStartIndex + _this.totalPages - 1;
        if (currPage > _this.lastPage) currPage = _this.lastPage;
        _this.props.changePage(currPage, selectSize);
        if (_this.props.onSizePerPageList) {
          _this.props.onSizePerPageList(selectSize);
        }
      }
      _this.setState(function () {
        return { open: false };
      });
    };

    _this.toggleDropDown = function () {
      _this.setState(function () {
        return {
          open: !_this.state.open
        };
      });
    };

    _this.state = {
      open: _this.props.open
    };
    return _this;
  }

  _createClass(PaginationList, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      var keepSizePerPageState = this.props.keepSizePerPageState;

      if (!keepSizePerPageState) {
        this.setState(function () {
          return { open: false };
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          currPage = _props.currPage,
          dataSize = _props.dataSize,
          sizePerPage = _props.sizePerPage,
          sizePerPageList = _props.sizePerPageList,
          paginationShowsTotal = _props.paginationShowsTotal,
          pageStartIndex = _props.pageStartIndex,
          paginationPanel = _props.paginationPanel,
          hidePageListOnlyOnePage = _props.hidePageListOnlyOnePage;

      this.totalPages = Math.ceil(dataSize / sizePerPage);
      this.lastPage = this.props.pageStartIndex + this.totalPages - 1;
      var pageBtns = this.makePage(Util.isFunction(paginationPanel));
      var dropdown = this.makeDropDown();

      var offset = Math.abs(Const.PAGE_START_INDEX - pageStartIndex);
      var start = (currPage - pageStartIndex) * sizePerPage;
      start = dataSize === 0 ? 0 : start + 1;
      var to = Math.min(sizePerPage * (currPage + offset) - 1, dataSize);
      if (to >= dataSize) to--;
      var total = paginationShowsTotal ? React.createElement(
        'span',
        null,
        'Showing rows ',
        start,
        ' to\xA0',
        to + 1,
        ' of\xA0',
        dataSize
      ) : null;

      if (Util.isFunction(paginationShowsTotal)) {
        total = paginationShowsTotal(start, to + 1, dataSize);
      }

      var content = paginationPanel && paginationPanel({
        currPage: currPage,
        sizePerPage: sizePerPage,
        sizePerPageList: sizePerPageList,
        pageStartIndex: pageStartIndex,
        changePage: this.changePage,
        toggleDropDown: this.toggleDropDown,
        changeSizePerPage: this.changeSizePerPage,
        components: {
          totalText: total,
          sizePerPageDropdown: dropdown,
          pageList: pageBtns
        }
      });

      var hidePageList = hidePageListOnlyOnePage && this.totalPages === 1 ? 'none' : 'block';
      return React.createElement(
        'div',
        { className: 'row', style: { marginTop: 15 } },
        content || React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'col-md-6 col-xs-6 col-sm-6 col-lg-6' },
            total,
            sizePerPageList.length > 1 ? dropdown : null
          ),
          React.createElement(
            'div',
            { style: { display: hidePageList },
              className: 'col-md-6 col-xs-6 col-sm-6 col-lg-6' },
            pageBtns
          )
        )
      );
    }
  }, {
    key: 'makeDropDown',
    value: function makeDropDown() {
      var _this2 = this;

      var dropdown = void 0;
      var dropdownProps = void 0;
      var sizePerPageText = '';
      var _props2 = this.props,
          sizePerPageDropDown = _props2.sizePerPageDropDown,
          hideSizePerPage = _props2.hideSizePerPage,
          sizePerPage = _props2.sizePerPage,
          sizePerPageList = _props2.sizePerPageList;

      if (sizePerPageDropDown) {
        dropdown = sizePerPageDropDown({
          open: this.state.open,
          hideSizePerPage: hideSizePerPage,
          currSizePerPage: String(sizePerPage),
          sizePerPageList: sizePerPageList,
          toggleDropDown: this.toggleDropDown,
          changeSizePerPage: this.changeSizePerPage
        });
        if (dropdown.type.name === SizePerPageDropDown.name) {
          dropdownProps = dropdown.props;
        } else {
          return dropdown;
        }
      }

      if (dropdownProps || !dropdown) {
        var sizePerPageOptions = sizePerPageList.map(function (_sizePerPage) {
          var pageText = _sizePerPage.text || _sizePerPage;
          var pageNum = _sizePerPage.value || _sizePerPage;
          if (sizePerPage === pageNum) sizePerPageText = pageText;
          return React.createElement(
            'li',
            { key: pageText, role: 'presentation' },
            React.createElement(
              'a',
              { role: 'menuitem',
                tabIndex: '-1', href: '#',
                'data-page': pageNum,
                onClick: function onClick(e) {
                  e.preventDefault();
                  _this2.changeSizePerPage(pageNum);
                } },
              pageText
            )
          );
        });
        dropdown = React.createElement(SizePerPageDropDown, _extends({
          open: this.state.open,
          hidden: hideSizePerPage,
          currSizePerPage: String(sizePerPageText),
          options: sizePerPageOptions,
          onClick: this.toggleDropDown
        }, dropdownProps));
      }
      return dropdown;
    }
  }, {
    key: 'makePage',
    value: function makePage() {
      var _this3 = this;

      var isCustomPagingPanel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var pages = this.getPages();
      var isStart = function isStart(page, _ref) {
        var currPage = _ref.currPage,
            pageStartIndex = _ref.pageStartIndex,
            firstPage = _ref.firstPage,
            prePage = _ref.prePage;
        return currPage === pageStartIndex && (page === firstPage || page === prePage);
      };
      var isEnd = function isEnd(page, _ref2) {
        var currPage = _ref2.currPage,
            nextPage = _ref2.nextPage,
            lastPage = _ref2.lastPage;
        return currPage === _this3.lastPage && (page === nextPage || page === lastPage);
      };
      var pageBtns = pages.filter(function (page) {
        if (this.props.alwaysShowAllBtns) {
          return true;
        }
        return isStart(page, this.props) || isEnd(page, this.props) ? false : true;
      }, this).map(function (page) {
        var isActive = page === this.props.currPage;
        var isDisabled = isStart(page, this.props) || isEnd(page, this.props) ? true : false;
        var title = page + '';

        if (page === this.props.nextPage) {
          title = this.props.nextPageTitle;
        } else if (page === this.props.prePage) {
          title = this.props.prePageTitle;
        } else if (page === this.props.firstPage) {
          title = this.props.firstPageTitle;
        } else if (page === this.props.lastPage) {
          title = this.props.lastPageTitle;
        }

        return React.createElement(
          PageButton,
          { key: page,
            title: title,
            changePage: this.changePage,
            active: isActive,
            disable: isDisabled },
          page
        );
      }, this);
      var classname = classSet(isCustomPagingPanel ? null : 'react-bootstrap-table-page-btns-ul', 'pagination');
      return React.createElement(
        'ul',
        { className: classname },
        pageBtns
      );
    }
  }, {
    key: 'getLastPage',
    value: function getLastPage() {
      return this.lastPage;
    }
  }, {
    key: 'getPages',
    value: function getPages() {
      var pages = void 0;
      var endPage = this.totalPages;
      if (endPage <= 0) return [];
      var startPage = Math.max(this.props.currPage - Math.floor(this.props.paginationSize / 2), this.props.pageStartIndex);
      endPage = startPage + this.props.paginationSize - 1;

      if (endPage > this.lastPage) {
        endPage = this.lastPage;
        startPage = endPage - this.props.paginationSize + 1;
      }

      if (startPage !== this.props.pageStartIndex && this.totalPages > this.props.paginationSize && this.props.withFirstAndLast) {
        pages = [this.props.firstPage, this.props.prePage];
      } else if (this.totalPages > 1 || this.props.alwaysShowAllBtns) {
        pages = [this.props.prePage];
      } else {
        pages = [];
      }

      for (var i = startPage; i <= endPage; i++) {
        if (i >= this.props.pageStartIndex) pages.push(i);
      }

      if (endPage <= this.lastPage && pages.length > 1) {
        pages.push(this.props.nextPage);
      }
      if (endPage !== this.lastPage && this.props.withFirstAndLast) {
        pages.push(this.props.lastPage);
      }

      return pages;
    }
  }]);

  return PaginationList;
}(Component);

PaginationList.propTypes = {
  currPage: PropTypes.number,
  sizePerPage: PropTypes.number,
  dataSize: PropTypes.number,
  changePage: PropTypes.func,
  sizePerPageList: PropTypes.array,
  paginationShowsTotal: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  paginationSize: PropTypes.number,
  onSizePerPageList: PropTypes.func,
  prePage: PropTypes.string,
  pageStartIndex: PropTypes.number,
  hideSizePerPage: PropTypes.bool,
  alwaysShowAllBtns: PropTypes.bool,
  withFirstAndLast: PropTypes.bool,
  sizePerPageDropDown: PropTypes.func,
  paginationPanel: PropTypes.func,
  prePageTitle: PropTypes.string,
  nextPageTitle: PropTypes.string,
  firstPageTitle: PropTypes.string,
  lastPageTitle: PropTypes.string,
  hidePageListOnlyOnePage: PropTypes.bool,
  keepSizePerPageState: PropTypes.bool
};

PaginationList.defaultProps = {
  sizePerPage: Const.SIZE_PER_PAGE,
  pageStartIndex: Const.PAGE_START_INDEX
};

export default PaginationList;