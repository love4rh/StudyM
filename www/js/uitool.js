/**
 * ui generator for common using component
 */
var uitool = {

  /**
   * icon, title, handler, colorClass,
   */
  genMenu: function(menuList) {
    var d = $('<div></div>').addClass('w3-container w3-center');

    for(var i = 0; i < menuList.length; ++i) {
      var m = menuList[i];

      $('<button></button>')
        .addClass('w3-btn w3-round-xlarge w3-large w3-padding-medium ' + nvl(m['colorClass'], '') )
        .css({'width':'100%', 'margin':'12px auto'})
        .html((isValid(m['icon']) ? '<i class="fa ' + m['icon'] + '"></i> ' : '') + m['title'])
        .on('click', m['handler'])
        .appendTo(d)
        ;
    }

    return d;
  }
}
