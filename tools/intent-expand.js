#!/usr/bin/env node
/**
 * 太玄经意图词库 — 自动扩张脚本
 *
 * 输入：现有的 utils/intent-dict.js（基础词）
 * 数据集：SYNONYM_GROUPS（近义词族）、TYPE_EXTRA（按类型分批追加词）、DISPUTED（争议词）
 * 逻辑：
 *   1) 近义词族展开：族内任一词已在某类型，则把全族展开并入该类型（联动式补充）
 *   2) 分批追加：TYPE_EXTRA 中每个词追加到指定类型
 *   3) 去重 / 长度过滤 / 冲突检测（一词多类型告警）
 * 输出：
 *   - tools/intent-expand.candidates.json  候选合并词表（按类型分组）
 *   - tools/intent-expand.report.md        分组统计 + 候选清单 + 争议告警
 *
 * 说明：对 indexOf 包含匹配，句式/整句模板没有增量价值（整句命中核心词即可），
 *      所以本脚本只扩展"名词/近义/口语短语"，不做句子模板，避免铺滥与误命。
 * 用法：node tools/intent-expand.js
 */

const fs = require('fs')
const path = require('path')

const INTENT_PATH = path.join(__dirname, '..', 'wechat-miniprogram', 'utils', 'intent-dict.js')
const TYPES_PATH = path.join(__dirname, '..', 'wechat-miniprogram', 'utils', 'taixuan-types.js')
const { WORD_TO_TYPE } = require(INTENT_PATH)
const types = require(TYPES_PATH)

// ===================== 数据集 1：近义词族（联动展开） =====================
// 族内任一词命中某类型 → 全族并入该类型
const SYNONYM_GROUPS = [
  ['买房', '购房', '购置房产', '买房子', '置业购房'],          // type 6
  ['求职', '找工作', '应聘', '投简历'],                        // type 1
  ['结婚', '成婚', '完婚', '办婚礼', '领证'],                  // type 13
  ['投资', '理财', '资产配置', '做投资'],                      // type 5
  ['考试', '应考', '参加考试', '考试上岸'],                    // type 9
  ['搬家', '乔迁', '迁居', '移居搬家'],                        // type 35
  ['贵助', '贵人', '助力', '帮助'],                            // type 18
  ['小人', '奸佞', '暗箭', '背后作祟'],                        // type 19
  ['失物', '遗失', '弄丢', '东西不见']                         // type 33
]

