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
  mode: undefined,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'testingMgr'; },

  getTitle: function() {
    return R.text(this.mode) + ' (' + (this.posTest + 1) + '/' + this.testList.length + ')';
  },

  getHeaderInfo: function() {
    return {'title':this.getTitle(), 'mainButton':'back'};
  },

  isHistoric: function() { return false; },

  // option --> mode: test|review, language:english|korean,
  //    testList: [ [chapter index, dialog index], ]
  onActivated: function(prevMgr, options) {
    if( !options ) {
      console.log('option not set.');
      return;
    }

    this.options = options;
    this.mode = options['mode'];
    this.e2k = options['language'] == 'english';

    this.testList = options['testList'];

    this.holding = false;
    this.board.empty();

    $('<div></div>').addClass('w3-center x-text-orange x-test-timer').appendTo(this.board);
    $('<div></div>').addClass('x-test-content').text('').appendTo(this.board);

    this.divButton = [
      uitool.genMenu([
        { 'title':R.text('ISee'), 'colorClass':'w3-teal', 'handler':function(){ testingMgr.showAnswer(true); } },
        { 'title':R.text('ShowAnswer'), 'colorClass':'w3-red', 'handler':testingMgr.fail }
      ], true).addClass('x-test-go').appendTo(this.board),
      uitool.genMenu([
        { 'title':R.text('Next'), 'colorClass':'w3-blue', 'handler':testingMgr.goNext },
      ]).addClass('x-test-go').appendTo(this.board),
      uitool.genMenu([
        { 'title':R.text('Igot'), 'colorClass':'w3-teal', 'handler':testingMgr.pass },
        { 'title':R.text('Imiss'), 'colorClass':'w3-red', 'handler':function() { testingMgr.fail(); testingMgr.goNext(); } }
      ], true).addClass('x-test-go').appendTo(this.board)
    ];

    this.showButtons(1);

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
    var buttonHeight = 70;
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

  showAnswer: function(pass) {
    var $this = testingMgr;

    $this.board.find('.x-test-answer').show();
    $this.showButtons(pass ? 2 : 1);

    $this.clearTest();
  },

  showButtons: function(buttonType) {
    var $this = testingMgr;

    $this.divButton[0].hide();
    $this.divButton[1].hide();
    $this.divButton[2].hide();

    $this.divButton[buttonType].show();
  },

  pass: function(event) {
    var $this = testingMgr;
    if( $this.posTest >= $this.testList.length ) { return; }

    var idx = $this.testList[$this.posTest];
    RT.putTestResult(idx[0], idx[1], $this.e2k, true);

    $this.goNext();
  },

  fail: function(event) {
    var $this = testingMgr;
    if( $this.posTest >= $this.testList.length ) { return; }

    var idx = $this.testList[$this.posTest];
    RT.putTestResult(idx[0], idx[1], $this.e2k, false);

    $this.showAnswer(false);
  },

  goNext: function() {
    var $this = testingMgr;
    var curPos = $this.posTest;

    $this.posTest += 1;
    if( $this.posTest == $this.testList.length ) {
      $this.clearTest();

      $this.showButtons(1);
      $this.divButton[1].find('button').text(R.text('back'));

      showToast(R.text('endTest'));
      return;
    } else if( $this.posTest > $this.testList.length ) {
      app.goBack();
      return;
    }

    app.setTitle($this.getTitle());

    $this.showButtons(0);

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
    var d = RT.getDialog(idx[0], idx[1]);

    $this.board.find('.x-test-content').html(
      convertTagToNormal($this.e2k ? d['english'] : d['korean'])
      + '<div class="x-test-answer" style="display:none;">'
      + convertTagToNormal($this.e2k ? d['korean'] : d['english'])
      + '</div>');
  }
};
