/**
 * 太玄经起卦初始化方案 — 预测类型数据
 *
 * 40种核心预测类型（4大类）+ 10种预设复合场景 = 50种常见预测需求
 */

const CATEGORIES = [
  {
    id: 'career',
    name: '事业与财富',
    subtitle: '入世谋生类',
    xuanRef: '时位与进退',
    types: [
      { id: 1, name: '求职应聘', desc: '面试机遇、岗位匹配及入职时机', kw: '求职' },
      { id: 2, name: '事业升迁', desc: '晋升阻力、贵人运及职场人际', kw: '升迁' },
      { id: 3, name: '创业投资', desc: '项目前景、资金风险及合伙契合', kw: '创业' },
      { id: 4, name: '商业谈判', desc: '合作诚意、谈判筹码及签约概率', kw: '谈判' },
      { id: 5, name: '投资理财', desc: '市场趋势、配置时机及盈亏风险', kw: '理财' },
      { id: 6, name: '房产置业', desc: '买卖时机、地段风水及交易纠纷', kw: '置业' },
      { id: 7, name: '职场人际', desc: '上下级关系、同僚竞争及小人防范', kw: '职场' },
      { id: 8, name: '职业转型', desc: '跨行风险、能力匹配及转型阵痛', kw: '转型' },
      { id: 9, name: '学业考试', desc: '备考状态、考场发挥及录取概率', kw: '考学' },
      { id: 10, name: '名誉声望', desc: '个人品牌、社会地位及舆论风险', kw: '名望' }
    ]
  },
  {
    id: 'emotion',
    name: '情感与人际',
    subtitle: '社会关系类',
    xuanRef: '阴阳交感',
    types: [
      { id: 11, name: '单身姻缘', desc: '正缘时机、桃花质量及社交拓展', kw: '姻缘' },
      { id: 12, name: '恋爱发展', desc: '感情升温、沟通障碍及未来走向', kw: '恋爱' },
      { id: 13, name: '婚姻婚配', desc: '双方契合、婚后运势及家庭分工', kw: '婚配' },
      { id: 14, name: '感情复合', desc: '前任态度、矛盾解决及覆辙风险', kw: '复合' },
      { id: 15, name: '家庭和睦', desc: '代际关系、婆媳矛盾及家运兴衰', kw: '家庭' },
      { id: 16, name: '子女教育', desc: '子女性格、学业瓶颈及亲子沟通', kw: '育儿' },
      { id: 17, name: '交友合作', desc: '朋友忠诚、利益纠葛及背叛风险', kw: '交友' },
      { id: 18, name: '贵人相助', desc: '关键节点外部助力及贵人方位', kw: '贵人' },
      { id: 19, name: '小人防范', desc: '暗箭伤人、口舌是非及化解策略', kw: '防小' },
      { id: 20, name: '人际破局', desc: '化解误会、修复关系的最佳时机', kw: '破局' }
    ]
  },
  {
    id: 'health',
    name: '健康与平安',
    subtitle: '身心安顿类',
    xuanRef: '五行生克与星时数辞',
    types: [
      { id: 21, name: '疾病诊治', desc: '病因方向、求医方位及康复周期', kw: '求医' },
      { id: 22, name: '身心调理', desc: '亚健康状态、抑郁风险及养生时机', kw: '调理' },
      { id: 23, name: '出行平安', desc: '差旅风险、交通意外及出行吉日', kw: '出行' },
      { id: 24, name: '居家安全', desc: '住宅风水、火灾隐患及失窃风险', kw: '居安' },
      { id: 25, name: '孕产孕育', desc: '受孕时机、胎儿健康及生产顺利', kw: '孕育' },
      { id: 26, name: '意外灾祸', desc: '突发事故、官非诉讼及血光之灾', kw: '防灾' },
      { id: 27, name: '精神压力', desc: '焦虑失眠、情绪崩溃及精神内耗', kw: '解压' },
      { id: 28, name: '饮食起居', desc: '生活习惯隐性伤害及调整方向', kw: '饮居' },
      { id: 29, name: '长寿延年', desc: '整体生命力走向及晚年生活质量', kw: '延年' },
      { id: 30, name: '宠物植物', desc: '饲养缘分、健康及走失风险', kw: '宠物' }
    ]
  },
  {
    id: 'fortune',
    name: '抉择与运势',
    subtitle: '时空趋势类',
    xuanRef: '顺天应人',
    types: [
      { id: 31, name: '重大抉择', desc: '两难选择利弊得失及长远影响', kw: '抉择' },
      { id: 32, name: '流年大运', desc: '年度运势起伏及吉凶月份分布', kw: '流年' },
      { id: 33, name: '失物寻回', desc: '物品遗失方位、找回概率及线索', kw: '寻物' },
      { id: 34, name: '诉讼官司', desc: '胜诉概率、和解时机及法律风险', kw: '诉讼' },
      { id: 35, name: '搬迁变动', desc: '搬家换城时机及新环境适应度', kw: '搬迁' },
      { id: 36, name: '天时气象', desc: '特定日期天气、自然灾害及节气影响', kw: '天时' },
      { id: 37, name: '寻人访友', desc: '寻人方向、对方态度及相见时机', kw: '寻人' },
      { id: 38, name: '时机把握', desc: '动静最佳节点，避免错失良机', kw: '时机' },
      { id: 39, name: '因果复盘', desc: '过往决策深层原因及经验教训', kw: '复盘' },
      { id: 40, name: '人生破局', desc: '走出低谷、触底反弹的关键转折', kw: '转机' }
    ]
  }
];

