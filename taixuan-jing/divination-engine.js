/**
 * 太玄经卜卦引擎 — 可程序化完整实现
 *
 * 基于《太玄经》扬雄原著、司马光《集注太玄经》及黄宗羲《易学象数论·太玄蓍法》
 *
 * 核心结构：
 *   81首 = 方(1-3) × 州(1-3) × 部(1-3) × 家(1-3) = 3^4
 *   每首9赞 = 初一 ~ 上九
 *   首序号 = (方-1)*27 + (州-1)*9 + (部-1)*3 + 家   (1-based)
 *   赞序号 = (首序号-1)*9 + 赞位                     (1-based, 全局1-729)
 *
 * 筮法分两阶段：
 *   阶段一：四揲定首（方州部家，各1-3）
 *   阶段二：两揲定赞（高位1-3 + 低位1-3 → 赞位1-9）
 *   合计六揲，即经文"六算而策道穷也"
 */

// ============================================================
// 第一部分：81首完整数据
// ============================================================

const SHOU_NAMES = [
  // 天玄（方1）州1-3
  '中','周','礥','闲','少','戾','上','干','狩',           // 1-9
  '羡','差','童','增','锐','达','交','耎','徯',           // 10-18
  '从','进','释','格','夷','乐','争','务','事',           // 19-27
  // 地玄（方2）州4-6
  '更','断','毅','装','众','密','亲','敛','强',           // 28-36
  '睟','盛','居','法','应','迎','遇','灶','大',           // 37-45
  '廓','文','礼','逃','唐','常','度','永','昆',           // 46-54
  // 人玄（方3）州7-9
  '减','唫','守','翕','聚','积','饰','疑','视',           // 55-63
  '沈','内','去','晦','瞢','穷','割','止','坚',           // 64-72
  '成','致','失','剧','驯','将','难','勤','养',           // 73-81
];

// 9赞位置定义
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

// 五行对应（赞位→五行）
const ZAN_WUXING = {
  1: '水', 2: '火', 3: '木', 4: '金', 5: '土',
  6: '水', 7: '火', 8: '木', 9: '金',
};

// 五行数字对应（太玄经体系：三八木，四九金，二七火，一六水，五五土）
const WUXING_NUMBERS = {
  '木': [3, 8],
  '金': [4, 9],
  '火': [2, 7],
  '水': [1, 6],
  '土': [5, 5],
};

// 三玄对应
const SAN_XUAN = ['天玄', '地玄', '人玄'];

// 九天名称
const JIU_TIAN = [
  '中天', '羡天', '从天', '更天', '睟天',
  '廓天', '减天', '沈天', '成天',
];

// ============================================================
// 第二部分：首序号与方位计算
// ============================================================

/**
 * 由方州部家四值计算首序号（1-81）
 * 公式来自《太玄数》"推玄算"：
 *   家一置一，二置二，三置三
 *   部一勿增，二增三，三增六
 *   州一勿增，二增九，三增十八
 *   方一勿增，二增二十七，三增五十四
 */
function shouIndex(fang, zhou, bu, jia) {
  return (fang - 1) * 27 + (zhou - 1) * 9 + (bu - 1) * 3 + jia;
}

/**
 * 由首序号反推方州部家四值
 */
function shouPosition(index) {
  const i = index - 1;
  return {
    fang: Math.floor(i / 27) + 1,
    zhou: Math.floor((i % 27) / 9) + 1,
    bu: Math.floor((i % 9) / 3) + 1,
    jia: (i % 3) + 1,
  };
}

/**
 * 判断首的阴阳（奇数为阳，偶数为阴）
 * 经文："一阳二阴，终九起一"
 */
function shouYinYang(index) {
  return index % 2 === 1 ? '阳' : '阴';
}

/**
 * 获取首的完整信息
 */
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
  };
}

// ============================================================
// 第三部分：赞序号与昼夜计算
// ============================================================

