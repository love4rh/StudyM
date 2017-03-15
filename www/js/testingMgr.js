/**
 * Testing page
 */
var testingMgr = {
  board: undefined,
  options: undefined,
  testList: undefined,
  posTest: -1,
  timer: undefined,
  remainTime: 15,
  divButton: undefined,
  holding: false,
  e2k: false,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'testingMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('test'), 'mainButton':'back'};
  },

  isHistoric: function() { return false; },

  // option: 'language':'english', 'selected': [index, ]
  onActivated: function(prevMgr, options) {
    if( !options ) {
      console.log('option not set.');
      return;
    }

    this.options = options;
    this.e2k = options['language'] == 'english';

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

    this.holding = false;
    this.board.empty();

    $('<div></div>').addClass('w3-center x-text-orange x-test-timer').appendTo(this.board);
    $('<div></div>').addClass('x-test-content').text('').appendTo(this.board);

    this.divButton = [
      uitool.genMenu([
        { 'title':'I see', 'colorClass':'w3-teal', 'handler':testingMgr.pass },
        { 'title':'Show Answer', 'colorClass':'w3-red', 'handler':testingMgr.fail }
      ], true).addClass('x-test-go').appendTo(this.board),
      uitool.genMenu([
        { 'title':'Next', 'colorClass':'w3-blue', 'handler':testingMgr.goNext },
      ]).addClass('x-test-go').appendTo(this.board),
    ];

    this.divButton[1].hide();

    this.posTest = -1;
    this.goNext(true);
  },

  isPossibleToGoBack: function() {
    var $this = testingMgr;

    $this.holding = true;

    if( $this.posTest < $this.testList.length ) {
      if( confirm(R.text('exitTest')) ) {
        return true;
      } else {
        $this.holding = false;
        return false;
      }
    }

    return true;
  },

  onDeactivated: function(activePage) {
    this.clearTest();
  },

  adjustLayout: function(w, h) {
    const buttonHeight = 70;
    var $this = testingMgr;

    if( !w ) { w = $(window).width(); }
    if( !h ) { h = $(window).height(); }

    place($this.board.find('.x-test-content'), undefined, undefined,
      w - 24, h - app.getHeaderHeight() - app.getAdHeight() - buttonHeight - 60);
    place($this.board.find('.x-test-gonext'), undefined, undefined, w, buttonHeight);
  },

  clearTest: function() {
    RT.save();
    
    var $this = testingMgr;

    if( $this.timer ) {
      clearInterval($this.timer);
      $this.timer = undefined;
    }
  },

  showAnswer: function() {
    var $this = testingMgr;

    $this.board.find('.x-test-answer').show();

    $this.divButton[0].hide();
    $this.divButton[1].show();

    $this.clearTest();
  },

  pass: function(event) {
    var $this = testingMgr;
    if( $this.posTest >= $this.testList.length ) { return; }

    var idx = $this.testList[$this.posTest];
    RT.putTestResult(idx['chapter'], idx['dialog'], $this.e2k, true);

    $this.goNext();
  },

  fail: function(event) {
    var $this = testingMgr;
    if( $this.posTest >= $this.testList.length ) { return; }

    var idx = $this.testList[$this.posTest];
    RT.putTestResult(idx['chapter'], idx['dialog'], $this.e2k, false);

    $this.showAnswer();
  },

  goNext: function() {
    var $this = testingMgr;
    var curPos = $this.posTest;

    $this.posTest += 1;
    if( $this.posTest == $this.testList.length ) {
      $this.clearTest();

      $this.divButton[0].hide();
      $this.divButton[1].show();
      $this.divButton[1].find('button').text(R.text('back'));

      showToast(R.text('endTest'));
      return;
    } else if( $this.posTest > $this.testList.length ) {
      app.goBack();
      return;
    }

    $this.divButton[0].show();
    $this.divButton[1].hide();

    //
    if( $this.timer ) {
      clearInterval($this.timer);
      $this.timer = undefined;
    }

    $this.remainTime = 15;
    $this.board.find('.x-test-timer').html( R.text('remainTime') + ': ' + $this.remainTime + R.text('sec') );

    $this.timer = setInterval(function() {
      if( $this.holding ) { return; }

      $this.remainTime -= 1;
      $this.board.find('.x-test-timer').html( R.text('remainTime') + ': ' + $this.remainTime + R.text('sec') );

      if( $this.remainTime == 0 ) {
        $this.fail();
      }
    }, 1000);

    var idx = $this.testList[$this.posTest];
    var d = RT.getDialog(idx['chapter'], idx['dialog']);

    $this.board.find('.x-test-content').html(
      convertTagToNormal($this.e2k ? d['english'] : d['korean'])
      + '<div class="x-test-answer" style="display:none;">'
      + convertTagToNormal($this.e2k ? d['korean'] : d['english'])
      + '</div>');
  }
};
