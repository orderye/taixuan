/**
 * 太玄经卜卦引擎 — 微信小程序版
 *
 * 基于《太玄经》扬雄原著、司马光《集注太玄经》及黄宗羲《易学象数论·太玄蓍法》
 */

// 81首名称
const SHOU_NAMES = [
  '中','周','礥','闲','少','戾','上','干','狩',
  '羡','差','童','增','锐','达','交','耎','徯',
  '从','进','释','格','夷','乐','争','务','事',
  '更','断','毅','装','众','密','亲','敛','强',
  '睟','盛','居','法','应','迎','遇','灶','大',
  '廓','文','礼','逃','唐','常','度','永','昆',
  '减','唫','守','翕','聚','积','饰','疑','视',
  '沈','内','去','晦','瞢','穷','割','止','坚',
  '成','致','失','剧','驯','将','难','勤','养',
];

// 9赞位置
const ZAN_POSITIONS = [
  { index: 1, name: '初一', category: '思', level: '下', subName: '思内' },
  { index: 2, name: '次二', category: '思', level: '中', subName: '思中' },
  { index: 3, name: '次三', category: '思', level: '上', subName: '思外' },
  { index: 4, name: '次四', category: '福', level: '下', subName: '福小' },
  { index: 5, name: '次五', category: '福', level: '中', subName: '福中' },
  { index: 6, name: '次六', category: '福', level: '上', subName: '福大' },
  { index: 7, name: '次七', category: '祸', level: '下', subName: '祸生' },
  { index: 8, name: '次八', category: '祸', level: '中', subName: '祸中' },
  { index: 9, name: '上九', category: '祸', level: '上', subName: '祸极' },
];

const ZAN_WUXING = {
  1: '水', 2: '火', 3: '木', 4: '金', 5: '土',
  6: '水', 7: '火', 8: '木', 9: '金',
};

const SAN_XUAN = ['天玄', '地玄', '人玄'];

const JIU_TIAN = [
  '中天', '羡天', '从天', '更天', '睟天',
  '廓天', '减天', '沈天', '成天',
];

// 三进制符号（一/二/三对应太玄的三种画）
const SANHUASHA = ['—', '--', '---'];

function shouIndex(fang, zhou, bu, jia) {
  return (fang - 1) * 27 + (zhou - 1) * 9 + (bu - 1) * 3 + jia;
}

function shouPosition(index) {
  const i = index - 1;
  return {
    fang: Math.floor(i / 27) + 1,
    zhou: Math.floor((i % 27) / 9) + 1,
    bu: Math.floor((i % 9) / 3) + 1,
    jia: (i % 3) + 1,
  };
}

function shouYinYang(index) {
  return index % 2 === 1 ? '阳' : '阴';
}

function getShouInfo(index) {
  const pos = shouPosition(index);
  return {
    index,
    name: SHOU_NAMES[index - 1],
    fang: pos.fang,
    zhou: pos.zhou,
    bu: pos.bu,
    jia: pos.jia,
    xuan: SAN_XUAN[pos.fang - 1],
    yinYang: shouYinYang(index),
    position: pos.fang + '-' + pos.zhou + '-' + pos.bu + '-' + pos.jia,
  };
}

function zanGlobalIndex(shouIdx, zanPos) {
  return (shouIdx - 1) * 9 + zanPos;
}

function zanDayNight(shouIdx, zanPos) {
  const yinYang = shouYinYang(shouIdx);
  const isOdd = zanPos % 2 === 1;
  if (yinYang === '阳') {
    return isOdd ? '昼' : '夜';
  } else {
    return isOdd ? '夜' : '昼';
  }
}

function zanXiuJiu(shouIdx, zanPos) {
  return zanDayNight(shouIdx, zanPos) === '昼' ? '休' : '咎';
}

