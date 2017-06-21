/* eslint block-scoped-var: 0 */
/* eslint vars-on-top: 0 */
/* eslint no-var: 0 */
/* eslint no-unused-vars: 0 */
import Util from './util';

if (Util.canUseDOM()) {
  var filesaver = require('./filesaver');
  var saveAs = filesaver.saveAs;
}

function toString(data, keys, separator) {
  var dataString = '';
  if (data.length === 0) return dataString;

  var headCells = [];
  var rowCount = 0;
  keys.forEach(function (key) {
    if (key.row > rowCount) {
      rowCount = key.row;
    }
    // rowCount += (key.rowSpan + key.colSpan - 1);
    for (var index = 0; index < key.colSpan; index++) {
      headCells.push(key);
    }
  });

  var _loop = function _loop(i) {
    dataString += headCells.map(function (x) {
      if (x.row + (x.rowSpan - 1) === i) {
        return x.header;
      }
      if (x.row === i && x.rowSpan > 1) {
        return '';
      }
    }).filter(function (key) {
      return typeof key !== 'undefined';
    }).join(separator) + '\n';
  };

  for (var i = 0; i <= rowCount; i++) {
    _loop(i);
  }

  keys = keys.filter(function (key) {
    return key.field !== undefined;
  });

  data.map(function (row) {
    keys.map(function (col, i) {
      var field = col.field,
          format = col.format,
          extraData = col.extraData;

      var value = typeof format !== 'undefined' ? format(row[field], row, extraData) : row[field];
      var cell = typeof value !== 'undefined' ? '"' + value + '"' : '';
      dataString += cell;
      if (i + 1 < keys.length) dataString += separator;
    });

    dataString += '\n';
  });

  return dataString;
}

var exportCSV = function exportCSV(data, keys, filename, separator) {
  var dataString = toString(data, keys, separator);
  if (typeof window !== 'undefined') {
    saveAs(new Blob([dataString], { type: 'text/plain;charset=utf-8' }), filename, true);
  }
};

export default exportCSV;