const COMPOSITE_PRESETS = [
  { id: 41, name: '带病创业', typeIds: [3, 21], desc: '带病状态下创业的前景与风险评估' },
  { id: 42, name: '异地复合', typeIds: [14, 35], desc: '异地恋感情复合的可能性与时机' },
  { id: 43, name: '诉讼理财', typeIds: [34, 5], desc: '诉讼期间的财务安全与投资风险' },
  { id: 44, name: '职场小人', typeIds: [7, 19], desc: '职场中小人作祟的识别与防范策略' },
  { id: 45, name: '贵人创业', typeIds: [3, 18], desc: '借助贵人之力创业的时机与方向' },
  { id: 46, name: '病中抉择', typeIds: [31, 21], desc: '疾病困扰中的重大决策利弊分析' },
  { id: 47, name: '出行投资', typeIds: [5, 23], desc: '出行期间的投资时机与安全风险' },
  { id: 48, name: '家庭搬迁', typeIds: [15, 35], desc: '家庭搬迁对家庭和睦的影响评估' },
  { id: 49, name: '考学升迁', typeIds: [9, 2], desc: '通过学业提升实现职场升迁的策略' },
  { id: 50, name: '孕期安宅', typeIds: [25, 24], desc: '孕期居家环境的安全与风水评估' }
];

const TYPE_MAP = {};
CATEGORIES.forEach(function (cat) {
  cat.types.forEach(function (t) {
    TYPE_MAP[t.id] = Object.assign({}, t, { categoryId: cat.id, categoryName: cat.name, xuanRef: cat.xuanRef });
  });
});

function getTypeById(id) {
  return TYPE_MAP[id] || null;
}

function getCompositeName(typeIds) {
  if (!typeIds || typeIds.length !== 2) return '';
  var a = typeIds[0], b = typeIds[1];
  var preset = null;
  for (var i = 0; i < COMPOSITE_PRESETS.length; i++) {
    var p = COMPOSITE_PRESETS[i];
    if ((p.typeIds[0] === a && p.typeIds[1] === b) || (p.typeIds[0] === b && p.typeIds[1] === a)) {
      preset = p;
      break;
    }
  }
  if (preset) return preset.name;
  var ta = TYPE_MAP[a], tb = TYPE_MAP[b];
  if (!ta || !tb) return '';
  return ta.kw + ' × ' + tb.kw;
}

function getTypeInterpretation(typeId, fortuneLevel) {
  var t = TYPE_MAP[typeId];
  if (!t) return '';
  var jiText;
  if (fortuneLevel === '大休') {
    jiText = '大吉之象，万事顺遂，宜速行不可迟疑';
  } else if (fortuneLevel.indexOf('休') >= 0) {
    jiText = '吉象显现，时机有利，可顺势而为';
  } else if (fortuneLevel === '大咎') {
    jiText = '大凶之象，宜守不宜进，凡事慎之';
  } else {
    jiText = '吉凶参半，宜审时度势，择机而动';
  }
  return { name: t.name, desc: t.desc, interpretation: jiText, xuanRef: t.xuanRef };
}

window.TaixuanTypes = {
  CATEGORIES: CATEGORIES,
  COMPOSITE_PRESETS: COMPOSITE_PRESETS,
  TYPE_MAP: TYPE_MAP,
  getTypeById: getTypeById,
  getCompositeName: getCompositeName,
  getTypeInterpretation: getTypeInterpretation
};
