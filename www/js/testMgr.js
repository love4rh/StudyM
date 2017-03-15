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
        + '<div style="position:relative;">' + ctx['chapter'] + '</div></div>'
        ;
    }
    hs += '</div>';

    this.board.empty().css('overflow', 'hidden');
    this.board.append( $('<div></div>').addClass('x-main-dialog').html(hs).scrollTop(0) );

    this.board.find('.x-chapter').off('click').on('click', this.onClickItem);

    uitool.genMenu([
      { 'title':'E --> K', 'colorClass':'w3-red', 'handler':this.onGoTestE2K },
      { 'title':'K --> E', 'colorClass':'w3-teal', 'handler':this.onGoTestK2E }
    ], true).addClass('x-test-go').appendTo(this.board);

    this.displayed = true;
  },

  onDeactivated: function(activePage) {
    //
  },

  adjustLayout: function(w, h) {
    const buttonHeight = 70;
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

  onGoTestE2K: function(event) {
    var $this = testMgr;
    var selList = $this._getSelList();

    if( selList.length <= 0 ) {
      showToast(R.text('testSelect'));
      return;
    }

    app.showPage(testingMgr, {'language':'english', 'selected': selList});
  },

  onGoTestK2E: function(event) {
    var $this = testMgr;
    var selList = $this._getSelList();

    if( selList.length <= 0 ) {
      showToast(R.text('testSelect'));
      return;
    }

    app.showPage(testingMgr, {'language':'korean', 'selected': selList});
  }
};
