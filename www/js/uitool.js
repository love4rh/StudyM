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
  },

  /**
   * menuDiv: div element which appends menu item.
   * menuItem: menu information object like {'title':'기본 채널만 설정', 'handler':logpage.setupBasicChannel, 'desc':'지상파 및 종편 등 주요채널만 자동으로 설정합니다.' }
   * If menuItem is undefined, separator will be appended to menuDiv
   */
  appendSimpleMenu: function(menuDiv, menuItem) {
    if( menuItem == undefined ) {
      $('<hr></hr>').attr('style', 'margin: 10px 0 !important;').appendTo(menuDiv);
      return;
    }

    if( menuItem.desc ) {
      $('<div></div>')
        .append($('<a></a>').addClass('x-simple-menu-wdesc').attr('href', '#').text(menuItem.title) )
        .append($('<div></div>').addClass('x-simple-menudesc').text(menuItem.desc) )
        .on('click', menuItem.handler)
        .appendTo(menuDiv);
    } else {
      $('<div></div>')
        .append($('<a></a>').addClass('x-simple-menu').attr('href', '#').text(menuItem.title) )
        .on('click', menuItem.handler)
        .appendTo(menuDiv);
    }

    return menuDiv; // for chain-call
  }
}
