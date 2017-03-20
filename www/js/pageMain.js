

var pageMain = {
  board: undefined,
  displayed: false,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'pageMain'; },

  getHeaderInfo: function() {
    return {'title':R.text('appTitle'), 'mainButton':'normal', 'menu':{'gear':1}};
  },

  /** whether remains in page history or not */
  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    if( this.displayed ) { return; }

    // TODO 설명 이미지
    // this.board.append( $('<div></div>').html('&nbsp;') );

    // margin
    this.board.append( $('<div></div>').html('&nbsp;') );

    this.board.append(uitool.genMenu([
      {'title':R.text('study'), 'icon':'fa-edit', 'colorClass':'w3-teal', 'handler': function(){ app.showPage(studyMgr); } },
      {'title':R.text('test'), 'icon':'fa-check', 'colorClass':'w3-khaki', 'handler': function(){ app.showPage(testMgr); } },
      {'title':R.text('review'), 'icon':'fa-refresh', 'colorClass':'w3-orange', 'handler': function(){ app.showPage(reviewMgr); } }
    ]));

    this.displayed = true;
  },

  adjustLayout: function(w, h) {
    //
  },

  onDeactivated: function(activePage) {
    //
  },

  actionButton: function(buttonName) {
    if( 'gear' === buttonName ) {
      app.showPage(settingMgr);
    }
  }
};
