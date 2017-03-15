/**
 * Repository for studying material
 */
var RT = {
  data: undefined,
  chapList: undefined,
  dataID: undefined,
  score: undefined,

  load: function(dataPath, callback) {
    $.ajax({
      url: dataPath,
      success: function(data) {
        if( data instanceof Object ) {
          RT.data = data;
        } else {
          RT.data = JSON.parse(data);
        }
        RT.dataID = RT.data['header']['id'];
        RT.chapList = RT.data['contents'];

        var saved = localStorage.getItem('SM-' + RT.dataID);

        if( isValid2(saved) ) {
          RT.score = JSON.parse(saved);
        } else {
          RT.score = {};
        }

        for(var i = 0; i < RT.chapList.length; ++i) {
          var chapId = RT.chapList[i]['chapter'];

          if( !isValid2(RT.score[chapId]) ) {
            RT.score[chapId] = {};
          }

          var d = RT.chapList[i]['dialog'];
          for(var j = 0; j < d.length; ++j) {
            if( isValid2(RT.score[chapId][j]) ) { continue; }

            RT.score[chapId][j] = { 'e2k':{'try':0, 'pass':0, 'fail':0}, 'k2e':{'try':0, 'pass':0, 'fail':0} };
          }
        }

        if( isValid(callback) ) { callback(data); }
      },
      error: function() {
        console.log('error');
      }
    });
  },

  getDataID: function() {
    return RT.data['header']['id']
  },

  sizeOfChapter: function() {
    return isValid2(RT.chapList) ? RT.chapList.length : 0;
  },

  getContent: function(idx) {
    return RT.chapList[idx];
  },

  sizeOfDialog: function(idx) {
    return RT.chapList[idx]['dialog'].length;
  },

  save: function() {
    localStorage.setItem('SM-' + RT.dataID, JSON.stringify(RT.score) );
  },

  /**
   * who:'', english:'', korean:''
   */
  getDialog: function(chapIdx, dialogIdx) {
    return RT.chapList[chapIdx]['dialog'][dialogIdx];
  },

  // returns undefined: haven't been tested yet, the rate of passing the test at range [0, 1]
  getPassRate: function(chapIdx, dialogIdx, e2k) {
    var chapId = RT.chapList[chapIdx]['chapter'];
    var type = (e2k ? 'e2k' : 'k2e');
    var score = undefined;

    if( isValid3(RT.score[chapId][dialogIdx][type]['try']) ) {
      score = RT.score[chapId][dialogIdx][type]['pass'] / RT.score[chapId][dialogIdx][type]['try'];
    }

    return score;
  },

  getPassRateAsHtml: function(chapIdx, dialogIdx, e2k) {
    var rate = RT.getPassRate(chapIdx, dialogIdx, e2k);

    return isValid(rate) ? '<span class="x-rate"> [' + Math.floor(rate * 100) + '%]</span>' : '';
  },

  putTestResult: function(chapIdx, dialogIdx, e2k, pass) {
    var chapId = RT.chapList[chapIdx]['chapter'];
    var type = (e2k ? 'e2k' : 'k2e');

    RT.score[chapId][dialogIdx][type]['try'] += 1;
    RT.score[chapId][dialogIdx][type][pass ? 'pass' : 'fail'] += 1;

    console.log('(' + chapId + ' / ' + dialogIdx + ') --> '
      + (e2k ? 'e2k' : 'k2e') + ': ' + (pass ? 'passed' : 'failed') );
  },
};
