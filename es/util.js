/* eslint react/display-name: 0 */
import React from 'react';
import Const from './Const';
import classSet from 'classnames';

export default {
  renderReactSortCaret: function renderReactSortCaret(order) {
    var orderClass = classSet('order', {
      'dropup': order === Const.SORT_ASC
    });
    return React.createElement(
      'span',
      { className: orderClass },
      React.createElement('span', { className: 'caret', style: { margin: '10px 5px' } })
    );
  },
  isFunction: function isFunction(obj) {
    return obj && typeof obj === 'function';
  },
  getScrollBarWidth: function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    var outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.getBoundingClientRect().width;
    outer.style.overflow = 'scroll';
    var w2 = inner.getBoundingClientRect().width;

    if (w1 === w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return w1 - w2;
  },
  canUseDOM: function canUseDOM() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  },


  // We calculate an offset here in order to properly fetch the indexed data,
  // despite the page start index not always being 1
  getNormalizedPage: function getNormalizedPage(pageStartIndex, page) {
    pageStartIndex = this.getFirstPage(pageStartIndex);
    if (page === undefined) page = pageStartIndex;
    var offset = Math.abs(Const.PAGE_START_INDEX - pageStartIndex);
    return page + offset;
  },
  getFirstPage: function getFirstPage(pageStartIndex) {
    return pageStartIndex !== undefined ? pageStartIndex : Const.PAGE_START_INDEX;
  },
  renderColGroup: function renderColGroup(columns, selectRow) {
    var expandColumnOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var selectRowHeader = null;
    var expandRowHeader = null;
    var isSelectRowDefined = selectRow.mode === Const.ROW_SELECT_SINGLE || selectRow.mode === Const.ROW_SELECT_MULTI;
    if (isSelectRowDefined) {
      var style = {
        width: selectRow.columnWidth || '30px',
        minWidth: selectRow.columnWidth || '30px'
      };
      if (!selectRow.hideSelectColumn) {
        selectRowHeader = React.createElement('col', { key: 'select-col', style: style });
      }
    }
    if (expandColumnOptions.expandColumnVisible) {
      var _style = {
        width: expandColumnOptions.columnWidth || 30,
        minWidth: expandColumnOptions.columnWidth || 30
      };
      expandRowHeader = React.createElement('col', { key: 'expand-col', style: _style });
    }
    var theader = columns.map(function (column, i) {
      var style = {
        display: column.hidden ? 'none' : null
      };
      if (column.width) {
        var width = !isNaN(column.width) ? column.width + 'px' : column.width;
        style.width = width;
        /** add min-wdth to fix user assign column width
        not eq offsetWidth in large column table **/
        style.minWidth = width;
      }
      return React.createElement('col', { style: style, key: i, className: column.className });
    });

    return React.createElement(
      'colgroup',
      null,
      expandColumnOptions.expandColumnVisible && expandColumnOptions.expandColumnBeforeSelectColumn && expandRowHeader,
      selectRowHeader,
      expandColumnOptions.expandColumnVisible && !expandColumnOptions.expandColumnBeforeSelectColumn && expandRowHeader,
      theader
    );
  }
};