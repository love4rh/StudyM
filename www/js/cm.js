const cUnit = 'px';
const footerHeight = 48;
const headerHeight = 46;

var runningOnBrowser = true;


function tickCount() {
  return new Date().getTime();
}

function isValid(obj) {
  return obj != undefined && obj != null;
}

function isValid2(val) {
  return val != '' && isValid(val);
}

function nvl(val, ifnull) {
  return isValid2(val) ? val : ifnull;
}

function checkCall(f, v) {
  return isValid(f) ? f(): v;
}

function place(obj, l, t, w, h) {
  if( obj == undefined ) { return; }

  var rect = {};

  if( isValid(l) ) rect.left = l + cUnit;
  if( isValid(t) ) rect.top = t + cUnit;
  if( isValid(w) ) rect.width = w + cUnit;
  if( isValid(h) ) rect.height = h + cUnit;

  obj.css(rect);
}

function convertTagToNormal(html) {
  return $('<p/>').text(html).text();
}

function isRunningOnBrowser() {
  return runningOnBrowser;
}

function showToast(msg) {
  if( isRunningOnBrowser() ) {
    // Get the snackbar DIV
    var sbar = $('#snackbar');
    sbar.html( convertTagToNormal(msg) );
    sbar.addClass('show');

    setTimeout(function(){ sbar.removeClass('show'); }, 2500);
  } else {
    // window.plugins.toast.showShortBottom(message);
    window.plugins.toast.showWithOptions({
      message: msg,
      duration: "3000",
      position: "bottom",
      addPixelsY: -140,
      styling: {
        opacity: 0.9, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
        backgroundColor: '#009688', // make sure you use #RRGGBB. Default #333333
        textColor: '#FFFFFF', // Ditto. Default #FFFFFF
        cornerRadius: 100, // minimum is 0 (square). iOS default 20, Android default 100
        horizontalPadding: 50, // iOS default 16, Android default 50
        verticalPadding: 30, // iOS default 12, Android default 30
        textSize: 15 // Default is approx. 13.
      }
    });
  }
}

var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

function isValidUrl(str) {
  return urlPattern.test(str);
}

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
