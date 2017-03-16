/**
 * Application option page
 */
var settingMgr = {
  board: undefined,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'settingMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('setting'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    // 컨텐츠 내려 받기: 인증 코드와 함께 받아야 함.
    //
    this.board.html('<p>SETTINGS PAGE</p>');
  },

  onDeactivated: function(activePage) {
    //
  }
};
