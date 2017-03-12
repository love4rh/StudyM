/**
 * Application Main Class
 */
var app = {
  pages: {},
  appBoard: $('#appMain'),
  header: $('#appHeader'),
  pageBoard: $('#appBody'),
  mainMenuAsGoBack: false,
  currentPageMgr: undefined,
  pageViewStack: [],
  wannaExit: false,

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

    // set up Language Pack
    R.setLocale(navigator.language);

    // main menu icon
    app.header.find('li:nth-child(1)').off('click').on('click', app.clickMainMenu);

    // application title
    app.header.find('li:nth-child(2)').html('<span>' + R.text('appTitle') + '<span>');

    app.addPages( [pageMain, studyMgr, testMgr, reviewMgr, contentsMgr] );

    RT.load('data/sample.json', function(){ app.showPage(pageMain); });
  },

  // returns height of ad's
  getAdHeight: function() {
    return isRunningOnBrowser() ? 0 : 50;
  },

  getHeaderHeight: function() {
    return 50;
  },

  adjustLayout: function() {
    var appHeaderHeight = app.getHeaderHeight();

    var w = $(window).width();
    var h = $(window).height();

    // TODO iOS: consider status bar height. adjust header top padding, header height.

    place(app.appBoard, undefined, undefined, w, h);
    place(app.header, undefined, undefined, w, appHeaderHeight);
    place(app.pageBoard, undefined, undefined, w, h - appHeaderHeight - app.getAdHeight());
    // place(app.pageBoard.find('.x-main-view'), undefined, undefined, w, h - appHeaderHeight);

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
    setTimeout(function() { admob.showADBanner(); }, 20);
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

  showPage: function(pageMrg, options) {
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

    if( app.currentPageMgr && checkCall(app.currentPageMgr.isHistoric, true) ) {
      app.pageViewStack.push(app.currentPageMgr);
    }

    app.currentPageMgr = newMgr;
    app.adjustLayout();

    setTimeout(function() { admob.showADBanner(); }, 20);
  },

  switchHeader: function(pageMgr) {
    var hi = pageMgr.getHeaderInfo();

    if( hi['mainButton'] == 'back' ) {
      app.header.find('li:nth-child(1)').html('<a href="javascipt:void(0);"><i class="fa fa-arrow-left"></i></a>').off('click').on('click', app.clickMainMenu);
      app.mainMenuAsGoBack = true;
    } else {
      app.header.find('li:nth-child(1)').html('<img src="./img/logo.png" style="width:24px; height:24px; margin:13px 10px;">').off('click').on('click', app.clickMainMenu);
      app.mainMenuAsGoBack = false;
    }

    app.header.find('li:nth-child(2)').html('<span>' + hi['title'] + '<span>');
  },

  goBack: function() {
    if( app.pageViewStack.length < 1 ) { return false; }

    app.showPage(app.pageViewStack.pop());

    return true;
  }
};

app.begin();
