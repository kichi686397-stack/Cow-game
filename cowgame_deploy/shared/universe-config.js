(function (global) {
  var UNIVERSES = {
    normal: {
      key: 'normal',
      farmThemeKey: 'farm',
      themeClassName: '',
      cowImage: 'images/cow-farm.png',
      labels: { full: '普通农场', short: '普通' },
      copy: {
        farm: { start: '点地块，让小牛开始干活', win: '哞！耕完啦' },
        fish: { end: '今天收获不错，小牛准备回家' }
      }
    },
    cyber: {
      key: 'cyber',
      farmThemeKey: 'cyberpunk',
      themeClassName: 'theme-cyberpunk',
      cowImage: 'images/cow-cyber.png',
      labels: { full: '赛博朋克', short: '赛博' },
      copy: {
        farm: { start: '点击霓虹地块，启动耕作', win: '赛博农田全部点亮' }
      }
    },
    ocean: {
      key: 'ocean',
      farmThemeKey: 'underwater',
      themeClassName: 'theme-underwater',
      cowImage: 'images/cow-underwater.png',
      labels: { full: '深海水下', short: '水下' },
      copy: {
        farm: { start: '点开珊瑚田，小牛下潜', win: '海底农田已翻松' }
      }
    },
    space: {
      key: 'space',
      farmThemeKey: 'space',
      themeClassName: 'theme-space',
      cowImage: 'images/cow-space.png',
      labels: { full: '太空站', short: '太空' },
      copy: {
        farm: { start: '点击舱外地块，开始耕作', win: '太空农舱开垦完成' }
      }
    },
    ancient: {
      key: 'ancient',
      farmThemeKey: 'ancient',
      themeClassName: 'theme-ancient',
      cowImage: 'images/cow-ancient.png',
      labels: { full: '古代农村', short: '古代' },
      copy: {
        farm: { start: '点地块，让老黄牛下田', win: '古田已翻好' }
      }
    }
  };

  function normalizeUniverseKey(key) {
    return UNIVERSES[key] ? key : 'normal';
  }

  function getUniverse(key) {
    return UNIVERSES[normalizeUniverseKey(key)];
  }

  function toFarmThemeKey(key) {
    return getUniverse(key).farmThemeKey || 'farm';
  }

  global.COWGAME_UNIVERSE_CONFIG = {
    UNIVERSE_KEYS: Object.keys(UNIVERSES),
    UNIVERSES: UNIVERSES,
    normalizeUniverseKey: normalizeUniverseKey,
    getUniverse: getUniverse,
    toFarmThemeKey: toFarmThemeKey
  };
})(window);
