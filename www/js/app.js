/**
 * Application Main Class
 */
var app = {
  pages: {},
  adShown: true,
  appBoard: $('#appMain'),
  header: $('#appHeader'),
  pageBoard: $('#appBody'),
  adDiv: $('#appAd'),
  mainMenuAsGoBack: false,
  currentPageMgr: undefined,
  pageViewStack: [],
  wannaExit: false,
  waitDlgCallCnt: 0,
  waitDlgDiv: $('#waitOverlay'),

  begin: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('pause', this.onPause, false);
    document.addEventListener('resume', this.onResume, false);
    document.addEventListener('backbutton', this.onBackKeyDown, false);
    document.addEventListener('menubutton', this.onMenuKeyDown, false);
  },

  onDeviceReady: function() {
    console.log('device is ready to use on ' + device.platform + '. language: ' + navigator.language);

    app.initialize();
  },

  initialize: function() {
    runningOnBrowser = !isValid(device) || device.platform == 'browser';

    $(window).off('resize').on('resize', function(){ app.adjustLayout(); });

    $(document).ajaxStart(function(){ app.waitDialog(true); });
    $(document).ajaxComplete(function(){ app.waitDialog(false); });

    // set up Language Pack
    R.setLocale(navigator.language);

    // main menu icon
    app.header.find('li:nth-child(1)').off('click').on('click', app.clickMainMenu);

    // application title
    app.header.find('li:nth-child(2)').html('<span>' + R.text('appTitle') + '<span>');

    var mainMenu = ['gear', 'check-square-o'];
    var btnHandler = function(name) { return function() { app.actionButton(name); }; }
    for(var i = 0; i < mainMenu.length; ++i) {
      var name = mainMenu[i];
      app.header.append(
        $('<li></li>').addClass('x-menu w3-opennav w3-right w3-xlarge')
          .addClass('x-menu-' + name )
          .html('<i class="fa fa-' + name + '" style="padding:14px 10px 10px 10px;"></i>')
          .on('click', btnHandler(name))
        );
    }

    app.addPages( [pageMain, studyMgr, testMgr, reviewMgr, contentsMgr, testingMgr, settingMgr] );

    RT.initialize( function(){ app.showPage(pageMain); } );
  },

  // returns height of ad's
  getAdHeight: function() {
    return !app.adShown || isRunningOnBrowser() ? 0 : admob.getBannerHeight();
  },

  getHeaderHeight: function() {
    return 50;
  },

  adjustLayout: function() {
    var appHeaderHeight = app.getHeaderHeight();
    var adHeight = app.getAdHeight();

    var w = $(window).width();
    var h = $(window).height();

    // TODO iOS: consider status bar height. adjust header top padding, header height.

    place(app.appBoard, undefined, undefined, w, h);
    place(app.header, undefined, undefined, w, appHeaderHeight);
    place(app.pageBoard, undefined, undefined, w, h - appHeaderHeight - adHeight);
    place(app.pageBoard.find('.x-main-view'), undefined, undefined, w, h - appHeaderHeight - adHeight);

    place(app.adDiv, undefined, adHeight, w, adHeight);

    app.pageBoard.css({'position':'relative', 'top':appHeaderHeight + cUnit});

    for(var x in app.pages) {
      if( app.pages[x].adjustLayout ) {
        app.pages[x].adjustLayout(w, h);
      }
    }
  },

  onPause: function(event) {
    //
  },

  onResume: function(event) {
    app.adjustLayout();
  },

  onBackKeyDown: function(event) {
    if( app.wannaExit ) { navigator.app.exitApp(); }

    if( !app.goBack() ) {
      app.wannaExit = true;
      showToast(R.text('backExit'));
      setTimeout(function() { app.wannaExit = false; }, 2900);
    }
  },

  onMenuKeyDown: function(event) {
    //
  },

  clickMainMenu: function() {
    if( app.mainMenuAsGoBack ) {
      app.onBackKeyDown();
    } else {
      // TODO
    }
  },

  addPage: function(pageMgr) {
    if( app.pages[pageMgr.getPageID()] ) {
      throw 'already defined page.';
    }

    app.pages[pageMgr.getPageID()] = pageMgr;

    var board = $('<div></div>').addClass('x-main-view').attr('id', pageMgr.getPageID()).hide();
    app.pageBoard.append(board);
    pageMgr.initialize(board);
  },

  addPages: function(pages) {
    for(var i = 0; i < pages.length; ++i)
      app.addPage(pages[i]);
  },

  showPage: function(pageMrg, options, fromBack) {
    var pageID = pageMrg.getPageID();
    var newMgr = app.pages[pageID];

    if( newMgr == undefined ) {
      console.log('unregistered page manager: ' + pageID);
      return;
    }

    newMgr.onActivated(app.currentPageMgr, options);

    app.switchHeader(newMgr);

    if( app.currentPageMgr && app.currentPageMgr != newMgr ) {
      app.currentPageMgr.onDeactivated(newMgr);
    }

    app.pageBoard.find('.x-main-view').hide();
    app.pageBoard.find('#' + pageID).show();

    if( !fromBack && app.currentPageMgr && checkCall(app.currentPageMgr['isHistoric'], true) ) {
      app.pageViewStack.push(app.currentPageMgr);
    }

    if( app.adShown ) {
      setTimeout(function() { admob.showADBanner(); }, 20);
    }

    app.currentPageMgr = newMgr;
    app.adjustLayout();
  },

  switchHeader: function(pageMgr) {
    var hi = pageMgr.getHeaderInfo();

    if( hi['mainButton'] == 'back' ) {
      app.header.find('li:nth-child(1)').html('<a href="javascipt:void(0);"><i class="fa fa-arrow-left"></i></a>').off('click').on('click', app.clickMainMenu);
      app.mainMenuAsGoBack = true;
    } else {
      app.header.find('li:nth-child(1)').html('<img src="./img/logo.png" style="width:30px; height:30px; margin:11px 10px 0px 10px;">').off('click').on('click', app.clickMainMenu);
      app.mainMenuAsGoBack = false;
    }

    app.header.find('.x-menu').hide();

    if( isValid(hi['menu']) ) {
      for(var menuId in hi['menu']) {
        if( hi['menu'] ) {
          app.header.find('.x-menu-' + menuId).show();
        }
      }
    }

    app.setTitle(hi['title']);
  },

  setTitle: function(title) {
    app.header.find('li:nth-child(2)').html('<span>' + title + '</span>');
  },

  goBack: function() {
    if( app.currentPageMgr && !checkCall(app.currentPageMgr['isPossibleToGoBack'], true) ) {
      return true;
    }

    if( app.pageViewStack.length < 1 ) { return false; }
    app.showPage(app.pageViewStack.pop(), undefined, true);

    return true;
  },

  waitDialog: function(show, forced) {
    if( forced ) {
      app.waitDlgCallCnt = 0;
      app.waitDlgDiv.hide();
      return;
    }

    app.waitDlgCallCnt += (show ? 1 : -1);

    if( app.waitDlgCallCnt <= 0 ) {
      app.waitDlgCallCnt = 0;
      app.waitDlgDiv.hide();
    } else {
      app.waitDlgDiv.show();
    }
  },

  actionButton: function(buttonName) {
    if( app.currentPageMgr && app.currentPageMgr['actionButton'] ) {
      app.currentPageMgr['actionButton'](buttonName);
    }
  }
};

app.begin();
