var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint no-alert: 0 */
/* eslint max-len: 0 */
import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';
import Const from './Const';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import PaginationList from './pagination/PaginationList';
import ToolBar from './toolbar/ToolBar';
import TableFilter from './TableFilter';
import { TableDataStore } from './store/TableDataStore';
import Util from './util';
import exportCSVUtil from './csv_export_util';
import { Filter } from './Filter';

var BootstrapTable = function (_Component) {
  _inherits(BootstrapTable, _Component);

  function BootstrapTable(props) {
    _classCallCheck(this, BootstrapTable);

    var _this = _possibleConstructorReturn(this, (BootstrapTable.__proto__ || Object.getPrototypeOf(BootstrapTable)).call(this, props));

    _initialiseProps.call(_this);

    _this.isIE = false;
    _this._attachCellEditFunc();
    if (Util.canUseDOM()) {
      _this.isIE = document.documentMode;
    }
    _this.store = new TableDataStore(_this.props.data ? _this.props.data.slice() : []);
    _this.isVerticalScroll = false;
    _this.initTable(_this.props);

    if (_this.props.selectRow && _this.props.selectRow.selected) {
      var copy = _this.props.selectRow.selected.slice();
      _this.store.setSelectedRowKey(copy);
    }
    var currPage = Const.PAGE_START_INDEX;
    if (typeof _this.props.options.page !== 'undefined') {
      currPage = _this.props.options.page;
    } else if (typeof _this.props.options.pageStartIndex !== 'undefined') {
      currPage = _this.props.options.pageStartIndex;
    }

    _this._adjustHeaderWidth = _this._adjustHeaderWidth.bind(_this);
    _this._adjustHeight = _this._adjustHeight.bind(_this);
    _this._adjustTable = _this._adjustTable.bind(_this);

    _this.state = {
      data: _this.getTableData(),
      currPage: currPage,
      expanding: _this.props.options.expanding || [],
      sizePerPage: _this.props.options.sizePerPage || Const.SIZE_PER_PAGE_LIST[0],
      selectedRowKeys: _this.store.getSelectedRowKeys(),
      reset: false,
      x: _this.props.keyBoardNav ? 0 : -1,
      y: _this.props.keyBoardNav ? 0 : -1
    };
    return _this;
  }

  _createClass(BootstrapTable, [{
    key: 'initTable',
    value: function initTable(props) {
      var _this2 = this;

      var keyField = props.keyField;


      var isKeyFieldDefined = typeof keyField === 'string' && keyField.length;
      React.Children.forEach(props.children, function (column) {
        if (column === null || column === undefined) {
          // Skip null and undefined value
          return;
        }
        if (column.props.isKey) {
          if (keyField) {
            throw new Error('Error. Multiple key column be detected in TableHeaderColumn.');
          }
          keyField = column.props.dataField;
        }
        if (column.props.filter) {
          // a column contains a filter
          if (!_this2.filter) {
            // first time create the filter on the BootstrapTable
            _this2.filter = new Filter();
          }
          // pass the filter to column with filter
          column.props.filter.emitter = _this2.filter;
        }
      });

      if (this.filter) {
        this.filter.removeAllListeners('onFilterChange');
        this.filter.on('onFilterChange', function (currentFilter) {
          _this2.handleFilterData(currentFilter);
        });
      }

      this.colInfos = this.getColumnsDescription(props).reduce(function (prev, curr) {
        prev[curr.name] = curr;
        return prev;
      }, {});

      if (!isKeyFieldDefined && !keyField) {
        throw new Error('Error. No any key column defined in TableHeaderColumn.\n            Use \'isKey={true}\' to specify a unique column after version 0.5.4.');
      }

      this.store.setProps({
        isPagination: props.pagination,
        keyField: keyField,
        colInfos: this.colInfos,
        multiColumnSearch: props.multiColumnSearch,
        strictSearch: props.strictSearch,
        multiColumnSort: props.multiColumnSort,
        remote: this.props.remote
      });
    }
  }, {
    key: 'getTableData',
    value: function getTableData() {
      var result = [];
      var _props = this.props,
          options = _props.options,
          pagination = _props.pagination;

      var sortName = options.defaultSortName || options.sortName;
      var sortOrder = options.defaultSortOrder || options.sortOrder;
      var searchText = options.defaultSearch;

      if (sortName && sortOrder) {
        this.store.setSortInfo(sortOrder, sortName);
        if (!this.allowRemote(Const.REMOTE_SORT)) {
          this.store.sort();
        }
      }

      if (searchText) {
        this.store.search(searchText);
      }

      if (pagination) {
        var page = void 0;
        var sizePerPage = void 0;
        if (this.store.isChangedPage()) {
          sizePerPage = this.state.sizePerPage;
          page = this.state.currPage;
        } else {
          sizePerPage = options.sizePerPage || Const.SIZE_PER_PAGE_LIST[0];
          page = options.page || 1;
        }
        result = this.store.page(page, sizePerPage).get();
      } else {
        result = this.store.get();
      }
      return result;
    }
  }, {
    key: 'getColumnsDescription',
    value: function getColumnsDescription(_ref) {
      var children = _ref.children;

      var rowCount = 0;
      React.Children.forEach(children, function (column) {
        if (column === null || column === undefined) {
          // Skip null and undefined value
          return;
        }

        if (Number(column.props.row) > rowCount) {
          rowCount = Number(column.props.row);
        }
      });
      return React.Children.map(children, function (column, i) {
        if (column === null || column === undefined) {
          // Return null for empty objects
          return null;
        }

        var rowIndex = column.props.row ? Number(column.props.row) : 0;
        var rowSpan = column.props.rowSpan ? Number(column.props.rowSpan) : 1;
        if (rowSpan + rowIndex === rowCount + 1) {
          return {
            name: column.props.dataField,
            align: column.props.dataAlign,
            sort: column.props.dataSort,
            format: column.props.dataFormat,
            formatExtraData: column.props.formatExtraData,
            filterFormatted: column.props.filterFormatted,
            filterValue: column.props.filterValue,
            editable: column.props.editable,
            customEditor: column.props.customEditor,
            hidden: column.props.hidden,
            hiddenOnInsert: column.props.hiddenOnInsert,
            searchable: column.props.searchable,
            className: column.props.columnClassName,
            editClassName: column.props.editColumnClassName,
            invalidEditColumnClassName: column.props.invalidEditColumnClassName,
            columnTitle: column.props.columnTitle,
            width: column.props.width,
            text: column.props.headerText || column.props.children,
            sortFunc: column.props.sortFunc,
            sortFuncExtraData: column.props.sortFuncExtraData,
            export: column.props.export,
            expandable: column.props.expandable,
            index: i,
            attrs: column.props.tdAttr,
            style: column.props.tdStyle
          };
        }
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      var _this3 = this;

      var pageStartIndex = this.props.options.pageStartIndex;

      this.store.clean();
      this.setState(function () {
        return {
          data: _this3.getTableData(),
          currPage: Util.getFirstPage(pageStartIndex),
          expanding: [],
          sizePerPage: Const.SIZE_PER_PAGE_LIST[0],
          selectedRowKeys: _this3.store.getSelectedRowKeys(),
          reset: true
        };
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.initTable(nextProps);
      var options = nextProps.options,
          selectRow = nextProps.selectRow;


      this.store.setData(nextProps.data.slice());

      // from #481
      var page = this.state.currPage;
      if (this.props.options.page !== options.page) {
        page = options.page;
      }
      // from #481
      var sizePerPage = this.state.sizePerPage;
      if (this.props.options.sizePerPage !== options.sizePerPage) {
        sizePerPage = options.sizePerPage;
      }

      if (this.isRemoteDataSource()) {
        var data = nextProps.data.slice();
        if (nextProps.pagination && !this.allowRemote(Const.REMOTE_PAGE)) {
          data = this.store.page(page, sizePerPage).get();
        }
        this.setState(function () {
          return {
            data: data,
            currPage: page,
            sizePerPage: sizePerPage,
            reset: false
          };
        });
      } else {
        // #125
        // remove !options.page for #709
        if (page > Math.ceil(nextProps.data.length / sizePerPage)) {
          page = 1;
        }
        var sortList = this.store.getSortInfo();
        var sortField = options.sortName;
        var sortOrder = options.sortOrder;
        if (sortField && sortOrder) {
          this.store.setSortInfo(sortOrder, sortField);
          this.store.sort();
        } else if (sortList.length > 0) {
          this.store.sort();
        }
        var _data = this.store.page(page, sizePerPage).get();
        this.setState(function () {
          return {
            data: _data,
            currPage: page,
            sizePerPage: sizePerPage,
            reset: false
          };
        });

        if (this.store.isSearching && options.afterSearch) {
          options.afterSearch(this.store.searchText, this.store.getDataIgnoringPagination());
        }

        if (this.store.isFiltering && options.afterColumnFilter) {
          options.afterColumnFilter(this.store.filterObj, this.store.getDataIgnoringPagination());
        }
      }

      // If setting the expanded rows is being handled externally
      // then overwrite the current expanded rows.
      if (this.props.options.expanding !== options.expanding) {
        this.setState(function () {
          return {
            expanding: options.expanding || []
          };
        });
      }

      if (selectRow && selectRow.selected) {
        // set default select rows to store.
        var copy = selectRow.selected.slice();
        this.store.setSelectedRowKey(copy);
        this.setState(function () {
          return {
            selectedRowKeys: copy,
            reset: false
          };
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._adjustTable();
      window.addEventListener('resize', this._adjustTable);
      this.refs.body.refs.container.addEventListener('scroll', this._scrollHeader);
      if (this.props.scrollTop) {
        this._scrollTop();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._adjustTable);
      if (this.refs && this.refs.body && this.refs.body.refs) {
        this.refs.body.refs.container.removeEventListener('scroll', this._scrollHeader);
      }
      if (this.filter) {
        this.filter.removeAllListeners('onFilterChange');
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._adjustTable();
      this._attachCellEditFunc();
      if (this.props.options.afterTableComplete) {
        this.props.options.afterTableComplete();
      }
    }
  }, {
    key: '_attachCellEditFunc',
    value: function _attachCellEditFunc() {
      var cellEdit = this.props.cellEdit;

      if (cellEdit) {
        this.props.cellEdit.__onCompleteEdit__ = this.handleEditCell.bind(this);
        if (cellEdit.mode !== Const.CELL_EDIT_NONE) {
          this.props.selectRow.clickToSelect = false;
        }
      }
    }

    /**
     * Returns true if in the current configuration,
     * the datagrid should load its data remotely.
     *
     * @param  {Object}  [props] Optional. If not given, this.props will be used
     * @return {Boolean}
     */

  }, {
    key: 'isRemoteDataSource',
    value: function isRemoteDataSource(props) {
      var _ref2 = props || this.props,
          remote = _ref2.remote;

      return remote === true || Util.isFunction(remote);
    }

    /**
     * Returns true if this action can be handled remote store
     * From #990, Sometimes, we need some actions as remote, some actions are handled by default
     * so function will tell you the target action is can be handled as remote or not.
     * @param  {String}  [action] Required.
     * @param  {Object}  [props] Optional. If not given, this.props will be used
     * @return {Boolean}
     */

  }, {
    key: 'allowRemote',
    value: function allowRemote(action, props) {
      var _ref3 = props || this.props,
          remote = _ref3.remote;

      if (typeof remote === 'function') {
        var remoteObj = remote(Const.REMOTE);
        return remoteObj[action];
      } else {
        return remote;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        height: this.props.height,
        maxHeight: this.props.maxHeight
      };

      var columns = this.getColumnsDescription(this.props);
      var sortList = this.store.getSortInfo();
      var pagination = this.renderPagination();
      var toolBar = this.renderToolBar();
      var tableFilter = this.renderTableFilter(columns);
      var isSelectAll = this.isSelectAll();
      var expandColumnOptions = this.props.expandColumnOptions;
      if (typeof expandColumnOptions.expandColumnBeforeSelectColumn === 'undefined') {
        expandColumnOptions.expandColumnBeforeSelectColumn = true;
      }
      var colGroups = Util.renderColGroup(columns, this.props.selectRow, expandColumnOptions);
      var sortIndicator = this.props.options.sortIndicator;
      if (typeof this.props.options.sortIndicator === 'undefined') sortIndicator = true;
      var _props$options$pagina = this.props.options.paginationPosition,
          paginationPosition = _props$options$pagina === undefined ? Const.PAGINATION_POS_BOTTOM : _props$options$pagina;

      var showPaginationOnTop = paginationPosition !== Const.PAGINATION_POS_BOTTOM;
      var showPaginationOnBottom = paginationPosition !== Const.PAGINATION_POS_TOP;

      return React.createElement(
        'div',
        { className: classSet('react-bs-table-container', this.props.className, this.props.containerClass),
          style: this.props.containerStyle },
        toolBar,
        showPaginationOnTop ? pagination : null,
        React.createElement(
          'div',
          { ref: 'table',
            className: classSet('react-bs-table', { 'react-bs-table-bordered': this.props.bordered }, this.props.tableContainerClass),
            style: _extends({}, style, this.props.tableStyle),
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave },
          React.createElement(
            TableHeader,
            {
              ref: 'header',
              colGroups: colGroups,
              headerContainerClass: this.props.headerContainerClass,
              tableHeaderClass: this.props.tableHeaderClass,
              style: this.props.headerStyle,
              rowSelectType: this.props.selectRow.mode,
              customComponent: this.props.selectRow.customComponent,
              hideSelectColumn: this.props.selectRow.hideSelectColumn,
              sortList: sortList,
              sortIndicator: sortIndicator,
              onSort: this.handleSort,
              onSelectAllRow: this.handleSelectAllRow,
              bordered: this.props.bordered,
              condensed: this.props.condensed,
              isFiltered: this.filter ? true : false,
              isSelectAll: isSelectAll,
              reset: this.state.reset,
              expandColumnVisible: expandColumnOptions.expandColumnVisible,
              expandColumnComponent: expandColumnOptions.expandColumnComponent,
              expandColumnBeforeSelectColumn: expandColumnOptions.expandColumnBeforeSelectColumn },
            this.props.children
          ),
          React.createElement(TableBody, { ref: 'body',
            bodyContainerClass: this.props.bodyContainerClass,
            tableBodyClass: this.props.tableBodyClass,
            style: _extends({}, style, this.props.bodyStyle),
            data: this.state.data,
            expandComponent: this.props.expandComponent,
            expandableRow: this.props.expandableRow,
            expandRowBgColor: this.props.options.expandRowBgColor,
            expandBy: this.props.options.expandBy || Const.EXPAND_BY_ROW,
            expandBodyClass: this.props.options.expandBodyClass,
            expandParentClass: this.props.options.expandParentClass,
            columns: columns,
            trClassName: this.props.trClassName,
            striped: this.props.striped,
            bordered: this.props.bordered,
            hover: this.props.hover,
            keyField: this.store.getKeyField(),
            condensed: this.props.condensed,
            selectRow: this.props.selectRow,
            expandColumnOptions: this.props.expandColumnOptions,
            cellEdit: this.props.cellEdit,
            selectedRowKeys: this.state.selectedRowKeys,
            onRowClick: this.handleRowClick,
            onRowDoubleClick: this.handleRowDoubleClick,
            onRowMouseOver: this.handleRowMouseOver,
            onRowMouseOut: this.handleRowMouseOut,
            onSelectRow: this.handleSelectRow,
            noDataText: this.props.options.noDataText,
            withoutNoDataText: this.props.options.withoutNoDataText,
            expanding: this.state.expanding,
            onExpand: this.handleExpandRow,
            onlyOneExpanding: this.props.options.onlyOneExpanding,
            beforeShowError: this.props.options.beforeShowError,
            keyBoardNav: this.props.keyBoardNav,
            onNavigateCell: this.handleNavigateCell,
            x: this.state.x,
            y: this.state.y })
        ),
        tableFilter,
        showPaginationOnBottom ? pagination : null
      );
    }
  }, {
    key: 'isSelectAll',
    value: function isSelectAll() {
      if (this.store.isEmpty()) return false;
      var _props$selectRow = this.props.selectRow,
          unselectable = _props$selectRow.unselectable,
          onlyUnselectVisible = _props$selectRow.onlyUnselectVisible;

      var keyField = this.store.getKeyField();
      var allRowKeys = onlyUnselectVisible ? this.store.get().map(function (r) {
        return r[keyField];
      }) : this.store.getAllRowkey();
      var defaultSelectRowKeys = this.store.getSelectedRowKeys();

      if (onlyUnselectVisible) {
        defaultSelectRowKeys = defaultSelectRowKeys.filter(function (x) {
          return x !== allRowKeys;
        });
      }

      if (defaultSelectRowKeys.length === 0) return false;
      var match = 0;
      var noFound = 0;
      var unSelectableCnt = 0;
      defaultSelectRowKeys.forEach(function (selected) {
        if (allRowKeys.indexOf(selected) !== -1) match++;else noFound++;
        if (unselectable && unselectable.indexOf(selected) !== -1) unSelectableCnt++;
      });

      if (noFound === defaultSelectRowKeys.length) return false;
      if (match === allRowKeys.length) {
        return true;
      } else {
        if (unselectable && match <= unSelectableCnt && unSelectableCnt === unselectable.length) return false;else return 'indeterminate';
      }
      // return (match === allRowKeys.length) ? true : 'indeterminate';
    }
  }, {
    key: 'cleanSelected',
    value: function cleanSelected() {
      this.store.setSelectedRowKey([]);
      this.setState(function () {
        return {
          selectedRowKeys: [],
          reset: false
        };
      });
    }
  }, {
    key: 'cleanSort',
    value: function cleanSort() {
      this.store.cleanSortInfo();
      this.setState(function () {
        return {
          reset: false
        };
      });
    }
  }, {
    key: 'handleEditCell',
    value: function handleEditCell(newVal, rowIndex, colIndex) {
      var _this4 = this;

      var beforeSaveCell = this.props.cellEdit.beforeSaveCell;

      var columns = this.getColumnsDescription(this.props);
      var fieldName = columns[colIndex].name;

      var invalid = function invalid() {
        _this4.setState(function () {
          return {
            data: _this4.store.get(),
            reset: false
          };
        });
        return;
      };

      if (beforeSaveCell) {
        var beforeSaveCellCB = function beforeSaveCellCB(result) {
          _this4.refs.body.cancelEditCell();
          if (result || result === undefined) {
            _this4.editCell(newVal, rowIndex, colIndex);
          } else {
            invalid();
          }
        };
        var isValid = beforeSaveCell(this.state.data[rowIndex], fieldName, newVal, beforeSaveCellCB);
        if (isValid === false && typeof isValid !== 'undefined') {
          return invalid();
        } else if (isValid === Const.AWAIT_BEFORE_CELL_EDIT) {
          /* eslint consistent-return: 0 */
          return isValid;
        }
      }
      this.editCell(newVal, rowIndex, colIndex);
    }
  }, {
    key: 'editCell',
    value: function editCell(newVal, rowIndex, colIndex) {
      var onCellEdit = this.props.options.onCellEdit;
      var afterSaveCell = this.props.cellEdit.afterSaveCell;

      var columns = this.getColumnsDescription(this.props);
      var fieldName = columns[colIndex].name;
      if (onCellEdit) {
        newVal = onCellEdit(this.state.data[rowIndex], fieldName, newVal);
      }

      if (this.allowRemote(Const.REMOTE_CELL_EDIT)) {
        if (afterSaveCell) {
          afterSaveCell(this.state.data[rowIndex], fieldName, newVal);
        }
        return;
      }

      var result = this.store.edit(newVal, rowIndex, fieldName).get();
      this.setState(function () {
        return {
          data: result,
          reset: false
        };
      });

      if (afterSaveCell) {
        afterSaveCell(this.state.data[rowIndex], fieldName, newVal);
      }
    }
  }, {
    key: 'handleAddRowAtBegin',
    value: function handleAddRowAtBegin(newObj) {
      try {
        this.store.addAtBegin(newObj);
      } catch (e) {
        return e;
      }
      this._handleAfterAddingRow(newObj, true);
    }
  }, {
    key: 'getSizePerPage',
    value: function getSizePerPage() {
      return this.state.sizePerPage;
    }
  }, {
    key: 'getCurrentPage',
    value: function getCurrentPage() {
      return this.state.currPage;
    }
  }, {
    key: 'getTableDataIgnorePaging',
    value: function getTableDataIgnorePaging() {
      return this.store.getCurrentDisplayData();
    }
  }, {
    key: 'deleteRow',
    value: function deleteRow(dropRowKeys) {
      var _this5 = this;

      var onDeleteRow = this.props.options.onDeleteRow;

      if (onDeleteRow) {
        onDeleteRow(dropRowKeys);
      }

      this.store.setSelectedRowKey([]); // clear selected row key

      if (this.allowRemote(Const.REMOTE_DROP_ROW)) {
        if (this.props.options.afterDeleteRow) {
          this.props.options.afterDeleteRow(dropRowKeys);
        }
        return;
      }

      this.store.remove(dropRowKeys); // remove selected Row
      var result = void 0;
      if (this.props.pagination) {
        var sizePerPage = this.state.sizePerPage;

        var currLastPage = Math.ceil(this.store.getDataNum() / sizePerPage);
        var currPage = this.state.currPage;

        if (currPage > currLastPage) currPage = currLastPage;
        result = this.store.page(Util.getNormalizedPage(currPage), sizePerPage).get();
        this.setState(function () {
          return {
            data: result,
            selectedRowKeys: _this5.store.getSelectedRowKeys(),
            currPage: currPage,
            reset: false
          };
        });
      } else {
        result = this.store.get();
        this.setState(function () {
          return {
            data: result,
            reset: false,
            selectedRowKeys: _this5.store.getSelectedRowKeys()
          };
        });
      }
      if (this.props.options.afterDeleteRow) {
        this.props.options.afterDeleteRow(dropRowKeys);
      }
    }
  }, {
    key: 'renderPagination',
    value: function renderPagination() {
      if (this.props.pagination) {
        var dataSize = void 0;
        if (this.allowRemote(Const.REMOTE_PAGE)) {
          dataSize = this.props.fetchInfo.dataTotalSize;
        } else {
          dataSize = this.store.getDataNum();
        }
        var options = this.props.options;

        var withFirstAndLast = options.withFirstAndLast === undefined ? true : options.withFirstAndLast;
        if (Math.ceil(dataSize / this.state.sizePerPage) <= 1 && this.props.ignoreSinglePage) return null;
        return React.createElement(
          'div',
          { className: 'react-bs-table-pagination' },
          React.createElement(PaginationList, {
            ref: 'pagination',
            withFirstAndLast: withFirstAndLast,
            alwaysShowAllBtns: options.alwaysShowAllBtns,
            currPage: this.state.currPage,
            changePage: this.handlePaginationData,
            sizePerPage: this.state.sizePerPage,
            sizePerPageList: options.sizePerPageList || Const.SIZE_PER_PAGE_LIST,
            pageStartIndex: options.pageStartIndex,
            paginationShowsTotal: options.paginationShowsTotal,
            paginationSize: options.paginationSize || Const.PAGINATION_SIZE,
            dataSize: dataSize,
            onSizePerPageList: options.onSizePerPageList,
            prePage: options.prePage || Const.PRE_PAGE,
            nextPage: options.nextPage || Const.NEXT_PAGE,
            firstPage: options.firstPage || Const.FIRST_PAGE,
            lastPage: options.lastPage || Const.LAST_PAGE,
            prePageTitle: options.prePageTitle || Const.PRE_PAGE_TITLE,
            nextPageTitle: options.nextPageTitle || Const.NEXT_PAGE_TITLE,
            firstPageTitle: options.firstPageTitle || Const.FIRST_PAGE_TITLE,
            lastPageTitle: options.lastPageTitle || Const.LAST_PAGE_TITLE,
            hideSizePerPage: options.hideSizePerPage,
            sizePerPageDropDown: options.sizePerPageDropDown,
            hidePageListOnlyOnePage: options.hidePageListOnlyOnePage,
            paginationPanel: options.paginationPanel,
            keepSizePerPageState: options.keepSizePerPageState,
            open: false })
        );
      }
      return null;
    }
  }, {
    key: 'renderToolBar',
    value: function renderToolBar() {
      var _props2 = this.props,
          exportCSV = _props2.exportCSV,
          selectRow = _props2.selectRow,
          insertRow = _props2.insertRow,
          deleteRow = _props2.deleteRow,
          search = _props2.search,
          children = _props2.children,
          keyField = _props2.keyField;

      var enableShowOnlySelected = selectRow && selectRow.showOnlySelected;
      var print = typeof this.props.options.printToolBar === 'undefined' ? true : this.props.options.printToolBar;
      if (enableShowOnlySelected || insertRow || deleteRow || search || exportCSV || this.props.options.searchPanel || this.props.options.btnGroup || this.props.options.toolBar) {
        var columns = void 0;
        if (Array.isArray(children)) {
          columns = children.filter(function (_) {
            return _ != null;
          }).map(function (column, r) {
            if (!column) return;
            var props = column.props;

            var isKey = props.isKey || keyField === props.dataField;
            return {
              isKey: isKey,
              name: props.headerText || props.children,
              field: props.dataField,
              hiddenOnInsert: props.hiddenOnInsert,
              keyValidator: props.keyValidator,
              customInsertEditor: props.customInsertEditor,
              // when you want same auto generate value and not allow edit, example ID field
              autoValue: props.autoValue || false,
              // for create editor, no params for column.editable() indicate that editor for new row
              editable: props.editable && Util.isFunction(props.editable === 'function') ? props.editable() : props.editable,
              format: props.dataFormat ? function (value) {
                return props.dataFormat(value, null, props.formatExtraData, r).replace(/<.*?>/g, '');
              } : false
            };
          });
        } else {
          columns = [{
            name: children.props.headerText || children.props.children,
            field: children.props.dataField,
            editable: children.props.editable,
            customInsertEditor: children.props.customInsertEditor,
            hiddenOnInsert: children.props.hiddenOnInsert,
            keyValidator: children.props.keyValidator
          }];
        }
        return React.createElement(
          'div',
          { className: 'react-bs-table-tool-bar ' + (print ? '' : 'hidden-print') },
          React.createElement(ToolBar, {
            ref: 'toolbar',
            defaultSearch: this.props.options.defaultSearch,
            clearSearch: this.props.options.clearSearch,
            searchPosition: this.props.options.searchPosition,
            searchDelayTime: this.props.options.searchDelayTime,
            enableInsert: insertRow,
            enableDelete: deleteRow,
            enableSearch: search,
            enableExportCSV: exportCSV,
            enableShowOnlySelected: enableShowOnlySelected,
            columns: columns,
            searchPlaceholder: this.props.searchPlaceholder,
            exportCSVText: this.props.options.exportCSVText,
            insertText: this.props.options.insertText,
            deleteText: this.props.options.deleteText,
            saveText: this.props.options.saveText,
            closeText: this.props.options.closeText,
            ignoreEditable: this.props.options.ignoreEditable,
            onAddRow: this.handleAddRow,
            onDropRow: this.handleDropRow,
            onSearch: this.handleSearch,
            onExportCSV: this.handleExportCSV,
            onShowOnlySelected: this.handleShowOnlySelected,
            insertModalHeader: this.props.options.insertModalHeader,
            insertModalFooter: this.props.options.insertModalFooter,
            insertModalBody: this.props.options.insertModalBody,
            insertModal: this.props.options.insertModal,
            insertBtn: this.props.options.insertBtn,
            deleteBtn: this.props.options.deleteBtn,
            showSelectedOnlyBtn: this.props.options.showSelectedOnlyBtn,
            exportCSVBtn: this.props.options.exportCSVBtn,
            clearSearchBtn: this.props.options.clearSearchBtn,
            searchField: this.props.options.searchField,
            searchPanel: this.props.options.searchPanel,
            btnGroup: this.props.options.btnGroup,
            toolBar: this.props.options.toolBar,
            reset: this.state.reset,
            isValidKey: this.store.isValidKey })
        );
      } else {
        return null;
      }
    }
  }, {
    key: 'renderTableFilter',
    value: function renderTableFilter(columns) {
      if (this.props.columnFilter) {
        return React.createElement(TableFilter, { columns: columns,
          rowSelectType: this.props.selectRow.mode,
          onFilter: this.handleFilterData });
      } else {
        return null;
      }
    }
  }, {
    key: '_adjustTable',
    value: function _adjustTable() {
      this._adjustHeight();
      if (!this.props.printable) {
        this._adjustHeaderWidth();
      }
    }
  }, {
    key: '_adjustHeaderWidth',
    value: function _adjustHeaderWidth() {
      var header = this.refs.header.getHeaderColGrouop();
      var tbody = this.refs.body.refs.tbody;
      var bodyHeader = this.refs.body.getHeaderColGrouop();
      var firstRow = tbody.childNodes[0];
      var isScroll = tbody.parentNode.getBoundingClientRect().height > tbody.parentNode.parentNode.getBoundingClientRect().height;

      var scrollBarWidth = isScroll ? Util.getScrollBarWidth() : 0;
      if (firstRow && this.store.getDataNum()) {
        if (isScroll || this.isVerticalScroll !== isScroll) {
          var cells = firstRow.childNodes;
          for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var computedStyle = window.getComputedStyle(cell);
            var width = parseFloat(computedStyle.width.replace('px', ''));
            if (this.isIE) {
              var paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
              var paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
              var borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
              var borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
              width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
            }
            var lastPadding = cells.length - 1 === i ? scrollBarWidth : 0;
            if (width <= 0) {
              width = 120;
              cell.width = width + lastPadding + 'px';
            }
            var result = width + lastPadding + 'px';
            header[i].style.width = result;
            header[i].style.minWidth = result;
            if (cells.length - 1 === i) {
              bodyHeader[i].style.width = width + 'px';
              bodyHeader[i].style.minWidth = width + 'px';
            } else {
              bodyHeader[i].style.width = result;
              bodyHeader[i].style.minWidth = result;
            }
          }
        }
      } else {
        for (var _i in bodyHeader) {
          if (bodyHeader.hasOwnProperty(_i)) {
            var child = bodyHeader[_i];
            if (child.style.width) {
              header[_i].style.width = child.style.width;
            }
            if (child.style.minWidth) {
              header[_i].style.minWidth = child.style.minWidth;
            }
          }
        }
      }
      this.isVerticalScroll = isScroll;
    }
  }, {
    key: '_adjustHeight',
    value: function _adjustHeight() {
      var height = this.props.height;
      var maxHeight = this.props.maxHeight;

      if (typeof height === 'number' && !isNaN(height) || height.indexOf('%') === -1) {
        this.refs.body.refs.container.style.height = parseFloat(height, 10) - this.refs.header.refs.container.offsetHeight + 'px';
      }
      if (maxHeight) {
        maxHeight = typeof maxHeight === 'number' ? maxHeight : parseInt(maxHeight.replace('px', ''), 10);

        this.refs.body.refs.container.style.maxHeight = maxHeight - this.refs.header.refs.container.offsetHeight + 'px';
      }
    }
  }, {
    key: '_handleAfterAddingRow',
    value: function _handleAfterAddingRow(newObj, atTheBeginning) {
      var result = void 0;
      if (this.props.pagination) {
        // if pagination is enabled and inserting row at the end,
        // change page to the last page
        // otherwise, change it to the first page
        var sizePerPage = this.state.sizePerPage;


        if (atTheBeginning) {
          var pageStartIndex = this.props.options.pageStartIndex;

          result = this.store.page(Util.getNormalizedPage(pageStartIndex), sizePerPage).get();
          this.setState(function () {
            return {
              data: result,
              currPage: Util.getFirstPage(pageStartIndex),
              reset: false
            };
          });
        } else {
          var currLastPage = Math.ceil(this.store.getDataNum() / sizePerPage);
          result = this.store.page(currLastPage, sizePerPage).get();
          this.setState(function () {
            return {
              data: result,
              currPage: currLastPage,
              reset: false
            };
          });
        }
      } else {
        result = this.store.get();
        this.setState(function () {
          return {
            data: result,
            reset: false
          };
        });
      }

      if (this.props.options.afterInsertRow) {
        this.props.options.afterInsertRow(newObj);
      }
    }
  }]);

  return BootstrapTable;
}(Component);

var _initialiseProps = function _initialiseProps() {
  var _this6 = this;

  this.handleSort = function (order, sortField) {
    if (_this6.props.options.onSortChange) {
      _this6.props.options.onSortChange(sortField, order, _this6.props);
    }
    _this6.store.setSortInfo(order, sortField);
    if (_this6.allowRemote(Const.REMOTE_SORT)) {
      return;
    }

    var result = _this6.store.sort().get();
    _this6.setState(function () {
      return {
        data: result,
        reset: false
      };
    });
  };

  this.handleExpandRow = function (expanding, rowKey, isRowExpanding) {
    var onExpand = _this6.props.options.onExpand;

    if (onExpand) {
      onExpand(rowKey, !isRowExpanding);
    }
    _this6.setState(function () {
      return { expanding: expanding, reset: false };
    }, function () {
      _this6._adjustHeaderWidth();
    });
  };

  this.handlePaginationData = function (page, sizePerPage) {
    var _props$options = _this6.props.options,
        onPageChange = _props$options.onPageChange,
        pageStartIndex = _props$options.pageStartIndex;

    var emptyTable = _this6.store.isEmpty();
    if (onPageChange) {
      onPageChange(page, sizePerPage);
    }

    var state = {
      sizePerPage: sizePerPage,
      reset: false
    };
    if (!emptyTable) state.currPage = page;
    _this6.setState(function () {
      return state;
    });

    if (_this6.allowRemote(Const.REMOTE_PAGE) || emptyTable) {
      return;
    }

    var result = _this6.store.page(Util.getNormalizedPage(pageStartIndex, page), sizePerPage).get();
    _this6.setState(function () {
      return { data: result, reset: false };
    });
  };

  this.handleMouseLeave = function () {
    if (_this6.props.options.onMouseLeave) {
      _this6.props.options.onMouseLeave();
    }
  };

  this.handleMouseEnter = function () {
    if (_this6.props.options.onMouseEnter) {
      _this6.props.options.onMouseEnter();
    }
  };

  this.handleRowMouseOut = function (row, event) {
    if (_this6.props.options.onRowMouseOut) {
      _this6.props.options.onRowMouseOut(row, event);
    }
  };

  this.handleRowMouseOver = function (row, event) {
    if (_this6.props.options.onRowMouseOver) {
      _this6.props.options.onRowMouseOver(row, event);
    }
  };

  this.handleNavigateCell = function (_ref4) {
    var offSetX = _ref4.x,
        offSetY = _ref4.y,
        lastEditCell = _ref4.lastEditCell;
    var pagination = _this6.props.pagination;
    var _state = _this6.state,
        x = _state.x,
        y = _state.y,
        currPage = _state.currPage;

    x += offSetX;
    y += offSetY;

    var columns = _this6.store.getColInfos();
    var visibleRowSize = _this6.state.data.length;
    var visibleColumnSize = Object.keys(columns).filter(function (k) {
      return !columns[k].hidden;
    }).length;

    if (y >= visibleRowSize) {
      currPage++;
      var lastPage = pagination ? _this6.refs.pagination.getLastPage() : -1;
      if (currPage <= lastPage) {
        _this6.handlePaginationData(currPage, _this6.state.sizePerPage);
      } else {
        return;
      }
      y = 0;
    } else if (y < 0) {
      currPage--;
      if (currPage > 0) {
        _this6.handlePaginationData(currPage, _this6.state.sizePerPage);
      } else {
        return;
      }
      y = visibleRowSize - 1;
    } else if (x >= visibleColumnSize) {
      if (y + 1 === visibleRowSize) {
        currPage++;
        var _lastPage = pagination ? _this6.refs.pagination.getLastPage() : -1;
        if (currPage <= _lastPage) {
          _this6.handlePaginationData(currPage, _this6.state.sizePerPage);
        } else {
          return;
        }
        y = 0;
      } else {
        y++;
      }
      x = lastEditCell ? 1 : 0;
    } else if (x < 0) {
      x = visibleColumnSize - 1;
      if (y === 0) {
        currPage--;
        if (currPage > 0) {
          _this6.handlePaginationData(currPage, _this6.state.sizePerPage);
        } else {
          return;
        }
        y = _this6.state.sizePerPage - 1;
      } else {
        y--;
      }
    }
    _this6.setState(function () {
      return {
        x: x, y: y, currPage: currPage, reset: false
      };
    });
  };

  this.handleRowClick = function (row, rowIndex, columnIndex) {
    var _props3 = _this6.props,
        options = _props3.options,
        keyBoardNav = _props3.keyBoardNav;

    if (options.onRowClick) {
      options.onRowClick(row, columnIndex);
    }
    if (keyBoardNav) {
      var _ref5 = (typeof keyBoardNav === 'undefined' ? 'undefined' : _typeof(keyBoardNav)) === 'object' ? keyBoardNav : {},
          clickToNav = _ref5.clickToNav;

      clickToNav = clickToNav === false ? clickToNav : true;
      if (clickToNav) {
        _this6.setState(function () {
          return {
            x: columnIndex,
            y: rowIndex,
            reset: false
          };
        });
      }
    }
  };

  this.handleRowDoubleClick = function (row) {
    if (_this6.props.options.onRowDoubleClick) {
      _this6.props.options.onRowDoubleClick(row);
    }
  };

  this.handleSelectAllRow = function (e) {
    var isSelected = e.currentTarget.checked;
    var keyField = _this6.store.getKeyField();
    var _props$selectRow2 = _this6.props.selectRow,
        onSelectAll = _props$selectRow2.onSelectAll,
        unselectable = _props$selectRow2.unselectable,
        selected = _props$selectRow2.selected,
        onlyUnselectVisible = _props$selectRow2.onlyUnselectVisible;

    var selectedRowKeys = onlyUnselectVisible ? _this6.state.selectedRowKeys : [];
    var result = true;
    var rows = _this6.store.get();

    // onlyUnselectVisible default is false, #1276
    if (!isSelected && !onlyUnselectVisible) {
      rows = _this6.store.getRowByKey(_this6.state.selectedRowKeys);
    }

    if (unselectable && unselectable.length > 0) {
      if (isSelected) {
        rows = rows.filter(function (r) {
          return unselectable.indexOf(r[keyField]) === -1 || selected && selected.indexOf(r[keyField]) !== -1;
        });
      } else {
        rows = rows.filter(function (r) {
          return unselectable.indexOf(r[keyField]) === -1;
        });
      }
    }

    if (onSelectAll) {
      result = _this6.props.selectRow.onSelectAll(isSelected, rows);
    }

    if (typeof result == 'undefined' || result !== false) {
      if (isSelected) {
        if (Array.isArray(result)) {
          selectedRowKeys = result;
        } else {
          var currentRowKeys = rows.map(function (r) {
            return r[keyField];
          });
          // onlyUnselectVisible default is false, #1276
          if (onlyUnselectVisible) {
            selectedRowKeys = selectedRowKeys.concat(currentRowKeys);
          } else {
            selectedRowKeys = currentRowKeys;
          }
        }
      } else {
        if (unselectable && selected) {
          selectedRowKeys = selected.filter(function (r) {
            return unselectable.indexOf(r) > -1;
          });
        } else if (onlyUnselectVisible) {
          var _currentRowKeys = rows.map(function (r) {
            return r[keyField];
          });
          selectedRowKeys = selectedRowKeys.filter(function (k) {
            return _currentRowKeys.indexOf(k) === -1;
          });
        }
      }

      _this6.store.setSelectedRowKey(selectedRowKeys);
      _this6.setState(function () {
        return { selectedRowKeys: selectedRowKeys, reset: false };
      });
    }
  };

  this.handleShowOnlySelected = function () {
    _this6.store.ignoreNonSelected();
    var pageStartIndex = _this6.props.options.pageStartIndex;

    var result = void 0;
    if (_this6.props.pagination) {
      result = _this6.store.page(Util.getNormalizedPage(pageStartIndex), _this6.state.sizePerPage).get();
    } else {
      result = _this6.store.get();
    }
    _this6.setState(function () {
      return {
        data: result,
        reset: false,
        currPage: Util.getFirstPage(pageStartIndex)
      };
    });
  };

  this.handleSelectRow = function (row, isSelected, e) {
    var result = true;
    var currSelected = _this6.store.getSelectedRowKeys();
    var rowKey = row[_this6.store.getKeyField()];
    var selectRow = _this6.props.selectRow;

    if (selectRow.onSelect) {
      result = selectRow.onSelect(row, isSelected, e);
    }

    if (typeof result === 'undefined' || result !== false) {
      if (selectRow.mode === Const.ROW_SELECT_SINGLE) {
        currSelected = isSelected ? [rowKey] : [];
      } else {
        if (isSelected) {
          currSelected.push(rowKey);
        } else {
          currSelected = currSelected.filter(function (key) {
            return rowKey !== key;
          });
        }
      }

      _this6.store.setSelectedRowKey(currSelected);
      _this6.setState(function () {
        return {
          selectedRowKeys: currSelected,
          reset: false
        };
      });
    }
  };

  this.handleAddRow = function (newObj) {
    var isAsync = false;
    var onAddRow = _this6.props.options.onAddRow;


    var afterHandleAddRow = function afterHandleAddRow(errMsg) {
      if (isAsync) {
        _this6.refs.toolbar.afterHandleSaveBtnClick(errMsg);
      } else {
        return errMsg;
      }
    };

    var afterAddRowCB = function afterAddRowCB(errMsg) {
      if (typeof errMsg !== 'undefined' && errMsg !== '') return afterHandleAddRow(errMsg);
      if (_this6.allowRemote(Const.REMOTE_INSERT_ROW)) {
        if (_this6.props.options.afterInsertRow) {
          _this6.props.options.afterInsertRow(newObj);
        }
        return afterHandleAddRow();
      }

      try {
        _this6.store.add(newObj);
      } catch (e) {
        return afterHandleAddRow(e.message);
      }
      _this6._handleAfterAddingRow(newObj, false);
      return afterHandleAddRow();
    };

    if (onAddRow) {
      var colInfos = _this6.store.getColInfos();
      var errMsg = onAddRow(newObj, colInfos, afterAddRowCB);

      if (errMsg !== '' && errMsg !== false) {
        return errMsg;
      } else if (typeof errMsg === 'undefined') {
        return afterAddRowCB();
      } else {
        isAsync = true;
        return !isAsync;
      }
    } else {
      return afterAddRowCB();
    }
  };

  this.getPageByRowKey = function (rowKey) {
    var sizePerPage = _this6.state.sizePerPage;

    var currentData = _this6.store.getCurrentDisplayData();
    var keyField = _this6.store.getKeyField();
    var result = currentData.findIndex(function (x) {
      return x[keyField] === rowKey;
    });
    if (result > -1) {
      return parseInt(result / sizePerPage, 10) + 1;
    } else {
      return result;
    }
  };

  this.handleDropRow = function (rowKeys) {
    var dropRowKeys = rowKeys ? rowKeys : _this6.store.getSelectedRowKeys();
    // add confirm before the delete action if that option is set.
    if (dropRowKeys && dropRowKeys.length > 0) {
      if (_this6.props.options.handleConfirmDeleteRow) {
        _this6.props.options.handleConfirmDeleteRow(function () {
          _this6.deleteRow(dropRowKeys);
        }, dropRowKeys);
      } else if (confirm('Are you sure you want to delete?')) {
        _this6.deleteRow(dropRowKeys);
      }
    }
  };

  this.handleFilterData = function (filterObj) {
    var _props$options2 = _this6.props.options,
        onFilterChange = _props$options2.onFilterChange,
        pageStartIndex = _props$options2.pageStartIndex;

    if (onFilterChange) {
      var colInfos = _this6.store.getColInfos();
      onFilterChange(filterObj, colInfos);
    }

    _this6.setState(function () {
      return {
        currPage: Util.getFirstPage(pageStartIndex),
        reset: false
      };
    });

    if (_this6.allowRemote(Const.REMOTE_FILTER)) {
      if (_this6.props.options.afterColumnFilter) {
        _this6.props.options.afterColumnFilter(filterObj, _this6.store.getDataIgnoringPagination());
      }
      return;
    }

    _this6.store.filter(filterObj);

    var sortList = _this6.store.getSortInfo();

    if (sortList.length > 0) {
      _this6.store.sort();
    }

    var result = void 0;

    if (_this6.props.pagination) {
      var sizePerPage = _this6.state.sizePerPage;

      result = _this6.store.page(Util.getNormalizedPage(pageStartIndex), sizePerPage).get();
    } else {
      result = _this6.store.get();
    }
    if (_this6.props.options.afterColumnFilter) {
      _this6.props.options.afterColumnFilter(filterObj, _this6.store.getDataIgnoringPagination());
    }
    _this6.setState(function () {
      return {
        data: result,
        reset: false
      };
    });
  };

  this.handleExportCSV = function () {
    var result = {};

    var csvFileName = _this6.props.csvFileName;
    var _props$options3 = _this6.props.options,
        onExportToCSV = _props$options3.onExportToCSV,
        exportCSVSeparator = _props$options3.exportCSVSeparator;

    if (onExportToCSV) {
      result = onExportToCSV();
    } else {
      result = _this6.store.getDataIgnoringPagination();
    }
    var separator = exportCSVSeparator || Const.DEFAULT_CSV_SEPARATOR;
    var keys = [];
    _this6.props.children.filter(function (_) {
      return _ != null;
    }).map(function (column) {
      if (column.props.export === true || typeof column.props.export === 'undefined' && column.props.hidden === false) {
        keys.push({
          field: column.props.dataField,
          format: column.props.csvFormat,
          extraData: column.props.csvFormatExtraData,
          header: column.props.csvHeader || column.props.dataField,
          row: Number(column.props.row) || 0,
          rowSpan: Number(column.props.rowSpan) || 1,
          colSpan: Number(column.props.colSpan) || 1
        });
      }
    });

    if (Util.isFunction(csvFileName)) {
      csvFileName = csvFileName();
    }

    exportCSVUtil(result, keys, csvFileName, separator);
  };

  this.handleSearch = function (searchText) {
    // Set search field if this function being called outside
    // but it's not necessary if calling fron inside.
    if (_this6.refs.toolbar) {
      _this6.refs.toolbar.setSearchInput(searchText);
    }
    var _props$options4 = _this6.props.options,
        onSearchChange = _props$options4.onSearchChange,
        pageStartIndex = _props$options4.pageStartIndex;

    if (onSearchChange) {
      var colInfos = _this6.store.getColInfos();
      onSearchChange(searchText, colInfos, _this6.props.multiColumnSearch);
    }

    _this6.setState(function () {
      return {
        currPage: Util.getFirstPage(pageStartIndex),
        reset: false
      };
    });

    if (_this6.allowRemote(Const.REMOTE_SEARCH)) {
      if (_this6.props.options.afterSearch) {
        _this6.props.options.afterSearch(searchText, _this6.store.getDataIgnoringPagination());
      }
      return;
    }

    _this6.store.search(searchText);

    var sortList = _this6.store.getSortInfo();

    if (sortList.length > 0) {
      _this6.store.sort();
    }

    var result = void 0;
    if (_this6.props.pagination) {
      var sizePerPage = _this6.state.sizePerPage;

      result = _this6.store.page(Util.getNormalizedPage(pageStartIndex), sizePerPage).get();
    } else {
      result = _this6.store.get();
    }
    if (_this6.props.options.afterSearch) {
      _this6.props.options.afterSearch(searchText, _this6.store.getDataIgnoringPagination());
    }
    _this6.setState(function () {
      return {
        data: result,
        reset: false
      };
    });
  };

  this._scrollTop = function () {
    var scrollTop = _this6.props.scrollTop;

    if (scrollTop === Const.SCROLL_TOP) {
      _this6.refs.body.refs.container.scrollTop = 0;
    } else if (scrollTop === Const.SCROLL_BOTTOM) {
      _this6.refs.body.refs.container.scrollTop = _this6.refs.body.refs.container.scrollHeight;
    } else if (typeof scrollTop === 'number' && !isNaN(scrollTop)) {
      _this6.refs.body.refs.container.scrollTop = scrollTop;
    }
  };

  this._scrollHeader = function (e) {
    _this6.refs.header.refs.container.scrollLeft = e.currentTarget.scrollLeft;
  };
};

BootstrapTable.propTypes = {
  keyField: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  remote: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // remote data, default is false
  scrollTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  striped: PropTypes.bool,
  bordered: PropTypes.bool,
  hover: PropTypes.bool,
  condensed: PropTypes.bool,
  pagination: PropTypes.bool,
  printable: PropTypes.bool,
  keyBoardNav: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  searchPlaceholder: PropTypes.string,
  selectRow: PropTypes.shape({
    mode: PropTypes.oneOf([Const.ROW_SELECT_NONE, Const.ROW_SELECT_SINGLE, Const.ROW_SELECT_MULTI]),
    customComponent: PropTypes.func,
    bgColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    selected: PropTypes.array,
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
    clickToSelect: PropTypes.bool,
    hideSelectColumn: PropTypes.bool,
    clickToSelectAndEditCell: PropTypes.bool,
    clickToExpand: PropTypes.bool,
    showOnlySelected: PropTypes.bool,
    unselectable: PropTypes.array,
    columnWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onlyUnselectVisible: PropTypes.bool
  }),
  cellEdit: PropTypes.shape({
    mode: PropTypes.string,
    blurToSave: PropTypes.bool,
    beforeSaveCell: PropTypes.func,
    afterSaveCell: PropTypes.func,
    nonEditableRows: PropTypes.func
  }),
  insertRow: PropTypes.bool,
  deleteRow: PropTypes.bool,
  search: PropTypes.bool,
  multiColumnSearch: PropTypes.bool,
  strictSearch: PropTypes.bool,
  columnFilter: PropTypes.bool,
  trClassName: PropTypes.any,
  tableStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  containerClass: PropTypes.string,
  tableContainerClass: PropTypes.string,
  headerContainerClass: PropTypes.string,
  bodyContainerClass: PropTypes.string,
  tableHeaderClass: PropTypes.string,
  tableBodyClass: PropTypes.string,
  options: PropTypes.shape({
    clearSearch: PropTypes.bool,
    sortName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    sortOrder: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    defaultSortName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    defaultSortOrder: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    sortIndicator: PropTypes.bool,
    afterTableComplete: PropTypes.func,
    afterDeleteRow: PropTypes.func,
    afterInsertRow: PropTypes.func,
    afterSearch: PropTypes.func,
    afterColumnFilter: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    page: PropTypes.number,
    pageStartIndex: PropTypes.number,
    paginationShowsTotal: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    sizePerPageList: PropTypes.array,
    sizePerPage: PropTypes.number,
    paginationSize: PropTypes.number,
    paginationPosition: PropTypes.oneOf([Const.PAGINATION_POS_TOP, Const.PAGINATION_POS_BOTTOM, Const.PAGINATION_POS_BOTH]),
    hideSizePerPage: PropTypes.bool,
    hidePageListOnlyOnePage: PropTypes.bool,
    alwaysShowAllBtns: PropTypes.bool,
    withFirstAndLast: PropTypes.bool,
    keepSizePerPageState: PropTypes.bool,
    onSortChange: PropTypes.func,
    onPageChange: PropTypes.func,
    onSizePerPageList: PropTypes.func,
    onFilterChange: React.PropTypes.func,
    onSearchChange: React.PropTypes.func,
    onAddRow: React.PropTypes.func,
    onExportToCSV: React.PropTypes.func,
    onCellEdit: React.PropTypes.func,
    noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    withoutNoDataText: React.PropTypes.bool,
    handleConfirmDeleteRow: PropTypes.func,
    prePage: PropTypes.any,
    nextPage: PropTypes.any,
    firstPage: PropTypes.any,
    lastPage: PropTypes.any,
    prePageTitle: PropTypes.string,
    nextPageTitle: PropTypes.string,
    firstPageTitle: PropTypes.string,
    lastPageTitle: PropTypes.string,
    searchDelayTime: PropTypes.number,
    exportCSVText: PropTypes.string,
    exportCSVSeparator: PropTypes.string,
    insertText: PropTypes.string,
    deleteText: PropTypes.string,
    saveText: PropTypes.string,
    closeText: PropTypes.string,
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
    sizePerPageDropDown: PropTypes.func,
    paginationPanel: PropTypes.func,
    searchPosition: PropTypes.string,
    expandRowBgColor: PropTypes.string,
    expandBy: PropTypes.string,
    expanding: PropTypes.array,
    onExpand: PropTypes.func,
    onlyOneExpanding: PropTypes.bool,
    expandBodyClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    expandParentClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    beforeShowError: PropTypes.func,
    printToolBar: PropTypes.bool
  }),
  fetchInfo: PropTypes.shape({
    dataTotalSize: PropTypes.number
  }),
  exportCSV: PropTypes.bool,
  csvFileName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  ignoreSinglePage: PropTypes.bool,
  expandableRow: PropTypes.func,
  expandComponent: PropTypes.func,
  expandColumnOptions: PropTypes.shape({
    columnWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    expandColumnVisible: PropTypes.bool,
    expandColumnComponent: PropTypes.func,
    expandColumnBeforeSelectColumn: PropTypes.bool
  })
};
BootstrapTable.defaultProps = {
  scrollTop: undefined,
  expandComponent: undefined,
  expandableRow: undefined,
  expandColumnOptions: {
    expandColumnVisible: false,
    expandColumnComponent: undefined,
    expandColumnBeforeSelectColumn: true
  },
  height: '100%',
  maxHeight: undefined,
  striped: false,
  bordered: true,
  hover: false,
  condensed: false,
  pagination: false,
  printable: false,
  keyBoardNav: false,
  searchPlaceholder: undefined,
  selectRow: {
    mode: Const.ROW_SELECT_NONE,
    bgColor: Const.ROW_SELECT_BG_COLOR,
    selected: [],
    onSelect: undefined,
    onSelectAll: undefined,
    clickToSelect: false,
    hideSelectColumn: false,
    clickToSelectAndEditCell: false,
    clickToExpand: false,
    showOnlySelected: false,
    unselectable: [],
    customComponent: undefined,
    onlyUnselectVisible: false
  },
  cellEdit: {
    mode: Const.CELL_EDIT_NONE,
    blurToSave: false,
    beforeSaveCell: undefined,
    afterSaveCell: undefined,
    nonEditableRows: undefined
  },
  insertRow: false,
  deleteRow: false,
  search: false,
  multiColumnSearch: false,
  strictSearch: undefined,
  multiColumnSort: 1,
  columnFilter: false,
  trClassName: '',
  tableStyle: undefined,
  containerStyle: undefined,
  headerStyle: undefined,
  bodyStyle: undefined,
  containerClass: null,
  tableContainerClass: null,
  headerContainerClass: null,
  bodyContainerClass: null,
  tableHeaderClass: null,
  tableBodyClass: null,
  options: {
    clearSearch: false,
    sortName: undefined,
    sortOrder: undefined,
    defaultSortName: undefined,
    defaultSortOrder: undefined,
    sortIndicator: true,
    afterTableComplete: undefined,
    afterDeleteRow: undefined,
    afterInsertRow: undefined,
    afterSearch: undefined,
    afterColumnFilter: undefined,
    onRowClick: undefined,
    onRowDoubleClick: undefined,
    onMouseLeave: undefined,
    onMouseEnter: undefined,
    onRowMouseOut: undefined,
    onRowMouseOver: undefined,
    page: undefined,
    paginationShowsTotal: false,
    sizePerPageList: Const.SIZE_PER_PAGE_LIST,
    sizePerPage: undefined,
    paginationSize: Const.PAGINATION_SIZE,
    paginationPosition: Const.PAGINATION_POS_BOTTOM,
    hideSizePerPage: false,
    hidePageListOnlyOnePage: false,
    alwaysShowAllBtns: false,
    withFirstAndLast: true,
    keepSizePerPageState: false,
    onSizePerPageList: undefined,
    noDataText: undefined,
    withoutNoDataText: false,
    handleConfirmDeleteRow: undefined,
    prePage: Const.PRE_PAGE,
    nextPage: Const.NEXT_PAGE,
    firstPage: Const.FIRST_PAGE,
    lastPage: Const.LAST_PAGE,
    prePageTitle: Const.PRE_PAGE_TITLE,
    nextPageTitle: Const.NEXT_PAGE_TITLE,
    firstPageTitle: Const.FIRST_PAGE_TITLE,
    lastPageTitle: Const.LAST_PAGE_TITLE,
    pageStartIndex: 1,
    searchDelayTime: undefined,
    exportCSVText: Const.EXPORT_CSV_TEXT,
    exportCSVSeparator: Const.DEFAULT_CSV_SEPARATOR,
    insertText: Const.INSERT_BTN_TEXT,
    deleteText: Const.DELETE_BTN_TEXT,
    saveText: Const.SAVE_BTN_TEXT,
    closeText: Const.CLOSE_BTN_TEXT,
    ignoreEditable: false,
    defaultSearch: '',
    insertModalHeader: undefined,
    insertModalBody: undefined,
    insertModalFooter: undefined,
    insertModal: undefined,
    insertBtn: undefined,
    deleteBtn: undefined,
    showSelectedOnlyBtn: undefined,
    exportCSVBtn: undefined,
    clearSearchBtn: undefined,
    searchField: undefined,
    searchPanel: undefined,
    btnGroup: undefined,
    toolBar: undefined,
    sizePerPageDropDown: undefined,
    paginationPanel: undefined,
    searchPosition: 'right',
    expandRowBgColor: undefined,
    expandBy: Const.EXPAND_BY_ROW,
    expanding: [],
    onExpand: undefined,
    onlyOneExpanding: false,
    expandBodyClass: null,
    expandParentClass: null,
    beforeShowError: undefined,
    printToolBar: true
  },
  fetchInfo: {
    dataTotalSize: 0
  },
  exportCSV: false,
  csvFileName: 'spreadsheet.csv',
  ignoreSinglePage: false
};

export default BootstrapTable;