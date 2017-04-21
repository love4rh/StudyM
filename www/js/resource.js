/**
 * Repository for studying material
 */
var RT = {
  storageKey: 'lastData',
  data: undefined,
  chapList: undefined,
  dataID: undefined,
  score: undefined,
  chapId2Idx: {},

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
        RT.onLoad(data, callback, errorCB);
      },
      error: function(err) {
        console.log(err);
        if( isValid(errorCB) ) { errorCB('error'); }
      }
    });
  },

  onLoad: function(data, callback, errorCB) {
    var dataObj;

    if( data instanceof Object ) {
      dataObj = data;
    } else {
      dataObj = JSON.parse(data);
    }

    if( isValid(dataObj.error) ) {
      if( isValid(errorCB) ) { errorCB(dataObj.error); }
      return;
    }

    RT.data = dataObj;
    RT.dataID = RT.data.header.id;
    RT.chapList = RT.data.contents;

    var currentVersion = 1;
    var saved = localStorage.getItem('SR-' + RT.dataID);

    if( isValid2(saved) ) {
      RT.score = JSON.parse(saved);
    } else {
      RT.score = { 'version':currentVersion, 'e2k':{}, 'k2e':{} };
    }

    var v = RT.score.version;
    if( isValid2(v) ) { v = 0; }

    for(var i = 0; i < RT.chapList.length; ++i) {
      var chapId = RT.chapList[i].chapter;
      var d = RT.chapList[i].dialog;

      RT.chapId2Idx[chapId] = i;

      for(var j = 0; j < d.length; ++j) {
        var mk = RT._makeKey(chapId, j);
        if( isValid2(RT.score.e2k[mk]) ) {
          if( v == 0 ) {
            RT.score.e2k[mk].push(0);
            RT.score.k2e[mk].push(0);
          }
          continue;
        }

        RT.score.e2k[mk] = [0, 0, 0, 0];  // try, pass, fail count and last result
        RT.score.k2e[mk] = [0, 0, 0, 0];
      }
    }

    localStorage.setItem(RT.storageKey, JSON.stringify(dataObj));

    if( isValid(callback) ) { callback(data); }
  },

  _makeKey: function(chanId, dialogIdx) {
    return chanId + '/' + dialogIdx
  },

  _sepKey: function(key) {
    var p = key.indexOf('/');
    if( p == -1 ) { return; }

    return [key.substring(0, p), parseInt(key.substring(p + 1))];
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
    localStorage.setItem('SR-' + RT.dataID, JSON.stringify(RT.score) );
  },

  /**
   * who:'', english:'', korean:''
   */
  getDialog: function(chapIdx, dialogIdx) {
    return RT.chapList[chapIdx].dialog[dialogIdx];
  },

  // returns undefined: haven't been tested yet, the rate of passing the test at range [0, 1]
  getPassRate: function(chapIdx, dialogIdx, e2k) {
    var score;
    var chapId = RT.chapList[chapIdx].chapter;
    var mk = RT._makeKey(chapId, dialogIdx);
    var type = (e2k ? 'e2k' : 'k2e');

    if( isValid3(RT.score[type][mk][0]) ) {
      score = RT.score[type][mk][1] / RT.score[type][mk][0];
    }

    return score;
  },

  getPassRateAsHtml: function(chapIdx, dialogIdx, e2k) {
    var rate = RT.getPassRate(chapIdx, dialogIdx, e2k);

    return isValid(rate) ? '<span class="x-rate"> [' + Math.floor(rate * 100) + '%]</span>' : '';
  },

  putTestResult: function(chapIdx, dialogIdx, e2k, pass) {
    var chapId = RT.chapList[chapIdx].chapter;
    var mk = RT._makeKey(chapId, dialogIdx);
    var type = (e2k ? 'e2k' : 'k2e');
    var today = Math.floor(tickCount() / 86400000);

    // 0: try, 1: pass, 2: fail count, 3: memory step, 4: 마지막 테스트 시간
    RT.score[type][mk][0] += 1;
    RT.score[type][mk][pass ? 1 : 2] += 1;
    RT.score[type][mk][3] = Math.max(0, Math.min(4, RT.score[type][mk][3] + (pass ? 1 : -1)) );
    RT.score[type][mk][4] = today;

    /// console.log('(' + chapId + ' / ' + dialogIdx + ') --> ' + (e2k ? 'e2k' : 'k2e') + ': ' + (pass ? 'passed' : 'failed') );
  },

  getReviewList: function(e2k) {
    app.waitDialog(true);

    var reviewList = [];  // [{chapter:index, dialog:index}, ]
    var s = RT.score[e2k ? 'e2k' : 'k2e'];
    var today = Math.floor(tickCount() / 86400000);

    try {
      for(var mk in s) {
        // do not have to add the problem that is not tested.
        if( s[mk][0] <= 0 ) { continue; }

        var dayDiff = today - nvl(s[mk][4], today);

        if( s[mk][3] <= 0
          || (s[mk][3] == 1 && dayDiff >= 1)
          || (s[mk][3] == 2 && dayDiff >= 3)
          || (s[mk][3] == 3 && dayDiff >= 10)
          || (s[mk][3] == 3 && Math.random() >= 0.9) )
        {
          var id = RT._sepKey(mk);  // [chapID, dialogIdx]
          reviewList.push([RT.chapId2Idx[id[0]], id[1]]);
        }
      }

      shuffle(reviewList);
    } finally {
      app.waitDialog(false);
    }

    return reviewList;
  },
};
