/**
 * Page manager for TestPage
 */
var testMgr = {
  cWidth: 60,
  markSelected: 'x-test-selected',
  board: undefined,
  displayed: false,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'testMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('test'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    if( this.displayed ) { return; }

    var hs = '<div class="w3-row">';

    for(var i = 0; i < RT.sizeOfChapter(); ++i) {
      var ctx = RT.getContent(i);

      hs += '<div class="w3-col s3 m3 l3 w3-center x-chapter" style="height:50px;" data-idx="' + i + '">'
        + '<div style="position:relative;">' + ctx.chapter + '</div></div>'
        ;
    }
    hs += '</div>';

    this.board.empty().css('overflow', 'hidden');
    this.board.append( $('<div></div>').addClass('x-main-dialog').html(hs).scrollTop(0) );

    this.board.find('.x-chapter').off('click').on('click', this.onClickItem);

    uitool.genMenu([
      { 'title':R.text('e2k'), 'colorClass':'w3-teal', 'handler':function(){ testMgr.goTest(true); } },
      { 'title':R.text('k2e'), 'colorClass':'w3-khaki', 'handler':function(){ testMgr.goTest(false); } }
    ], true).addClass('x-test-go').appendTo(this.board);

    this.displayed = true;
  },

  onDeactivated: function(activePage) {
    testMgr.board.find('.' + testMgr.markSelected)
      .removeClass(testMgr.markSelected).find('.x-checked').remove();
  },

  adjustLayout: function(w, h) {
    var buttonHeight = 70;
    var $this = testMgr;

    if( !w ) { w = $(window).width(); }
    if( !h ) { h = $(window).height(); }

    place($this.board.find('.x-main-dialog'), undefined, undefined, w, h - app.getHeaderHeight() - app.getAdHeight() - buttonHeight);
    place($this.board.find('.x-test-go'), undefined, undefined, w, buttonHeight);
  },

  onClickItem: function(event) {
    var $row = $(event.currentTarget);

    if( $row.hasClass(testMgr.markSelected) ) {
      $row.removeClass(testMgr.markSelected).find('.x-checked').remove();
    } else {
      $row.addClass(testMgr.markSelected)
        .find('div')
        .append(
          $('<div></div>').addClass("x-middle w3-xxlarge w3-text-yellow x-checked").html('<i class="fa fa-check"></i>')
        );
    }
  },

  _getSelList: function() {
    var r = [];
    var selList = testMgr.board.find('.' + testMgr.markSelected);

    for(var i = 0; i < selList.length; ++i) {
      r.push($(selList[i]).attr('data-idx'));
    }

    return r;
  },

  _shuffling: function(selList) {
    var testList = [];

    for(var i = 0; i < selList.length; ++i) {
      var sd = RT.sizeOfDialog(selList[i]);
      for(var j = 0; j < sd; ++j) {
        testList.push( [selList[i], j] );
      }
    }
    shuffle(testList);

    return testList;
  },

  goTest: function(e2k) {
    var $this = testMgr;
    var selList = $this._getSelList();

    if( selList.length <= 0 ) {
      showToast(R.text('testSelect'));
    } else {
      app.showPage(testingMgr,
        { 'mode':'test', 'language':(e2k ? 'english' : 'korean'), 'testList': $this._shuffling(selList) }
      );
    }
  }
};
