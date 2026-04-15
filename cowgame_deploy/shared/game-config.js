(function (global) {
  var FISH_POOLS = {
    normal: [
      { icon: '🐟', name: '小鱼', xp: 3, msg: '钓到小鱼啦！🐟' },
      { icon: '🐠', name: '热带鱼', xp: 4, msg: '哇！热带鱼！好漂亮！' },
      { icon: '🐡', name: '河豚', xp: 5, msg: '河豚！不敢吃...' },
      { icon: '🦐', name: '大虾', xp: 3, msg: '鲜美的大虾！' },
      { icon: '🦑', name: '小鱿鱼', xp: 4, msg: '鱿鱼！拿去烤！' },
      { icon: '🥾', name: '破靴子', xp: 1, msg: '...钓到破靴子了' },
    ],
    cyber: [
      { spr: 'fish_cyber_fish', name: '电路鱼', xp: 5, msg: '哔——钓到电路鱼！' },
      { spr: 'fish_cyber_shrimp', name: '机械虾', xp: 4, msg: '机械虾，是赛博食材？' },
      { spr: 'fish_cyber_chip', name: '数据芯片', xp: 8, msg: '芯片！价值连城！' },
      { spr: 'fish_cyber_glitch', name: '故障代码块', xp: 1, msg: '咳...故障代码块没用的' },
    ],
    ocean: [
      { spr: 'fish_ocean_deepfish', name: '深海发光鱼', xp: 6, msg: '哇，深海发光鱼！' },
      { spr: 'fish_ocean_octopus', name: '小章鱼', xp: 5, msg: '章鱼！好可爱！' },
      { spr: 'fish_ocean_shell', name: '远古螺壳', xp: 4, msg: '远古螺壳，有年代感～' },
      { spr: 'fish_ocean_chest', name: '沉船宝箱', xp: 15, msg: '沉船宝箱！！发财了！' },
    ],
    space: [
      { spr: 'fish_space_alien', name: '外星鱼', xp: 7, msg: '外星鱼？！它会说话吗' },
      { spr: 'fish_space_rock', name: '陨石块', xp: 3, msg: '一块陨石...' },
      { spr: 'fish_space_jelly', name: '太空水母', xp: 5, msg: '飘浮的太空水母！' },
      { spr: 'fish_space_debris', name: '太空垃圾', xp: 1, msg: '太空垃圾...谁扔的' },
    ],
    ancient: [
      { spr: 'fish_ancient_1', name: '远古鱼', xp: 5, msg: '远古鱼，好像哪里见过...' },
      { spr: 'fish_ancient_2', name: '腔棘鱼', xp: 7, msg: '腔棘鱼！活化石！！' },
      { spr: 'fish_ancient_turtle', name: '史前乌龟', xp: 6, msg: '史前乌龟，慢悠悠的' },
      { spr: 'fish_ancient_bone', name: '化石骨头', xp: 2, msg: '化石骨头...古老的遗迹' },
    ],
  };

  var LEADERBOARD_CATEGORIES = {
    level: { unit: 'XP', hint: '按喂食总XP排名', desc: function (s) { return s.extra || ''; } },
    ach: { unit: '个', hint: '按解锁成就数排名', desc: function (s) { return s.extra || ''; } },
    fruit: { unit: '分', hint: '接水果小游戏最高分', desc: function (s) { return s.extra ? '宇宙：' + s.extra : ''; } },
    fish: { unit: '条', hint: '累计钓鱼总数', desc: function (s) { return s.extra ? '宇宙：' + s.extra : ''; } },
    farm_a: { unit: '分', hint: '🌾 丰收竞赛 — 30秒内耕地冲高分', desc: function (s) { return s.extra ? '宇宙：' + s.extra : ''; } },
    farm_b: { unit: '秒', hint: '⚡ 闪电耕作 — 耕完25块田最短时间', desc: function (s) { return s.extra ? '宇宙：' + s.extra : ''; }, asc: true },
  };

  function normalizeUniverseKey(key) {
    var universeConfig = global.COWGAME_UNIVERSE_CONFIG;
    return universeConfig ? universeConfig.normalizeUniverseKey(key) : (FISH_POOLS[key] ? key : 'normal');
  }

  function getFishPool(key) {
    return FISH_POOLS[normalizeUniverseKey(key)] || FISH_POOLS.normal;
  }

  global.COWGAME_GAME_CONFIG = {
    FISH_POOLS: FISH_POOLS,
    LEADERBOARD_CATEGORIES: LEADERBOARD_CATEGORIES,
    getFishPool: getFishPool,
  };
})(window);
