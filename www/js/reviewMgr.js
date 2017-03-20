/**
 * Page manager for ReivewPage
 */
var reviewMgr = {
  board: undefined,
  displayed: false,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'reviewMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('review'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    if( this.displayed ) { return; }

    // margin
    this.board.append( $('<div></div>').html('&nbsp;') );

    this.board.append(uitool.genMenu(
      [
        { 'title':R.text('e2k'), 'colorClass':'w3-teal', 'handler':function(){ reviewMgr.goTest(true); } },
        { 'title':R.text('k2e'), 'colorClass':'w3-khaki', 'handler':function(){ reviewMgr.goTest(false); } }
      ]
    ));

    this.displayed = true;
  },

  onDeactivated: function(activePage) {
    //
  },

  goTest: function(e2k) {
    var $this = reviewMgr;
    var testList = RT.getReviewList(e2k);

    if( testList.length <= 0 ) {
      showToast(R.text('notest'));
    } else {
      app.showPage(testingMgr,
        { 'mode':'review', 'language':(e2k ? 'english' : 'korean'),
          'testList': shuffle(testList) }
      );
    }
  }
};