// 揲蓍法 — 单次
function singleYang(rng) {
  const rand = rng || Math.random;
  let sticks = 33;
  sticks -= 1;

  const left1 = Math.floor(rand() * (sticks - 1)) + 1;
  const right1 = sticks - left1;
  const rem1L = left1 % 3 === 0 ? 3 : left1 % 3;
  const rem1R = right1 % 3 === 0 ? 3 : right1 % 3;
  const firstRemainder = rem1L + rem1R;
  sticks -= firstRemainder;

  const left2 = Math.floor(rand() * (sticks - 1)) + 1;
  const right2 = sticks - left2;
  const rem2L = left2 % 3 === 0 ? 3 : left2 % 3;
  const rem2R = right2 % 3 === 0 ? 3 : right2 % 3;
  const secondRemainder = rem2L + rem2R;
  sticks -= secondRemainder;

  const result = sticks / 3;
  if (result === 7) return 1;
  if (result === 8) return 2;
  if (result === 9) return 3;
  return Math.floor(rand() * 3) + 1;
}

function divineBySticks(rng) {
  const rand = rng || Math.random;
  const fang = singleYang(rand);
  const zhou = singleYang(rand);
  const bu = singleYang(rand);
  const jia = singleYang(rand);
  const shouIdx = shouIndex(fang, zhou, bu, jia);
  const zanHigh = singleYang(rand);
  const zanLow = singleYang(rand);
  const zanPos = (zanHigh - 1) * 3 + zanLow;

  return buildResult(shouIdx, zanPos, {
    method: 'sticks',
    rounds: [
      { round: 1, role: '方', value: fang },
      { round: 2, role: '州', value: zhou },
      { round: 3, role: '部', value: bu },
      { round: 4, role: '家', value: jia },
      { round: 5, role: '赞高', value: zanHigh },
      { round: 6, role: '赞低', value: zanLow },
    ],
  });
}

// 硬币法
function singleCoinToss(rng) {
  const rand = rng || Math.random;
  const coins = [rand() < 0.5, rand() < 0.5, rand() < 0.5];
  const yangCount = coins.filter(c => c).length;
  let value;
  if (yangCount <= 1) value = 1;
  else if (yangCount === 2) value = 2;
  else value = 3;
  return { value, coins, yangCount };
}

function divineByCoins(rng) {
  const rand = rng || Math.random;
  const r1 = singleCoinToss(rand);
  const r2 = singleCoinToss(rand);
  const r3 = singleCoinToss(rand);
  const r4 = singleCoinToss(rand);
  const r5 = singleCoinToss(rand);
  const r6 = singleCoinToss(rand);
  const shouIdx = shouIndex(r1.value, r2.value, r3.value, r4.value);
  const zanPos = (r5.value - 1) * 3 + r6.value;

  return buildResult(shouIdx, zanPos, {
    method: 'coins',
    rounds: [
      { round: 1, role: '方', value: r1.value, coins: r1.coins, yangCount: r1.yangCount },
      { round: 2, role: '州', value: r2.value, coins: r2.coins, yangCount: r2.yangCount },
      { round: 3, role: '部', value: r3.value, coins: r3.coins, yangCount: r3.yangCount },
      { round: 4, role: '家', value: r4.value, coins: r4.coins, yangCount: r4.yangCount },
      { round: 5, role: '赞高', value: r5.value, coins: r5.coins, yangCount: r5.yangCount },
      { round: 6, role: '赞低', value: r6.value, coins: r6.coins, yangCount: r6.yangCount },
    ],
  });
}

// 构建4画符号（方州部家各一画）
function buildShouSymbol(fang, zhou, bu, jia) {
  const line = (v) => {
    if (v === 1) return '━━━━━';
    if (v === 2) return '━━ ━━';
    return '━━━ ━━━';
  };
  return [line(jia), line(bu), line(zhou), line(fang)];
}

function getBiao(zanPos) {
  if ([1, 5, 7].includes(zanPos)) return { type: '经', members: [1, 5, 7] };
  if ([3, 4, 8].includes(zanPos)) return { type: '纬', members: [3, 4, 8] };
  if ([2, 6, 9].includes(zanPos)) return { type: '杂', members: [2, 6, 9] };
  return { type: '未知', members: [] };
}

function getTimeFactor() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

