#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""诊断：顺序推进分块，打印每首赞数与首辞，定位异常。"""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_html

SRC = "/Users/roy/.trae-cn/work/6aa138c27cbbc312d9856983/taixuan.txt"
NAMES = gen_html.SHOU_NAMES

text = open(SRC, encoding='utf-16').read()
text = text.replace('初 一', '初一').replace('侧曰', '测曰') \
    .replace('次 九', '上九').replace('次久', '上九')
lines = [l for l in text.splitlines() if l.strip()]


def shou_name_at(l):
    for i, nm in enumerate(NAMES):
        if len(l) > len(nm) and l.startswith(nm) and l[len(nm)] in '：（(':
            return i
    return -1


cur = -1
block = {}
for l in lines:
    idx = shou_name_at(l)
    if idx >= 0 and idx > cur:
        cur = idx
        block[cur] = [l]
    else:
        block.setdefault(cur, []).append(l)

print("识别到首数:", len(block), " 缺:", sorted(set(range(81)) - set(block.keys())))
for k in sorted(block):
    nm = NAMES[k]
    head = block[k][0]
    rest = re.sub(r'[（(][^）)]*[）)]', '', head[len(nm):]).strip('：: ')
    nz = 0
    for l2 in block[k][1:]:
        nz += len(re.findall(r'(?:初一|次[一二三四五六七八九]|上九)', l2))
    flag = '' if nz == 9 else '  <<<'
    print('%2d %s 赞行内赞数:%d 行块数:%d 首辞:%s %s' % (k + 1, nm, nz, len(block[k]), rest[:16], flag))