// ===================== 数据集 2：按类型分批追加词 =====================
const TYPE_EXTRA = {
  1:  ['offer', '笔试', '实习', '转正', '试用期', '入职通知', '面试结果', '背调'],
  2:  ['职级', '考核', '绩效', '评选', '职称', '评优', '升职机会'],
  3:  ['入股', '启动资金', '融资进展', '资金链', '合伙开店', '创业项目', '生意'],
  4:  ['砍价', '谈价', '合同条款', '让步', '利益分配', '商务谈判', '回款'],
  5:  ['存款', '储蓄', '利息', '收益率', '本金', '闲钱', '资产配置'],
  6:  ['看房', '户型', '首付', '月供', '贷款', '二手房', '新房', '学区'],
  7:  ['办公室政治', '派系', '竞争上岗', '汇报', '背锅', '甩锅', '跨部门'],
  8:  ['转岗', '换方向', '跨界', '转行方向', '行业变化', '职业技能'],
  9:  ['专升本', '四六级', '雅思', '托福', '考博', '中考', '学位', '毕业'],
  10: ['风评', '舆论', '曝光', '知名度', '影响力', '社会评价'],
  11: ['桃花运', '相亲对象', '婚恋', '独身', '红鸾', '婚姻宫'],
  12: ['表白', '追求', '牵手', '异地恋', '冷战中', '热恋期', '恋爱矛盾'],
  13: ['彩礼', '嫁妆', '登记', '婚礼筹备', '蜜月', '夫妻'],
  14: ['再续前缘', '旧情复燃', '挽回前任', '复合时机', '和好时机'],
  15: ['婆媳关系', '翁婿', '亲戚', '父母养老', '家庭矛盾', '姑嫂'],
  16: ['辅导', '补习', '兴趣班', '升学', '择校', '叛逆期', '厌学', '成绩下滑'],
  17: ['人脉', '结盟', '搭伙', '真心朋友', '盟友', '合资'],
  18: ['伯乐', '引路人', '提携之恩', '贵人运', '恩人'],
  19: ['中伤', '造谣', '诽谤', '穿小鞋', '抢功', '针对'],
  20: ['冰释', '和解', '化解心结', '重归于好', '修复'],
  21: ['挂号', '就诊', '复诊', '炎症', '发烧', '慢性病', '治愈', '医生'],
  22: ['排毒', '元气', '气血', '体态', '冥想', '瑜伽', '晨跑'],
  23: ['航班延误', '订票', '火车', '出国', '签证', '自驾游', '车票'],
  24: ['燃气', '电线', '消防', '防盗门', '门锁', '水电', '小偷'],
  25: ['妊娠', '临产', '坐月子', '胎动', '受孕', '新生儿', '早产'],
  26: ['天灾', '人祸', '突发', '躲灾', '避凶', '破耗'],
  27: ['内耗', '焦虑症', '抑郁情绪', '情绪低落', '消极', '崩溃边缘'],
  28: ['忌口', '膳食', '饮食规律', '久坐', '三餐', '作息紊乱', '烟酒'],
  29: ['颐养', '长命', '寿元', '天年'],
  30: ['爱宠', '收养', '兽医', '宠物健康', '绿植', '多肉'],
  31: ['两难', '犹豫', '纠结', '何去何从', '选择困难', '去留'],
  32: ['本命年', '转运', '流年不利', '运程起伏', '吉凶'],
  33: ['东西丢了', '遗失物', '钱包手机', '车钥匙', '钥匙'],
  34: ['律师', '被告', '原告', '上诉', '判决', '调解', '开庭', '赔偿'],
  35: ['乔迁', '新居', '搬迁吉日', '离家落户'],
  36: ['天气预报', '出行吉日', '开业吉日', '结婚吉日', '择日'],
  37: ['重聚', '见一面', '上门拜访', '探望', '访故'],
  38: ['最佳时机', '行动时机', '出手时机', '把握节点'],
  39: ['症结', '前因', '缘由', '复盘得失', '倒推'],
  40: ['逆袭', '东山再起', '否极泰来', '翻身仗', '走出低谷']
}

// ===================== 数据集 3：共享词（一词映射多类型，允许并鼓励） =====================
// 供人工复核"横跨类型是否适配"。纯 review 用，不参与自动并入。
const DISPUTED = {} // 保留字段位，当前无强制待决项

