var SHEET_NAME = 'taxonomy';
var PROP_KEY_NAME = 'API_KEY';

function doOptions(e) {
  var out = ContentService.createTextOutput('');
  out.setMimeType(ContentService.MimeType.TEXT);
  _setCorsHeaders(out);
  return out;
}

function _setCorsHeaders(out) {
  if (typeof out.setHeader === 'function') {
    out.setHeader('Access-Control-Allow-Origin', '*');
    out.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    out.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function _jsonp(e, obj) {
  var cb = e && e.parameter && e.parameter.callback;
  var body = cb ? cb + '(' + JSON.stringify(obj) + ')' : JSON.stringify(obj);
  var mime = cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
  var out = ContentService.createTextOutput(body).setMimeType(mime);
  _setCorsHeaders(out);
  return out;
}

function doGet(e) {
  var apiKey = PropertiesService.getScriptProperties().getProperty(PROP_KEY_NAME) || '';
  if (!e || !e.parameter.key || e.parameter.key !== apiKey) {
    return _jsonp(e, { error: 'unauthorized' });
  }

  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) {
    return _jsonp(e, { error: 'Sheet with name "' + SHEET_NAME + '" not found.' });
  }

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return _jsonp(e, { items: [] });
  }

  var headers = values.shift();
  var items = values.map(function(row) {
    var obj = {};
    headers.forEach(function(header, index) {
      obj[header] = row[index];
    });
    return obj;
  });

  return _jsonp(e, { items: items });
}

function doPost(e) {
  var apiKey = PropertiesService.getScriptProperties().getProperty(PROP_KEY_NAME) || '';
  if ((e.parameter.key || '') !== apiKey) {
    return _jsonResponse({ error: 'unauthorized' }, 401);
  }

  var body = {};
  if (e.postData && e.postData.contents) {
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      body = {};
    }
  }

  var action = body.action || (e.parameter.action || '').trim();
  if (action !== 'saveTaxonomy') {
    return _jsonResponse({ error: 'unknown action' }, 400);
  }

  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) {
    return _jsonResponse({ error: 'Sheet not found: ' + SHEET_NAME }, 500);
  }

  var rawItems = body.items || body.data || e.parameter.items;
  if (typeof rawItems === 'string') {
    try {
      rawItems = JSON.parse(rawItems);
    } catch (err) {
      rawItems = [];
    }
  }

  var items = [];
  if (Array.isArray(rawItems)) {
    items = rawItems;
  } else if (rawItems && typeof rawItems === 'object') {
    Object.keys(rawItems).forEach(function(category) {
      (rawItems[category] || []).forEach(function(item) {
        items.push(item);
      });
    });
  }

  var headers = ['category', 'id', 'label', 'prompt_text', 'tags', 'order'];
  var rows = [headers];

  items.forEach(function(item) {
    rows.push(headers.map(function(h) {
      var value = item[h];
      if (h === 'tags' && Array.isArray(value)) {
        value = value.join('|');
      }
      return value === undefined || value === null ? '' : value;
    }));
  });

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  SpreadsheetApp.flush();

  return _jsonResponse({ success: true, count: items.length }, 200);
}

function _jsonResponse(data, statusCode) {
  var out = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  if (typeof out.setResponseCode === 'function') {
    out.setResponseCode(statusCode || 200);
  }
  _setCorsHeaders(out);
  return out;
}
