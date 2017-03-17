// AjaxDelegator --> aj
var aj = {
  _lastXHR: undefined,
  _cancled: false,
  _procTime: 0,

  call: function(args) {
    if( args.success == undefined ) {
      throw new Error('missing parameter: success callback');
    }

    app.waitDialog(true);

    aj._procTime = new Date().getTime();

    if( !args.timeout || args.timeout <= 10000 ) {
      args.timeout = 10000;
    }

    aj._iternalCall(args);
  },

  _iternalCall: function(args) {
    var silent = isValid(args.silent) ? args.silent : false;

    if( args.complete != undefined ) {
      args.complete = function(compFunc) {
        return function(data) { compFunc(data); aj.onComplete(data); };
      }(args.complete);
    } else {
      args.complete = aj.onComplete;
    }

    if( !silent && args.error == undefined ) {
      args.error = aj.onError;
    }

    aj._lastXHR = $.ajax(args);
  },

  isWorkingOn: function() {
    return aj._lastXHR != undefined;
  },

  cancel: function() {
    if( aj._lastXHR == undefined ) { return; }

    aj._cancled = true;
    aj._lastXHR.abort();
  },

  onComplete: function(data) {
    console.log("aj processing time: " + (new Date().getTime() - aj._procTime));
    aj._lastXHR = undefined;
    aj._cancled = false;

    app.waitDialog(false);
  },

  onError: function(xhr, status, error) {
    if( aj._cancled ) {
      showToast('작업이 취소되었습니다.')
    } else if( error != undefined ) {
      showToast('요청된 작업을 수행할 수 없습니다.')
    }
  }
};
