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
        'setting': '설정하기',
        'testSelect': '테스트할 Chapter를 선택하세요.',
        'remainTime': '남은 시간',
        'back': '돌아가기',
        'exitTest': '테스트를 중지하시겠습니까?',
        'endTest': '테스트가 모두 끝났습니다.',
        'ISee': '알겠어요',
        'ShowAnswer': '모르겠어요',
        'Igot': '맞았어요',
        'Imiss': '틀렸어요',
        'Next': '다음 문제',
        'e2k': '한글로 답하기',
        'k2e': '영어로 답하기',
        'cCode': '컨텐츠 코드',
        'download': '컨텐츠 내려 받기',
        'downDesc': '입력된 코드에 맞는 컨텐츠를 새로 받아 설정합니다.',
        'notest': '복습할 문제가 없습니다.',

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
        'setting': 'Settings',
        'testSelect': 'Select chapter(s) for your test',
        'remainTime': 'Remain Time',
        'back': 'Back to the list',
        'exitTest': 'Are you sure to exit test?',
        'endTest': 'All done to test.',
        'ISee': 'I see',
        'ShowAnswer': 'Show Answer',
        'Igot': 'I got it',
        'Imiss': 'I missed',
        'Next': 'Next',
        'e2k': 'to Korean',
        'k2e': 'to English',
        'cCode': 'Contents Code',
        'download': 'Download Contents',
        'downDesc': 'Download and set up the contents that match the contents code you enter.',
        'notest': 'There is no problems to be reviewed.',

        'hour': 'hour(s)',
        'min': 'minute(s)',
        'sec': 'second(s)'
      };
    }
  },

  text: function(type) {
    return R.langPack[type];
  },

  makeMissing: function(type) {
    var genText = '';
    var item = R.text('cCode');

    switch(R.locale) {
      case 'ko':
        genText = item + '를 입력하여야 합니다.';
        break;

      default:
        genText = 'Please, input ' + genText + '.';
        break;
    }

    return genText;
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
