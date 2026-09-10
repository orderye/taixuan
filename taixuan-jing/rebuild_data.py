#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 taixuan.txt（通行本）重建 wechat-miniprogram/utils/taixuan-data.js，
补齐全部 81 首的九赞赞辞 + 测曰。
"""
import sys, os, json, re

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import gen_html

SRC = "/Users/roy/.trae-cn/work/6aa138c27cbbc312d9856983/taixuan.txt"
gen_html.SRC = SRC
OUT = "/Volumes/aigo S7 Med/Traework/Taixuan/wechat-miniprogram/utils/taixuan-data.js"

POS_NUM = {'初一': 1, '次二': 2, '次三': 3, '次四': 4,
           '次五': 5, '次六': 6, '次七': 7, '次八': 8, '上九': 9}
ZAN_NAMES = ['初一', '次二', '次三', '次四', '次五', '次六', '次七', '次八', '上九']


def parse_source_robust():
    """比 gen_html.parse_source 更稳健：按首块合并所有行后统一提取九赞，
    避免跨行赞（如 32/33 首的次八/上九独立成行）被丢失。"""
    text = open(SRC, encoding='utf-16').read()
    # 源文本 OCR 脏：赞名带空格、异体/俗字、'次九'应为'上九'
    for d in ['二', '三', '四', '五', '六', '七', '八']:
        text = text.replace('次 %s' % d, '次%s' % d)
    text = text.replace('初 一', '初一').replace('上 九', '上九') \
        .replace('次 九', '上九').replace('次九', '上九') \
        .replace('次久', '上九').replace('侧曰', '测曰')
    lines = [l for l in text.splitlines() if l.strip()]

    # 逐行定首：行首匹配某首名且其后紧跟分隔符 '：/：(半角)/(异体)'
    name_index = {}
    for n, nm in enumerate(gen_html.SHOU_NAMES):
        name_index[nm] = n + 1

    heads = []  # (shou_num, line_idx)
    for i, l in enumerate(lines):
        for nm, num in name_index.items():
            after = l[len(nm):] if l.startswith(nm) and len(l) > len(nm) else ''
            if after and after[0] in '：（(:':
                heads.append((num, i))
                break

    # 每个首取首次出现，按行序
    seen, ordered = set(), []
    for num, idx in heads:
        if num not in seen:
            seen.add(num)
            ordered.append((num, idx))
    ordered.sort(key=lambda x: x[1])

    result = {}
    for k, (num, idx) in enumerate(ordered):
        end = ordered[k + 1][1] if k + 1 < len(ordered) else len(lines)
        head = lines[idx]
        body = ' '.join(lines[idx + 1:end])
        nm = gen_html.SHOU_NAMES[num - 1]

        # 首辞 = 首名行去掉首名与括号异体字
        rest = head[len(nm):]
        rest = re.sub(r'[（(][^）)]*[）)]', '', rest).strip('：: ').strip()

        zans = []
        # re.split 带捕获组时，赞名在奇数位：parts[0]=首部, parts[1]=初一, parts[2]=其辞, ...
        parts = re.split(r'(初一|次二|次三|次四|次五|次六|次七|次八|上九)', body)
        for i in range(1, len(parts) - 1, 2):
            tag = parts[i]
            if tag in ZAN_NAMES and parts[i + 1].strip():
                ci, ce = split_ce(parts[i + 1], '')
                zans.append({'pos': tag, 'zan_ci': ci, 'ce': ce})
        result[num] = {'name': nm, 'shou_ci': rest, 'zan': zans}
    return result


def split_ce(ci, ce):
    """源文本个别赞用'测 曰'（带空格）、缺失分隔或完全无'测曰'标记（如'达'次二）
    时，二次拆分测辞。"""
    ci = ci.strip().lstrip('：:').strip()
    ce = ce.strip()
    if not ce:
        m = re.search(r'测\s*曰\s*[:：]?\s*(.*)$', ci)
        if m and m.start(0) > 0:
            body = ci[:m.start(0)].rstrip('。').strip()
            tail = m.group(1).strip()
            if tail:
                ci, ce = body, tail
    if not ce:
        # 无'测曰'标记但形如"正句。测句也"（整句以"也"结尾，可带尾句号）→ 拆后半为测辞
        m = re.match(r'^(.+?)。(.+也)。?$', ci)
        if m and m.group(1).strip() and m.group(2).strip():
            ci, ce = m.group(1).strip(), m.group(2).strip()
    if ci.startswith('测曰') or ci.startswith('测曰：'):
        # 源文本残体（如 众/密 上九 仅"测曰：也"）：赞辞与测辞皆缺
        ci, ce = '（通行本原文残缺）', ''
    return ci, ce


shou_data = parse_source_robust()

# 完整性校验
bad = []
for i in range(1, 82):
    s = shou_data.get(i)
    if not s or not s.get('shou_ci'):
        bad.append((i, '缺首辞'))
        continue
    n = len(s.get('zan') or [])
    if n != 9:
        bad.append((i, '赞数=%d' % n))

if bad:
    print('解析不完整：')
    for k, v in bad:
        print('  首 %d: %s' % (k, v))
    sys.exit(1)

entries = []
for i in range(1, 82):
    s = shou_data[i]
    zan = []
    for z in s['zan']:
        pos = POS_NUM.get(z['pos'])
        ci, ce = split_ce(z['zan_ci'], z['ce'])
        zan.append({'pos': pos, 'name': z['pos'], 'ci': ci, 'ce': ce})
    entries.append({'index': i, 'name': s['name'], 'ci': s['shou_ci'], 'zan': zan})

js = """/**
 * 太玄经81首数据 — 微信小程序版
 * 每首含：首辞(ci) + 九赞(zan[pos/name/ci/ce])
 * 数据源：taixuan.txt 通行本，赞辞含测曰。
 */

const TAIXUAN_DATA = %s;

function getShouData(index) {
  return TAIXUAN_DATA.find(function (s) { return s.index === index; }) || null;
}

function getZanData(shouIdx, zanPos) {
  var shou = getShouData(shouIdx);
  if (!shou || !shou.zan || shou.zan.length === 0) return null;
  return shou.zan.find(function (z) { return z.pos === zanPos; }) || null;
}

function getShouCi(index) {
  var shou = getShouData(index);
  return shou ? shou.ci : '';
}

function getZanCi(shouIdx, zanPos) {
  var zan = getZanData(shouIdx, zanPos);
  return zan ? zan.ci : '(赞辞待补)';
}

function getZanCe(shouIdx, zanPos) {
  var zan = getZanData(shouIdx, zanPos);
  return zan ? zan.ce : '(测辞待补)';
}

function getAllShouNames() {
  return TAIXUAN_DATA.map(function (s) { return { index: s.index, name: s.name, ci: s.ci }; });
}

function getXuanGroup(fang) {
  var start = (fang - 1) * 27 + 1;
  var end = start + 26;
  return TAIXUAN_DATA.filter(function (s) { return s.index >= start && s.index <= end; });
}

module.exports = {
  TAIXUAN_DATA: TAIXUAN_DATA,
  getShouData: getShouData,
  getZanData: getZanData,
  getShouCi: getShouCi,
  getZanCi: getZanCi,
  getZanCe: getZanCe,
  getAllShouNames: getAllShouNames,
  getXuanGroup: getXuanGroup,
};
""" % json.dumps(entries, ensure_ascii=False, indent=1)

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(js)

print('已生成:', OUT)
print('共 %d 首，均有 9 赞。' % len(entries))