/**
 * Repository for studying material
 */
var RT = {
  storageKey: 'lastData',
  data: undefined,
  chapList: undefined,
  dataID: undefined,
  score: undefined,

  initialize: function(cb) {
    var dataStr = localStorage.getItem(RT.storageKey);
    if( dataStr ) {
      RT.onLoad(JSON.parse(dataStr), cb);
    } else {
      RT.loadSample(cb);
    }
  },

  loadSample: function(callback) {
    aj.call({
      url: 'data/sample.json',
      success: function(data) {
        RT.onLoad(data, callback);
      },
      error: function() {
        console.log('error');
        if( isValid(errorCB) ) { errorCB(); }
      }
    });
  },

  load: function(dataCode, callback, errorCB) {
    $.support.cors = true;

    aj.call({
      url: 'http://www.tool4.us:3100/study/download',
      method: 'GET',
      data: {'code': dataCode},
      success: function(data) {
        RT.onLoad(data, callback);
      },
      error: function() {
        console.log('error');
        if( isValid(errorCB) ) { errorCB(); }
      }
    });
  },

  onLoad: function(data, callback) {
    var dataObj;

    if( data instanceof Object ) {
      dataObj = data;
    } else {
      dataObj = JSON.parse(data);
    }

    if( isValid(dataObj.error) ) {
      if( isValid(errorCB) ) { errorCB(dataObj); }
      return;
    }

    RT.data = dataObj;
    RT.dataID = RT.data.header.id;
    RT.chapList = RT.data.contents;

    var saved = localStorage.getItem('SM-' + RT.dataID);

    if( isValid2(saved) ) {
      RT.score = JSON.parse(saved);
    } else {
      RT.score = {};
    }

    for(var i = 0; i < RT.chapList.length; ++i) {
      var chapId = RT.chapList[i].chapter;

      if( !isValid2(RT.score[chapId]) ) {
        RT.score[chapId] = {};
      }

      var d = RT.chapList[i].dialog;
      for(var j = 0; j < d.length; ++j) {
        if( isValid2(RT.score[chapId][j]) ) { continue; }

        RT.score[chapId][j] = { 'e2k':{'try':0, 'pass':0, 'fail':0}, 'k2e':{'try':0, 'pass':0, 'fail':0} };
      }
    }

    localStorage.setItem(RT.storageKey, JSON.stringify(dataObj));

    if( isValid(callback) ) { callback(data); }
  },

  getDataID: function() {
    return RT.data.header.id;
  },

  sizeOfChapter: function() {
    return isValid2(RT.chapList) ? RT.chapList.length : 0;
  },

  getContent: function(idx) {
    return RT.chapList[idx];
  },

  sizeOfDialog: function(idx) {
    return RT.chapList[idx].dialog.length;
  },

  save: function() {
    localStorage.setItem('SM-' + RT.dataID, JSON.stringify(RT.score) );
  },

  /**
   * who:'', english:'', korean:''
   */
  getDialog: function(chapIdx, dialogIdx) {
    return RT.chapList[chapIdx].dialog[dialogIdx];
  },

  // returns undefined: haven't been tested yet, the rate of passing the test at range [0, 1]
  getPassRate: function(chapIdx, dialogIdx, e2k) {
    var chapId = RT.chapList[chapIdx].chapter;
    var type = (e2k ? 'e2k' : 'k2e');
    var score;

    if( isValid3(RT.score[chapId][dialogIdx][type].try) ) {
      score = RT.score[chapId][dialogIdx][type].pass / RT.score[chapId][dialogIdx][type].try;
    }

    return score;
  },

  getPassRateAsHtml: function(chapIdx, dialogIdx, e2k) {
    var rate = RT.getPassRate(chapIdx, dialogIdx, e2k);

    return isValid(rate) ? '<span class="x-rate"> [' + Math.floor(rate * 100) + '%]</span>' : '';
  },

  putTestResult: function(chapIdx, dialogIdx, e2k, pass) {
    var chapId = RT.chapList[chapIdx].chapter;
    var type = (e2k ? 'e2k' : 'k2e');

    RT.score[chapId][dialogIdx][type].try += 1;
    RT.score[chapId][dialogIdx][type][pass ? 'pass' : 'fail'] += 1;

    console.log('(' + chapId + ' / ' + dialogIdx + ') --> ' + (e2k ? 'e2k' : 'k2e') + ': ' + (pass ? 'passed' : 'failed') );
  },
};
