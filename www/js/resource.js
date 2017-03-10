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
        console.log(data);

        RT.data = data;
        RT.chapList = data['contents'];

        if( isValid(callback) ) { callback(data); }
      },
      error: function() {
        console.log('error');
      }
    });
  },

  sizeOfContents: function() {
    return isValid2(RT.chapList) ? RT.chapList.length : 0;
  },

  getContent: function(idx) {
    return RT.chapList[idx];
  }
};