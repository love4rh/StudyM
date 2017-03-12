

var pageMain = {
  board: undefined,
  displayed: false,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'pageMain'; },

  getHeaderInfo: function() {
    return {'title':R.text('appTitle'), 'mainButton':'normal'};
  },

  /** whether remains in page history or not */
  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    if( this.displayed ) { return; }

    var menuList = [
      {'title':R.text('study'), 'icon':'fa-edit', 'colorClass':'w3-teal', 'handler': function(){ app.showPage(studyMgr); } },
      {'title':R.text('test'), 'icon':'fa-check', 'colorClass':'w3-khaki', 'handler': function(){ app.showPage(testMgr); } },
      {'title':R.text('review'), 'icon':'fa-refresh', 'colorClass':'w3-orange', 'handler': function(){ app.showPage(reviewMgr); } }
    ];

    // margin
    this.board.append( $('<div></div>').html('&nbsp;') );

    this.board.append(uitool.genMenu(menuList));
    this.displayed = true;
  },

  adjustLayout: function(w, h) {
    //
  },

  onDeactivated: function(activePage) {
    //
  }
};
