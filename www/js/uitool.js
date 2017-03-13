/**
 * ui generator for common using component
 */
var uitool = {

  /**
   * icon, title, handler, colorClass,
   */
  genMenu: function(menuList, nowrap) {
    var d = $('<div></div>').addClass('w3-container w3-center');

    var w = 100, mx = 'auto';
    if( nowrap ) {
      w = (100 - (menuList.length - 1) * 20) / menuList.length;
      mx = '5px';
    }

    for(var i = 0; i < menuList.length; ++i) {
      var m = menuList[i];

      $('<button></button>')
        .addClass('w3-btn w3-round-xlarge w3-large w3-padding-medium ' + nvl(m['colorClass'], '') )
        .css({'width':w + '%', 'margin':'12px ' + mx })
        .html((isValid(m['icon']) ? '<i class="fa ' + m['icon'] + '"></i> ' : '') + m['title'])
        .on('click', m['handler'])
        .appendTo(d)
        ;
    }

    return d;
  }
}
