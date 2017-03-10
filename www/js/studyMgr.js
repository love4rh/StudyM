const cWidth1 = 60;
const cWidth2 = 30;

/**
 * Page manager for StudyPage
 */
var studyMgr = {
  board: undefined,
  displayed: false,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'studyMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('study'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    if( this.displayed ) { return; }

    var hs = '<table class="x-theme-d3 x-list-table">';

    for(var i = 0; i < RT.sizeOfContents(); ++i) {
      var ctx = RT.getContent(i);

      hs += '<tr data-idx="' + i + '">'
        + '<td class="x-text-white w3-large w3-center" style="width: ' + cWidth1 + 'px;">' + ctx['chapter'] + '</td>'
        + '<td class="x-text-yellow w3-large"><div class="x-list-fix-width">' + ctx['title'] + '</div></td>'
        + '</tr>'
        ;
    }
    hs += '</table>';

    this.board.html(hs);
    this.board.find('.x-list-table tr').off('click').on('click', this.onClickItem);

    this.displayed = true;
  },

  onDeactivated: function(activePage) {
    //
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

    console.log(idx);

    app.showPage(contentsMgr, {'index':idx});
  }
};


/**
 * detail view
 */
 var contentsMgr = {
   board: undefined,
   title: undefined,

   initialize: function(board) {
     this.board = board;
   },

   getPageID: function() { return 'contentsMgr'; },

   getHeaderInfo: function() {
     return {'title':this.title, 'mainButton':'back'};
   },

   isHistoric: function() { return true; },

   onActivated: function(prevMgr, options) {
     if( !options ) {
       console.log('option not defined.');
       this.title = 'undefined';
       return;
     }

     var idx = options['index'];
     var ctx = RT.getContent(idx);
     var dialog = ctx['dialog'];

     this.title = ctx['title'];

     var hs = '<table class="x-theme-d3 x-list-table">';

     for(var i = 0; i < dialog.length; ++i) {
       var p = dialog[i];

       hs += '<tr data-idx="' + i + '">'
         + '<td class="x-text-white w3-medium w3-center" style="width: ' + cWidth2 + 'px;">'
         + p['who'] + '</td>'
         + '<td w3-medium">'
         + '<div class="x-text-yellow x-english">' + p['english'] + '</div>'
         + '<div class="x-text-sky x-korean">' + p['korean'] + '</div>'
         + '</td>'
         + '</tr>'
         ;
     }
     hs += '</table>';

     this.board.html(hs);
   },

   onDeactivated: function(activePage) {
     //
   },

   adjustLayout: function(w, h) {
     var $this = contentsMgr;

     if( !w ) { w = $(window).width(); }
     if( !h ) { h = $(window).height(); }

     place($this.board.find('.x-list-table'), undefined, undefined, w, undefined);
   }
 };