// ===================== 逻辑 =====================
function main() {
  const result = {} // typeId -> Set(word)
  const sharedWords = [] // { word, types } 跨类型共享词汇总

  const add = (typeId, word) => {
    if (!word || typeof word !== 'string') return
    word = word.trim()
    if (!word) return
    if (!result[typeId]) result[typeId] = new Set()
    result[typeId].add(word)
  }

  // 1) 基础词原样搬入（含共享词：一词映射多类型，不视为冲突）
  for (const word in WORD_TO_TYPE) {
    for (const tid of WORD_TO_TYPE[word]) add(tid, word)
  }

  // 2) 近义词族联动展开（族内任一词已属某类型 → 全族并入该类型）
  for (const group of SYNONYM_GROUPS) {
    const owners = new Set()
    for (const w of group) {
      const arr = WORD_TO_TYPE[w]
      if (arr) for (const t of arr) owners.add(t)
    }
    if (owners.size) {
      for (const w of group) for (const owner of owners) add(owner, w)
    }
  }

  // 3) 分批追加
  for (const tid in TYPE_EXTRA) {
    for (const w of TYPE_EXTRA[tid]) add(parseInt(tid), w)
  }

  // 4) 收集跨类型共享词（供人工复核是否合理）
  const wordOwners = {}
  for (const typeId in result) {
    for (const w of result[typeId]) {
      if (!wordOwners[w]) wordOwners[w] = []
      if (wordOwners[w].indexOf(parseInt(typeId)) < 0) wordOwners[w].push(parseInt(typeId))
    }
  }
  for (const w in wordOwners) {
    if (wordOwners[w].length > 1) sharedWords.push({ word: w, types: wordOwners[w] })
  }
  sharedWords.sort((a, b) => a.types.length - b.types.length || a.word.localeCompare(b.word))

  // ===== 统计与报告 =====
  const baseCount = Object.keys(WORD_TO_TYPE).length
  let added = 0
  const lines = []
  lines.push('# 太玄经意图词库 — 自动扩张报告')
  lines.push('')
  lines.push('- 运行时间：' + new Date().toLocaleString('zh-CN'))
  lines.push('- 基础词数：' + baseCount)
  lines.push('')
  lines.push('## 一致组（保留/展开）按类型')
  lines.push('')
  lines.push('| No. | 类型 | 词数 | 关键词 |')
  lines.push('| --- | --- | --- | --- |')
  const sortedIds = Object.keys(result).map(Number).sort((a, b) => a - b)
  for (const tid of sortedIds) {
    const t = types.getTypeById(tid)
    const words = [...result[tid]]
    const baseOnly = words.filter(w => WORD_TO_TYPE[w])
    const isNew = words.length > baseOnly.length
    if (isNew) added += words.length - baseOnly.length
    const name = t ? t.name : '#' + tid
    const mark = isNew ? '（含新词）' : ''
    lines.push('| ' + tid + ' | ' + name + mark + ' | ' + words.length + ' | ' + words.sort().join(' / ') + ' |')
  }
  lines.push('')
  // 每类型词数达标检查（目标 ≥20）
  let insufficient = []
  for (const tid of sortedIds) {
    if ((result[tid] || new Set()).size < 20) insufficient.push(tid)
  }

  lines.push('## 共享词（一词多类型）与达标检查')
  lines.push('')
  lines.push('### 共享词清单（跨类型，供人工复核适配性）')
  lines.push('')
  if (sharedWords.length === 0) {
    lines.push('_无_')
  } else {
    lines.push('| 词 | 横跨类型 |')
    lines.push('| --- | --- |')
    for (const s of sharedWords) lines.push('| ' + s.word + ' | ' + s.types.join(' / ') + ' |')
  }
  lines.push('')
  lines.push('### 每类型词数不足 20 的类型')
  lines.push('')
  if (insufficient.length === 0) {
    lines.push('_全部达标_')
  } else {
    lines.push('`' + insufficient.join('、') + '` 需补充关键词。')
  }
  lines.push('')
  lines.push('## 小结')
  lines.push('')
  lines.push('- 基础词数：' + baseCount + ' ; 合并后词条：' + (baseCount + added) + '')
  lines.push('- 每类目标词数：20 ; 不足待补：' + insufficient.length + ' 个类型')
  lines.push('- 重新生成报告：`node tools/intent-expand.js`')

  // ===== 写出文件 =====
  const outJson = {}
  for (const tid of sortedIds) outJson[Number(tid)] = [...result[tid]].sort()

  fs.writeFileSync(path.join(__dirname, 'intent-expand.candidates.json'), JSON.stringify(outJson, null, 2), 'utf8')
  fs.writeFileSync(path.join(__dirname, 'intent-expand.report.md'), lines.join('\n') + '\n', 'utf8')

  console.log('完成。')
  console.log('  候选词表: tools/intent-expand.candidates.json')
  console.log('  报告:     tools/intent-expand.report.md')
  console.log('  基础词: ' + baseCount + ' ; 新增/展开: ' + added)
  console.log('  共享词: ' + sharedWords.length + ' 处 ; 词数不足20的类型: ' + insufficient.length + ' 个')
}

main()