/**
 * 赞全局序号（1-729）
 * 公式来自《太玄数》"求表之赞"：
 *   置玄姓（首序号），去太始策数（减1），减而九之（×9），增赞
 */
function zanGlobalIndex(shouIdx, zanPos) {
  return (shouIdx - 1) * 9 + zanPos;
}

/**
 * 判断赞的昼夜
 * 阳首：赞1,3,5,7,9为昼，2,4,6,8为夜
 * 阴首：赞2,4,6,8为昼，1,3,5,7,9为夜
 * 经文："以昼夜别其休咎焉"
 */
function zanDayNight(shouIdx, zanPos) {
  const yinYang = shouYinYang(shouIdx);
  const isOdd = zanPos % 2 === 1;
  if (yinYang === '阳') {
    return isOdd ? '昼' : '夜';
  } else {
    return isOdd ? '夜' : '昼';
  }
}

/**
 * 逢昼为休（吉），逢夜为咎（凶）
 */
function zanXiuJiu(shouIdx, zanPos) {
  const dn = zanDayNight(shouIdx, zanPos);
  return dn === '昼' ? '休' : '咎';
}

// ============================================================
// 第四部分：揲蓍法（传统签策模拟）
// ============================================================

/**
 * 单次揲蓍——模拟33策的传统操作流程
 *
 * 步骤（据《太玄数》及黄宗羲《太玄蓍法》）：
 *   1. 别一：从33策中取1策挂于左手小指 → 余32
 *   2. 中分其余：将32策随机分为两组
 *   3. 以三搜之：两组各除以3，取余数（余数取1-3，其中3≡0）
 *   4. 并余于艻：收集余数（合计2或5）→ 初揲
 *   5. 再揲：剩余策再分两组，各除以3，收余数（合计3或6）
 *   6. 数其余：剩余策 ÷ 3 → 得7或8或9
 *   7. 映射：7→1, 8→2, 9→3
 *
 * 可能的路径：
 *   32→余2→30→余3→27→÷3=9→3
 *   32→余2→30→余6→24→÷3=8→2
 *   32→余5→27→余3→24→÷3=8→2
 *   32→余5→27→余6→21→÷3=7→1
 *
 * @returns {number} 1, 2, 或 3
 */
function singleYang(rng) {
  const rand = rng || Math.random;
  let sticks = 33;

  // 别一：挂1策
  sticks -= 1; // 32

  // === 初揲 ===
  // 中分其余：随机分成两组
  const left1 = Math.floor(rand() * (sticks - 1)) + 1;
  const right1 = sticks - left1;

  // 以三搜之：各除以3取余（余数0记为3）
  const rem1L = left1 % 3 === 0 ? 3 : left1 % 3;
  const rem1R = right1 % 3 === 0 ? 3 : right1 % 3;
  const firstRemainder = rem1L + rem1R; // 2或5

  sticks -= firstRemainder; // 30或27

  // === 再揲 ===
  const left2 = Math.floor(rand() * (sticks - 1)) + 1;
  const right2 = sticks - left2;

  const rem2L = left2 % 3 === 0 ? 3 : left2 % 3;
  const rem2R = right2 % 3 === 0 ? 3 : right2 % 3;
  const secondRemainder = rem2L + rem2R; // 3或6

  sticks -= secondRemainder; // 27, 24, 或21

  // 数其余：除以3得7/8/9 → 映射1/2/3
  const result = sticks / 3; // 7, 8, 或9

  if (result === 7) return 1;
  if (result === 8) return 2;
  if (result === 9) return 3;

  // 理论上不会到达此处；防御性回退
  return Math.floor(rand() * 3) + 1;
}

/**
 * 揲蓍法完整卜卦流程
 * 六揲：前四揲定首（方州部家），后两揲定赞（高位+低位）
 *
 * @param {function} [rng] 随机数生成器（可注入种子实现确定性卜卦）
 * @returns {object} 卜卦结果
 */
