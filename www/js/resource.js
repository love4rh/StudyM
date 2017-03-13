/**
 * Repository for studying material
 */
var RT = {
  data: undefined,
  chapList: undefined,

  load: function(dataPath, callback) {
    $.ajax({
      url: dataPath,
      success: function(data) {
        if( data instanceof Object ) {
          RT.data = data;
        } else {
          RT.data = JSON.parse(data);
        }

        RT.chapList = RT.data['contents'];

        if( isValid(callback) ) { callback(data); }
      },
      error: function() {
        console.log('error');
      }
    });
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

  /**
   * who:'', english:'', korean:''
   */
  getDialog: function(chapIdx, dialogIdx) {
    return RT.chapList[chapIdx]['dialog'][dialogIdx];
  }
};
