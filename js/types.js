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

  var jiText = '';
  var advice = '';

  // 根据预测类型提供具体解读
  switch (typeId) {
    case 1: // 求职应聘
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，面试表现突出，易获心仪offer';
        advice = '主动出击，展示核心竞争力，把握黄金窗口期';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，求职运势顺利，机遇渐显';
        advice = '保持积极心态，多渠道投递，善用贵人引荐';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，求职阻碍较多，需谨慎应对';
        advice = '暂缓求职节奏，提升技能储备，避开不利时段';
      } else {
        jiText = '吉凶参半，求职过程有波折但终有转机';
        advice = '调整期望值，扩大选择范围，耐心等待时机';
      }
      break;

    case 2: // 事业升迁
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，晋升在望，功名可期';
        advice = '积极展现领导才能，主动承担重要项目';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，职场运势上升，有提拔机会';
        advice = '保持专业水准，建立良好人际关系，把握表现机会';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，职场压力大，晋升受阻';
        advice = '以退为进，巩固现有成果，避免树敌';
      } else {
        jiText = '吉凶参半，升迁之路有竞争但可突破';
        advice = '提升核心竞争力，寻找差异化优势，耐心等待时机';
      }
      break;

    case 3: // 创业投资
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，创业时机极佳，项目前景光明';
        advice = '大胆推进计划，抓住市场机遇，快速扩张';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，创业运势良好，有贵人相助';
        advice = '稳健发展，注重团队建设，控制风险';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，创业风险高，资金链紧张';
        advice = '暂缓扩张，优化商业模式，寻求战略合作';
      } else {
        jiText = '吉凶参半，创业之路有挑战但可克服';
        advice = '做好充分准备，分散投资风险，保持灵活应变';
      }
      break;

    case 4: // 商业谈判
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，谈判顺利，易达成有利协议';
        advice = '主动提出方案，展现诚意，争取最优条件';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，谈判氛围良好，有合作机会';
        advice = '保持沟通，寻找共同利益，建立长期关系';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，谈判阻力大，利益冲突明显';
        advice = '调整策略，适当让步，寻找替代方案';
      } else {
        jiText = '吉凶参半，谈判过程有拉锯但可达成共识';
        advice = '做好准备，把握底线，灵活应对变化';
      }
      break;

    case 5: // 投资理财
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，投资运势极佳，收益可观';
        advice = '把握机会，合理配置资产，控制仓位';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，理财运势良好，稳健增长';
        advice = '保持理性，分散投资，长期持有优质资产';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，投资风险高，易有亏损';
        advice = '保守操作，减少高风险投资，保留现金';
      } else {
        jiText = '吉凶参半，投资市场波动，需谨慎操作';
        advice = '做好研究，控制风险，避免情绪化决策';
      }
      break;

    case 6: // 房产置业
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，购房时机极佳，房产增值潜力大';
        advice = '果断出手，选择优质地段，把握优惠时机';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，房产运势良好，交易顺利';
        advice = '多方比较，注重品质，合理评估价值';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，房产交易风险高，易有纠纷';
        advice = '暂缓购房，仔细审查合同，避免冲动决策';
      } else {
        jiText = '吉凶参半，房产市场有波动但可把握机会';
        advice = '做好调研，理性评估，等待合适时机';
      }
      break;

    case 7: // 职场人际
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，人际关系和谐，贵人运旺';
        advice = '主动沟通，建立信任，善用团队力量';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，人际关系改善，合作机会增多';
        advice = '保持真诚，化解误会，寻求共同目标';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，职场关系紧张，易有冲突';
        advice = '保持距离，避免卷入纷争，专注本职工作';
      } else {
        jiText = '吉凶参半，人际关系有挑战但可改善';
        advice = '调整心态，主动示好，寻找共同话题';
      }
      break;

    case 8: // 职业转型
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，转型时机极佳，新领域前景光明';
        advice = '大胆尝试，发挥优势，快速适应新环境';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，转型运势良好，有贵人指引';
        advice = '做好准备，学习新技能，建立新的人脉';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，转型风险高，适应困难';
        advice = '暂缓转型，提升现有能力，等待更好时机';
      } else {
        jiText = '吉凶参半，转型之路有挑战但可克服';
        advice = '做好规划，逐步过渡，保持灵活性';
      }
      break;

    case 9: // 学业考试
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，考试运势极佳，成绩优异';
        advice = '保持状态，发挥优势，把握黄金备考期';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，学习运势良好，进步明显';
        advice = '制定计划，巩固基础，寻求名师指导';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，考试压力大，发挥失常';
        advice = '调整心态，减轻压力，寻求心理疏导';
      } else {
        jiText = '吉凶参半，考试过程有波折但可调整';
        advice = '做好准备，保持平常心，灵活应对变化';
      }
      break;

    case 10: // 名誉声望
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，声望提升，社会评价高';
        advice = '把握机会，展现才华，建立良好口碑';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，名誉运势良好，影响力扩大';
        advice = '保持诚信，积极贡献，维护良好形象';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，名誉受损，社会评价低';
        advice = '低调行事，避免争议，重建信任';
      } else {
        jiText = '吉凶参半，名誉有波动但可改善';
        advice = '保持真实，积极沟通，化解误会';
      }
      break;

    case 11: // 单身姻缘
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，桃花运旺，正缘将至';
        advice = '主动出击，扩大社交圈，把握良缘时机';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，姻缘运势良好，有心仪对象出现';
        advice = '保持真诚，展现魅力，用心经营感情';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，姻缘受阻，易有感情挫折';
        advice = '暂缓择偶，提升自我，等待合适时机';
      } else {
        jiText = '吉凶参半，姻缘有波折但可调整';
        advice = '调整心态，扩大选择，耐心等待缘分';
      }
      break;

    case 12: // 恋爱发展
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，感情甜蜜，关系升温';
        advice = '珍惜当下，增进沟通，规划美好未来';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，感情运势良好，默契增强';
        advice = '保持信任，解决分歧，共同成长';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，感情出现危机，易有争吵';
        advice = '冷静处理，坦诚沟通，寻求专业帮助';
      } else {
        jiText = '吉凶参半，感情有挑战但可克服';
        advice = '调整期望，互相理解，共同面对困难';
      }
      break;

    case 13: // 婚姻婚配
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，婚姻美满，家庭幸福';
        advice = '珍惜缘分，经营家庭，共创美好未来';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，婚姻运势良好，家庭和谐';
        advice = '保持沟通，互相尊重，共同承担家庭责任';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，婚姻出现危机，易有矛盾';
        advice = '冷静反思，寻求调解，重建信任';
      } else {
        jiText = '吉凶参半，婚姻有挑战但可改善';
        advice = '调整心态，加强沟通，共同成长';
      }
      break;

    case 14: // 感情复合
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，复合时机成熟，旧情复燃';
        advice = '主动联系，坦诚沟通，珍惜重逢机会';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，复合运势良好，有修复可能';
        advice = '反思过去，解决根本问题，重建信任';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，复合困难，易重蹈覆辙';
        advice = '理性评估，避免冲动，考虑清楚再决定';
      } else {
        jiText = '吉凶参半，复合有波折但可调整';
        advice = '冷静思考，权衡利弊，做好心理准备';
      }
      break;

    case 15: // 家庭和睦
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，家庭和谐，亲情融洽';
        advice = '珍惜家人，增进互动，营造温馨氛围';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，家庭运势良好，关系改善';
        advice = '主动沟通，化解矛盾，共同维护家庭';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，家庭矛盾多，关系紧张';
        advice = '保持冷静，寻求调解，避免冲突升级';
      } else {
        jiText = '吉凶参半，家庭有挑战但可改善';
        advice = '调整心态，加强沟通，共同面对困难';
      }
      break;

    case 16: // 子女教育
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，子女运势佳，学业有成';
        advice = '鼓励探索，培养兴趣，给予适当引导';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，子女运势良好，进步明显';
        advice = '耐心陪伴，因材施教，建立良好沟通';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，子女教育困难，亲子关系紧张';
        advice = '调整教育方式，寻求专业帮助，保持耐心';
      } else {
        jiText = '吉凶参半，子女教育有挑战但可改善';
        advice = '理解孩子，调整期望，共同成长';
      }
      break;

    case 17: // 交友合作
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，人缘极佳，合作顺利';
        advice = '真诚待人，建立信任，拓展社交圈';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，人际关系良好，合作机会多';
        advice = '保持诚信，寻找共同利益，建立长期关系';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，交友不慎，易有背叛';
        advice = '谨慎择友，保持距离，避免利益冲突';
      } else {
        jiText = '吉凶参半，交友有波折但可调整';
        advice = '理性交友，保持界限，建立真诚关系';
      }
      break;

    case 18: // 贵人相助
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，贵人运旺，得力相助';
        advice = '把握机会，虚心请教，善用贵人资源';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，有贵人相助，运势提升';
        advice = '保持真诚，积极表现，建立良好关系';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，贵人难寻，孤立无援';
        advice = '提升自我，扩大人脉，寻找合适机会';
      } else {
        jiText = '吉凶参半，有贵人相助但需主动争取';
        advice = '积极社交，展现价值，建立互惠关系';
      }
      break;

    case 19: // 小人防范
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，小人退避，运势安稳';
        advice = '保持警惕，远离是非，专注正事';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，小人影响减弱，运势平稳';
        advice = '保持低调，避免树敌，化解潜在矛盾';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，小人作祟，易受暗算';
        advice = '提高警惕，谨言慎行，寻求保护';
      } else {
        jiText = '吉凶参半，有小人困扰但可化解';
        advice = '保持冷静，避免冲突，寻找合适对策';
      }
      break;

    case 20: // 人际破局
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，人际矛盾化解，关系修复';
        advice = '主动沟通，坦诚相待，重建信任';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，人际关系改善，误会消除';
        advice = '保持耐心，寻找共同点，逐步修复关系';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，人际矛盾深，难以调和';
        advice = '保持距离，避免激化矛盾，寻求调解';
      } else {
        jiText = '吉凶参半，人际有挑战但可改善';
        advice = '调整心态，主动示好，寻找和解机会';
      }
      break;

    case 21: // 疾病诊治
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，疾病康复顺利，健康好转';
        advice = '积极配合治疗，保持乐观心态，注意休息';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，治疗有效，病情稳定';
        advice = '坚持治疗，调整生活习惯，定期复查';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，疾病反复，治疗困难';
        advice = '寻求专家意见，调整方案，保持耐心';
      } else {
        jiText = '吉凶参半，疾病有反复但可控制';
        advice = '配合治疗，调整心态，寻求多方帮助';
      }
      break;

    case 22: // 身心调理
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，身心状态极佳，精力充沛';
        advice = '保持良好习惯，适度运动，调节压力';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，身心状态改善，压力减轻';
        advice = '坚持健康生活方式，寻求放松方式';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，身心压力大，易有不适';
        advice = '寻求专业帮助，调整作息，减轻负担';
      } else {
        jiText = '吉凶参半，身心有挑战但可调整';
        advice = '关注健康，寻求平衡，保持积极心态';
      }
      break;

    case 23: // 出行平安
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，出行顺利，一路平安';
        advice = '做好准备，享受旅程，把握机会';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，出行运势良好，旅途愉快';
        advice = '注意安全，保持联系，灵活应对变化';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，出行不顺，易有意外';
        advice = '谨慎出行，做好预案，保持警惕';
      } else {
        jiText = '吉凶参半，出行有波折但可调整';
        advice = '做好准备，保持灵活，寻求帮助';
      }
      break;

    case 24: // 居家安全
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，居家安全，家宅安宁';
        advice = '保持警惕，维护安全，营造温馨环境';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，居家运势良好，平安顺遂';
        advice = '注意安全细节，维护家庭和谐';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，居家不安全，易有隐患';
        advice = '检查安全隐患，加强防范，保持警惕';
      } else {
        jiText = '吉凶参半，居家有挑战但可改善';
        advice = '注意安全，维护环境，保持警觉';
      }
      break;

    case 25: // 孕产孕育
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，孕产顺利，母子平安';
        advice = '保持乐观，定期产检，注意休息';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，孕期顺利，胎儿健康';
        advice = '注意营养，适度运动，保持良好心态';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，孕产有风险，需谨慎';
        advice = '寻求专业帮助，定期检查，注意休息';
      } else {
        jiText = '吉凶参半，孕产有波折但可调整';
        advice = '保持积极，配合医生，寻求支持';
      }
      break;

    case 26: // 意外灾祸
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，平安无事，化险为夷';
        advice = '保持警惕，远离危险，把握安全机会';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，灾祸远离，运势平稳';
        advice = '保持谨慎，做好预防，寻求保护';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，意外风险高，需高度警惕';
        advice = '避免冒险，寻求保护，做好应急预案';
      } else {
        jiText = '吉凶参半，有风险但可防范';
        advice = '提高警惕，做好准备，远离危险';
      }
      break;

    case 27: // 精神压力
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，精神状态极佳，压力消散';
        advice = '保持乐观，寻求放松，享受当下';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，压力减轻，心态改善';
        advice = '寻求支持，调整心态，保持平衡';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，精神压力大，情绪低落';
        advice = '寻求专业帮助，调整生活方式，保持沟通';
      } else {
        jiText = '吉凶参半，精神有挑战但可调整';
        advice = '关注心理健康，寻求支持，保持积极';
      }
      break;

    case 28: // 饮食起居
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，饮食起居规律，健康状况佳';
        advice = '保持良好习惯，注重营养，适度运动';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，生活习惯改善，健康好转';
        advice = '坚持规律作息，调整饮食结构';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，饮食起居不规律，健康受损';
        advice = '调整生活习惯，寻求专业指导，保持规律';
      } else {
        jiText = '吉凶参半，生活有挑战但可改善';
        advice = '关注健康，调整习惯，寻求平衡';
      }
      break;

    case 29: // 长寿延年
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，健康长寿，晚年幸福';
        advice = '保持健康生活方式，享受生活，关爱家人';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，健康运势良好，延年益寿';
        advice = '坚持锻炼，合理饮食，保持乐观心态';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，健康隐患多，需谨慎保养';
        advice = '定期体检，调整生活方式，寻求专业帮助';
      } else {
        jiText = '吉凶参半，健康有挑战但可改善';
        advice = '关注健康，调整习惯，保持积极心态';
      }
      break;

    case 30: // 宠物植物
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，宠物植物健康，缘分深厚';
        advice = '细心照料，建立情感纽带，享受陪伴';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，宠物植物运势良好，健康成长';
        advice = '坚持照料，注意健康，建立良好习惯';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，宠物植物易有健康问题';
        advice = '注意健康，寻求专业帮助，做好准备';
      } else {
        jiText = '吉凶参半，有挑战但可改善';
        advice = '细心照料，关注健康，建立良好关系';
      }
      break;

    case 31: // 重大抉择
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，抉择明智，结果圆满';
        advice = '相信直觉，果断决策，把握机会';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，抉择运势良好，利弊分明';
        advice = '理性分析，权衡利弊，谨慎决策';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，抉择困难，易有失误';
        advice = '暂缓决策，寻求建议，多方考虑';
      } else {
        jiText = '吉凶参半，抉择有挑战但可调整';
        advice = '保持冷静，理性分析，灵活应对';
      }
      break;

    case 32: // 流年大运
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，流年运势极佳，万事顺遂';
        advice = '把握机会，积极行动，乘势而上';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，运势平稳，有发展机遇';
        advice = '保持积极，抓住机会，稳步前进';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，流年不利，运势低迷';
        advice = '谨慎行事，避免冒险，等待时机';
      } else {
        jiText = '吉凶参半，运势有起伏但可调整';
        advice = '保持平常心，理性应对，把握机遇';
      }
      break;

    case 33: // 失物寻回
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，失物易寻，顺利找回';
        advice = '仔细寻找，把握线索，及时行动';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，寻物运势良好，有望找回';
        advice = '耐心寻找，寻求帮助，把握机会';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，失物难寻，找回概率低';
        advice = '调整期望，接受现实，做好防范';
      } else {
        jiText = '吉凶参半，寻物有波折但可尝试';
        advice = '仔细寻找，寻求帮助，保持耐心';
      }
      break;

    case 34: // 诉讼官司
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，诉讼顺利，胜诉在望';
        advice = '准备充分，寻求专业帮助，把握机会';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，诉讼运势良好，有望达成和解';
        advice = '保持理性，寻求调解，把握机会';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，诉讼不利，易有损失';
        advice = '谨慎应对，寻求专业帮助，考虑和解';
      } else {
        jiText = '吉凶参半，诉讼有挑战但可调整';
        advice = '保持冷静，寻求帮助，灵活应对';
      }
      break;

    case 35: // 搬迁变动
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，搬迁顺利，新居环境佳';
        advice = '果断行动，享受新环境，把握机会';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，搬迁运势良好，适应顺利';
        advice = '做好准备，积极适应，建立新关系';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，搬迁不顺，适应困难';
        advice = '暂缓搬迁，做好准备，寻求帮助';
      } else {
        jiText = '吉凶参半，搬迁有波折但可调整';
        advice = '做好准备，保持灵活，积极适应';
      }
      break;

    case 36: // 天时气象
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，天时有利，气象宜人';
        advice = '把握时机，享受自然，做好准备';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，气象良好，出行顺利';
        advice = '注意天气变化，做好准备，灵活应对';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，气象不利，出行受阻';
        advice = '谨慎出行，做好预案，保持警惕';
      } else {
        jiText = '吉凶参半，气象有变化但可应对';
        advice = '关注天气，做好准备，灵活调整';
      }
      break;

    case 37: // 寻人访友
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，寻人顺利，访友愉快';
        advice = '主动联系，把握机会，享受相聚';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，寻人运势良好，有望重逢';
        advice = '保持联系，把握机会，珍惜时光';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，寻人困难，访友不顺';
        advice = '调整期望，保持联系，等待时机';
      } else {
        jiText = '吉凶参半，寻人访友有波折但可调整';
        advice = '保持联系，把握机会，耐心等待';
      }
      break;

    case 38: // 时机把握
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，时机极佳，行动成功';
        advice = '果断行动，把握机会，乘势而上';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，时机有利，可顺势而为';
        advice = '做好准备，把握机会，积极行动';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，时机不利，行动受阻';
        advice = '暂缓行动，等待时机，做好准备';
      } else {
        jiText = '吉凶参半，时机有变化但可调整';
        advice = '保持敏锐，把握机会，灵活应对';
      }
      break;

    case 39: // 因果复盘
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，复盘顺利，洞察深刻';
        advice = '深入分析，总结经验，把握规律';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，复盘运势良好，收获颇丰';
        advice = '客观分析，总结经验，指导未来';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，复盘困难，难有突破';
        advice = '调整方法，寻求帮助，保持耐心';
      } else {
        jiText = '吉凶参半，复盘有挑战但可调整';
        advice = '保持客观，总结经验，灵活应对';
      }
      break;

    case 40: // 人生破局
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，破局成功，柳暗花明';
        advice = '把握机会，突破困境，创造新机';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，破局运势良好，转机渐显';
        advice = '保持信心，寻找机会，积极行动';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，破局困难，困境持续';
        advice = '保持耐心，寻求帮助，等待时机';
      } else {
        jiText = '吉凶参半，破局有挑战但可突破';
        advice = '保持信心，寻找机会，灵活应对';
      }
      break;

    default:
      // 默认解读
      if (fortuneLevel === '大休') {
        jiText = '大吉之象，万事顺遂，宜速行不可迟疑';
        advice = '把握机会，果断行动，乘势而上';
      } else if (fortuneLevel.indexOf('休') >= 0) {
        jiText = '吉象显现，时机有利，可顺势而为';
        advice = '保持积极，抓住机会，稳步前进';
      } else if (fortuneLevel === '大咎') {
        jiText = '大凶之象，宜守不宜进，凡事慎之';
        advice = '谨慎行事，避免冒险，等待时机';
      } else {
        jiText = '吉凶参半，宜审时度势，择机而动';
        advice = '保持冷静，理性分析，灵活应对';
      }
  }

  return {
    name: t.name,
    desc: t.desc,
    interpretation: jiText,
    advice: advice,
    xuanRef: t.xuanRef
  };
}

window.TaixuanTypes = {
  CATEGORIES: CATEGORIES,
  COMPOSITE_PRESETS: COMPOSITE_PRESETS,
  TYPE_MAP: TYPE_MAP,
  getTypeById: getTypeById,
  getCompositeName: getCompositeName,
  getTypeInterpretation: getTypeInterpretation
};
