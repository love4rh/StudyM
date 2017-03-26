/**
 * Application option page
 */
var settingMgr = {
  board: undefined,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'settingMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('setting'), 'mainButton':'back'};
  },

  isHistoric: function() { return true; },

  onActivated: function(prevMgr, options) {
    // 컨텐츠 내려 받기: 인증 코드와 함께 받아야 함.

    var optDiv = $('<div></div>').addClass('w3-container');

    uitool.appendSimpleMenu(optDiv,
      {'title':R.text('download'), 'handler':this.downloadContent, 'desc':R.text('downDesc') }
    );

    $('<div></div>')
      .html('<input id="contentCode" class="w3-input" type="text" style="width:100%" placeholder="' + R.text('cCode') + '">')
      .appendTo(optDiv);

    uitool.appendSimpleMenu(optDiv, undefined); // separator

    this.board.empty().append(optDiv);
  },

  onDeactivated: function(activePage) {
    //
  },

  downloadContent: function(event) {
    var $this = settingMgr;
    var code = $this.board.find('#contentCode').val();

    if( !isValid2(code) ) {
      showToast(R.makeMissing('cCode'));
      return;
    }

    RT.load(code, function(){ showToast('갱신완료!'); } );
  }
};
