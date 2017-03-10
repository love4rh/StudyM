/**
 * Page manager for ReivewPage
 */
var reviewMgr = {
  board: undefined,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'reviewMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('review'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    this.board.html('<p>REVIEW PAGE</p>');
  },

  onDeactivated: function(activePage) {
    //
  }
};