function divineBySticks(rng) {
  const rand = rng || Math.random;

  // 阶段一：四揲定首
  const fang = singleYang(rand); // 第一揲 → 方
  const zhou = singleYang(rand); // 第二揲 → 州
  const bu = singleYang(rand);   // 第三揲 → 部
  const jia = singleYang(rand);  // 第四揲 → 家

  const shouIdx = shouIndex(fang, zhou, bu, jia);

  // 阶段二：两揲定赞
  const zanHigh = singleYang(rand); // 第五揲 → 赞高位
  const zanLow = singleYang(rand);  // 第六揲 → 赞低位
  const zanPos = (zanHigh - 1) * 3 + zanLow; // 1-9

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

// ============================================================
// 第五部分：硬币法
// ============================================================

/**
 * 单次硬币卜——3枚硬币掷出1-3
 *
 * 规则：
 *   每枚硬币：正面(阳)记1，背面(阴)记0
 *   三枚合计 yangCount ∈ {0,1,2,3}
 *   映射：0→1, 1→1, 2→2, 3→3
 *
 * 概率分布（近似揲蓍法）：
 *   P(1) = 4/8 = 1/2  （0或1阳）
 *   P(2) = 3/8
 *   P(3) = 1/8
 *
 * @param {function} [rng] 随机数生成器
 * @returns {{value:number, coins:boolean[]}} 结果与硬币详情
 */
function singleCoinToss(rng) {
  const rand = rng || Math.random;
  const coins = [
    rand() < 0.5, // true=阳(正面), false=阴(背面)
    rand() < 0.5,
    rand() < 0.5,
  ];
  const yangCount = coins.filter(c => c).length;

  let value;
  if (yangCount <= 1) value = 1;
  else if (yangCount === 2) value = 2;
  else value = 3;

  return { value, coins, yangCount };
}

/**
 * 硬币法完整卜卦流程
 * 与揲蓍法结构一致：六轮硬币，前四定首，后两定赞
 *
 * @param {function} [rng] 随机数生成器
 * @returns {object} 卜卦结果
 */
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

// ============================================================
// 第六部分：结果构建与解读
// ============================================================

/**
 * 构建完整卜卦结果
 */
function buildResult(shouIdx, zanPos, meta) {
  const shou = getShouInfo(shouIdx);
  const zanInfo = ZAN_POSITIONS[zanPos - 1];
  const zanGlobal = zanGlobalIndex(shouIdx, zanPos);
  const dayNight = zanDayNight(shouIdx, zanPos);
  const xiuJiu = zanXiuJiu(shouIdx, zanPos);
  const wuxing = ZAN_WUXING[zanPos];

  // 四占要素
  const fourFactors = {
    星: wuxing,           // 五行星
    时: getTimeFactor(),   // 时令
    数: dayNight,         // 昼夜之数
    辞: zanInfo.name,     // 赞辞
  };

  // 表经纬（旦用经，夕用纬，中用杂）
  const biao = getBiao(zanPos);

  return {
    // 首信息
    shou: {
      index: shouIdx,
      name: shou.name,
      fang: shou.fang,
      zhou: shou.zhou,
      bu: shou.bu,
      jia: shou.jia,
      xuan: shou.xuan,
      yinYang: shou.yinYang,
      position: `${shou.fang}-${shou.zhou}-${shou.bu}-${shou.jia}`,
    },
    // 赞信息
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
    // 表（经纬）
    biao: biao,
    // 四占
    fourFactors: fourFactors,
    // 原始数据
    meta: meta,
  };
}

/**
 * 获取表（经/纬/杂）
 * 旦筮用经（1,5,7），夕筮用纬（3,4,8），中筮用杂（2,6,9）
 */
function getBiao(zanPos) {
  if ([1, 5, 7].includes(zanPos)) return { type: '经', members: [1, 5, 7] };
  if ([3, 4, 8].includes(zanPos)) return { type: '纬', members: [3, 4, 8] };
  if ([2, 6, 9].includes(zanPos)) return { type: '杂', members: [2, 6, 9] };
  return { type: '未知', members: [] };
}

/**
 * 获取时令因素
 * 简化版：基于当前日期判断季节
 */
function getTimeFactor() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

/**
 * 判断吉凶趋势
 * 基于三从三违规则：
 *   一从二从三从 = 大休
 *   一从二从三违 = 始中休终咎
 *   一从二违三违 = 始休中终咎
 *   一违二从三从 = 始咎中终休
 *   一违二违三从 = 始中咎终休
 *   一违二违三违 = 大咎
 *
 * 这里"从/违"基于赞的昼夜属性：
 *   逢昼=从（吉），逢夜=违（凶）
 *
 * @param {object} result - divineBySticks/divineByCoins 的返回值
 * @returns {object} 吉凶判断
 */
function judgeFortune(result) {
  const { shou, zan } = result;
  const yinYang = shou.yinYang;

  // 获取该首下9赞的从违状态
  const states = [];
  for (let i = 1; i <= 9; i++) {
    states.push(zanDayNight(shou.index, i) === '昼' ? '从' : '违');
  }

  // 三表分组
  const jing = [1, 5, 7].map(i => states[i - 1]); // 经（旦筮）
  const wei = [3, 4, 8].map(i => states[i - 1]);  // 纬（夕筮）
  const za = [2, 6, 9].map(i => states[i - 1]);   // 杂（中筮）

  // 根据当前赞所在表判断
  const biaoType = result.biao.type;
  let activeGroup;
  if (biaoType === '经') activeGroup = jing;
  else if (biaoType === '纬') activeGroup = wei;
  else activeGroup = za;

  const [a, b, c] = activeGroup;
  const pattern = `${a === '从' ? '一从' : '一违'}${b === '从' ? '二从' : '二违'}${c === '从' ? '三从' : '三违'}`;

  const fortuneMap = {
    '一从二从三从': { level: '大休', desc: '三皆从，大吉之象' },
    '一从二从三违': { level: '始中休终咎', desc: '先吉后凶，宜早行' },
    '一从二违三违': { level: '始休中终咎', desc: '初吉后凶，中末宜慎' },
    '一违二从三从': { level: '始咎中终休', desc: '先凶后吉，宜待时' },
    '一违二违三从': { level: '始中咎终休', desc: '先凶后吉，终得安' },
    '一违二违三违': { level: '大咎', desc: '三皆违，大凶之象' },
  };

  const fortune = fortuneMap[pattern] || { level: '未知', desc: '' };

  return {
    pattern,
    currentZanXiuJiu: zan.xiuJiu,
    ...fortune,
    tableStates: { 经: jing, 纬: wei, 杂: za },
  };
}

// ============================================================
// 第七部分：种子随机数（确定性卜卦支持）
// ============================================================

/**
 * 带种子的伪随机数生成器（Mulberry32）
 * 用于实现可复现的确定性卜卦
 *
 * @param {number} seed 种子
 * @returns {function} 返回0-1随机数的函数
 */
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

/**
 * 从字符串生成种子（可从问题文本生成种子）
 */
function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ============================================================
// 第八部分：导出API
// ============================================================

const TaixuanEngine = {
  // 数据
  SHOU_NAMES,
  ZAN_POSITIONS,
  ZAN_WUXING,
  WUXING_NUMBERS,
  SAN_XUAN,
  JIU_TIAN,

  // 计算
  shouIndex,
  shouPosition,
  shouYinYang,
  getShouInfo,
  zanGlobalIndex,
  zanDayNight,
  zanXiuJiu,

  // 卜卦
  divineBySticks,
  divineByCoins,
  singleYang,
  singleCoinToss,

  // 解读
  buildResult,
  getBiao,
  judgeFortune,

  // 工具
  seededRNG,
  seedFromString,
};

// CommonJS / ES Module 兼容导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaixuanEngine;
}
if (typeof window !== 'undefined') {
  window.TaixuanEngine = TaixuanEngine;
}
