const cWidth1 = 60;
const cWidth2 = 30;

/**
 * Page manager for StudyPage
 */
var studyMgr = {
  board: undefined,
  displayed: false,
  scrollPos: 0,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'studyMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('study'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    if( this.displayed ) {
      this.board.scrollTop(this.scrollPos);
      return;
    }

    var hs = '<table class="x-theme-d3 x-list-table">';

    for(var i = 0; i < RT.sizeOfChapter(); ++i) {
      var ctx = RT.getContent(i);

      hs += '<tr data-idx="' + i + '">'
        + '<td class="x-text-white w3-large w3-center" style="width: ' + cWidth1 + 'px;">' + ctx['chapter'] + '</td>'
        + '<td class="x-text-yellow w3-large"><div class="x-list-fix-width">' + ctx['title'] + '</div></td>'
        + '</tr>'
        ;
    }
    hs += '</table>';

    this.board.html(hs).css('overflow', 'auto');
    this.board.find('.x-list-table tr').off('click').on('click', this.onClickItem);

    this.displayed = true;
  },

  onDeactivated: function(activePage) {
    this.scrollPos = this.board.scrollTop();
  },

  adjustLayout: function(w, h) {
    var $this = studyMgr;

    if( !w ) { w = $(window).width(); }
    if( !h ) { h = $(window).height(); }

    place($this.board.find('.x-list-table'), undefined, undefined, w, undefined);
    place($this.board.find('x-list-fix-width'), undefined, undefined, w - cWidth1 - 10, undefined);
  },

  onClickItem: function(event) {
    var $this = $(event.currentTarget);
    var idx = $this.attr('data-idx');

    app.showPage(contentsMgr, {'index':idx});
  }
};


/**
 * dialog detail view
 */
var contentsMgr = {
  board: undefined,
  title: undefined,
  langToggle: 3, // 1: English, 2: Korean, 3: Both
  mc: undefined,
  cIdx: undefined,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'contentsMgr'; },

  getHeaderInfo: function() {
    return {'title':this.title, 'mainButton':'back'};
  },

  isHistoric: function() { return false; },

  onActivated: function(prevMgr, options) {
    if( !options ) {
      console.log('option not defined.');
      this.title = 'undefined';
      return;
    }

    this.display(options['index']);
  },

  display: function(idx) {
    var ctx = RT.getContent(idx);
    var dialog = ctx['dialog'];

    this.title = ctx['title'];
    app.setTitle(this.title);
    this.cIdx = idx;

    var scoreOn = true; // TODO option
    var hs = '<table class="x-theme-d3 x-list-table">';

    for(var i = 0; i < dialog.length; ++i) {
      var p = dialog[i];

      hs += '<tr data-idx="' + i + '">'
         + '<td class="x-text-white w3-medium w3-center" style="width: ' + cWidth2 + 'px;">'
         + p['who'] + '</td>'
         + '<td class="w3-medium" style="min-height:50px;">'
         + '<div class="x-text-yellow x-english">' + p['english']
         + (scoreOn ? RT.getPassRateAsHtml(idx, i, true) : '')
         + '</div>'
         + '<div class="x-text-sky x-korean">' + p['korean']
         + (scoreOn ? RT.getPassRateAsHtml(idx, i, false) : '')
         + '</div>'
         + '</td>'
         + '</tr>'
         ;
    }
    hs += '</table>';

    this.board.empty().css('overflow', 'hidden');
    this.board.append( $('<div></div>').addClass('x-main-dialog').html(hs).scrollTop(0) );

    uitool.genMenu([ { 'title': this.getDisplayLang(), 'colorClass':'w3-teal', 'handler':this.onToggleLang } ])
      .addClass('x-lang-toggle').appendTo(this.board);

    this.toggleDisplay();

    if( !isValid(this.mc) ) {
      this.mc = new Hammer( document.getElementById(this.getPageID()) );
      this.mc.on('panstart panleft panright panend', this.onPan);
    }

    this.adjustLayout();
  },

  onDeactivated: function(activePage) {
    //
  },

  onPan: function(event) {
    if( event.type == 'panend' && Math.abs(event.deltaX) > 40 ) {
      var idx = parseInt(contentsMgr.cIdx);

      if( event.deltaX < 0 ) {
        idx = Math.min(idx + 1, RT.sizeOfChapter() - 1);
      } else {
        idx = Math.max(idx - 1, 0);
      }

      contentsMgr.display(idx);
    }
  },

  adjustLayout: function(w, h) {
    const buttonHeight = 70;
    var $this = contentsMgr;

    if( !w ) { w = $(window).width(); }
    if( !h ) { h = $(window).height(); }

    place($this.board.find('.x-main-dialog'), undefined, undefined, w, h - app.getHeaderHeight() - app.getAdHeight() - buttonHeight);
    place($this.board.find('.x-lang-toggle'), undefined, undefined, w, buttonHeight);
    place($this.board.find('.x-list-table'), undefined, undefined, w, undefined);
  },

  getDisplayLang: function() {
    const msg = ['None', 'English', 'Korean', 'English & Korean'];

    return msg[contentsMgr.langToggle];
  },

  toggleDisplay: function() {
    if( (contentsMgr.langToggle & 1) == 1 ) {
      this.board.find('.x-english').show();
    } else {
      this.board.find('.x-english').hide();
    }

    if( (contentsMgr.langToggle & 2) == 2 ) {
      this.board.find('.x-korean').show();
    } else {
      this.board.find('.x-korean').hide();
    }
  },

  onToggleLang: function(event) {
    var elem = $(event.currentTarget);
    var v = contentsMgr.langToggle;

    v += 1;
    if( v > 3 ) v = 0;

    contentsMgr.langToggle = v;
    elem.text( contentsMgr.getDisplayLang() );
    contentsMgr.toggleDisplay();
  }
};
