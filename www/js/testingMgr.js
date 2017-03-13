/**
 * Testing page
 */
var testingMgr = {
  board: undefined,
  options: undefined,
  testList: undefined,
  posTest: -1,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'testingMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('test'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  // option: 'language':'english', 'selected': [index, ]
  onActivated: function(prevMgr, options) {
    this.options = options;

    // shuffling dialogs
    var selList = options['selected'];

    this.testList = [];
    for(var i = 0; i < selList.length; ++i) {
      var sd = RT.sizeOfDialog(selList[i]);
      for(var j = 0; j < sd; ++j) {
        this.testList.push({'chapter':selList[i], 'dialog':j});
      }
    }
    shuffle(this.testList);

    this.board.empty();

    $('<div></div>').addClass('x-test-timer').html(R.text('remainTime') + ': ').appendTo(this.board);
    $('<div></div>').addClass('x-test-content').text('').appendTo(this.board);

    uitool.genMenu([
      { 'title':'I see', 'colorClass':'w3-teal', 'handler':function() { testingMgr.goNext(true); } }
    ], true).addClass('x-test-gonext').appendTo(this.board);

    this.posTest = -1;
    this.goNext(true);
  },

  isPossibleToGoBack: function() {
    // TODO 테스트를 중지하시겠습니까?
    return true;
  },

  onDeactivated: function(activePage) {
    //
  },

  adjustLayout: function(w, h) {
    const buttonHeight = 60;
    var $this = testingMgr;

    if( !w ) { w = $(window).width(); }
    if( !h ) { h = $(window).height(); }

    place($this.board.find('.x-test-content'), undefined, undefined, w - 24, h - app.getHeaderHeight() - app.getAdHeight() - buttonHeight - 100);
    place($this.board.find('.x-test-gonext'), undefined, undefined, w, buttonHeight);
  },

  onClickItem: function(event) {
    //
  },

  goNext: function(gotit) {
    var $this = testingMgr;
    var curPos = $this.posTest;

    if( $this.posTest >= $this.testList.length ) {
      return;
    }

    if( curPos >= 0 ) {
      // TODO gotit에 따른 기록 남기기
    }

    $this.posTest += 1;
    if( $this.posTest >= $this.testList.length ) {
      // TODO 끝
      alert('테스트 끝');
    }

    var idx = this.testList[this.posTest];
    var d = RT.getDialog(idx['chapter'], idx['dialog']);

    $this.board.find('.x-test-content').text($this.options['language'] == 'english' ? d['english'] : d['korean']);
  }
};
