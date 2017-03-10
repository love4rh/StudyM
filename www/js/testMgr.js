/**
 * Page manager for TestPage
 */
var testMgr = {
  board: undefined,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'testMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('test'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    this.board.html('<p>TEST PAGE</p>');
  },

  onDeactivated: function(activePage) {
    //
  }
};
