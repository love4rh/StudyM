var R = {
  locale: 'ko',
  langPack: {},
  siteUrl: 'https://www.tool4.us',

  setLocale: function(locale) {
    if( isValid2(locale) ) {
      if( locale.length > 2 ) {
        locale = locale.slice(0, 2);
      }

      R.locale = locale;
    }

    if( 'ko' == locale ) {
      R.langPack = {
        'appTitle': '그냥 외우자!',
        'backExit': '\'뒤로\' 버튼을 한번 더 누르면 종료됩니다.',
        'study': '공부하기',
        'test': '테스트하기',
        'review': '복습하기',

        'hour': '시간',
        'min': '분',
        'sec': '초'
      };
    } else {
      R.langPack = {
        'appTitle': 'Just Keep It!',
        'backExit': 'Exit to press back button again.',
        'study': 'Study',
        'test': 'Test',
        'review': 'Review',

        'hour': 'hour(s)',
        'min': 'minute(s)',
        'sec': 'second(s)'
      };
    }
  },

  text: function(type) {
    return R.langPack[type];
  },

  makeText: function(type, options) {
    var genText = '';

    if( 'recvExplain' == type ) {
      switch(R.locale) {
        case 'ko':
          //
          break;

        default:
          //
          break;
      }
    }

    return genText;
  }
};