function buildResult(shouIdx, zanPos, meta) {
  const shou = getShouInfo(shouIdx);
  const zanInfo = ZAN_POSITIONS[zanPos - 1];
  const zanGlobal = zanGlobalIndex(shouIdx, zanPos);
  const dayNight = zanDayNight(shouIdx, zanPos);
  const xiuJiu = zanXiuJiu(shouIdx, zanPos);
  const wuxing = ZAN_WUXING[zanPos];
  const biao = getBiao(zanPos);
  const symbol = buildShouSymbol(shou.fang, shou.zhou, shou.bu, shou.jia);

  return {
    shou: {
      index: shouIdx,
      name: shou.name,
      fang: shou.fang,
      zhou: shou.zhou,
      bu: shou.bu,
      jia: shou.jia,
      xuan: shou.xuan,
      yinYang: shou.yinYang,
      position: shou.position,
      symbol: symbol,
    },
    zan: {
      position: zanPos,
      name: zanInfo.name,
      subName: zanInfo.subName,
      category: zanInfo.category,
      level: zanInfo.level,
      globalIndex: zanGlobal,
      wuxing: wuxing,
      dayNight: dayNight,
      xiuJiu: xiuJiu,
    },
    biao: biao,
    fourFactors: {
      star: wuxing,
      time: getTimeFactor(),
      number: dayNight,
      ci: zanInfo.name,
    },
    meta: meta,
  };
}

function judgeFortune(result) {
  const { shou, zan } = result;
  const states = [];
  for (let i = 1; i <= 9; i++) {
    states.push(zanDayNight(shou.index, i) === '昼' ? '从' : '违');
  }
  const jing = [1, 5, 7].map(i => states[i - 1]);
  const wei = [3, 4, 8].map(i => states[i - 1]);
  const za = [2, 6, 9].map(i => states[i - 1]);

  const biaoType = result.biao.type;
  let activeGroup;
  if (biaoType === '经') activeGroup = jing;
  else if (biaoType === '纬') activeGroup = wei;
  else activeGroup = za;

  const [a, b, c] = activeGroup;
  const pattern = (a === '从' ? '一从' : '一违') + (b === '从' ? '二从' : '二违') + (c === '从' ? '三从' : '三违');

  const fortuneMap = {
    '一从二从三从': { level: '大休', desc: '三皆从，大吉之象', tag: 'tag-jade' },
    '一从二从三违': { level: '始中休终咎', desc: '先吉后凶，宜早行', tag: 'tag-gold' },
    '一从二违三违': { level: '始休中终咎', desc: '初吉后凶，中末宜慎', tag: 'tag-gold' },
    '一从二违三从': { level: '始休中咎终休', desc: '吉中带凶，中间宜守', tag: 'tag-gold' },
    '一违二从三从': { level: '始咎中终休', desc: '先凶后吉，宜待时', tag: 'tag-gold' },
    '一违二从三违': { level: '始咎中休终咎', desc: '凶中藏吉，中段可进', tag: 'tag-gold' },
    '一违二违三从': { level: '始中咎终休', desc: '先凶后吉，终得安', tag: 'tag-gold' },
    '一违二违三违': { level: '大咎', desc: '三皆违，大凶之象', tag: 'tag-vermilion' },
  };

  const fortune = fortuneMap[pattern] || { level: '未知', desc: '', tag: 'tag-gold' };

  return {
    pattern: pattern,
    currentZanXiuJiu: zan.xiuJiu,
    level: fortune.level,
    desc: fortune.desc,
    tag: fortune.tag,
    tableStates: { '经': jing, '纬': wei, '杂': za },
  };
}

function seededRNG(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

window.TaixuanEngine = {
  SHOU_NAMES,
  ZAN_POSITIONS,
  ZAN_WUXING,
  SAN_XUAN,
  JIU_TIAN,
  SANHUASHA,
  shouIndex,
  shouPosition,
  shouYinYang,
  getShouInfo,
  zanGlobalIndex,
  zanDayNight,
  zanXiuJiu,
  divineBySticks,
  divineByCoins,
  singleYang,
  singleCoinToss,
  buildResult,
  buildShouSymbol,
  getBiao,
  getTimeFactor,
  judgeFortune,
  seededRNG,
  seedFromString,
};
