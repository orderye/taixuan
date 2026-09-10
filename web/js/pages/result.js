// js/pages/result.js - 卜卦结果页（对应 pages/result）
(function () {
  'use strict'

  TXPages.result = {
    title: '卜卦结果',

    render() { return '<div class="container fade-in" id="result-root"></div>' },

    onLoad() {
      const result = TXApp.globalData.currentResult
      if (!result) {
        TXApp.goBack()
        return
      }

      const shouData = TaixuanData.getShouData(result.shouIndex)
      const fortune = TaixuanEngine.judgeFortune({
        shou: { index: result.shouIndex, yinYang: result.shouYinYang },
        zan: { position: result.zanPosition, xiuJiu: result.zanXiuJiu },
        biao: { type: result.biaoType }
      })

      // 老历史记录可能缺少初始化方案的字段，需兜底
      const modeText = result.modeText || (result.mode === 'composite' ? '复合占测' : '单项占测')
      const compositeName = result.compositeName || ''
      const selectedTypeNames = result.selectedTypeNames || []
      const typeInterpretations = result.typeInterpretations || []
      const annotations = TaixuanAnnotations.getAnnotations(result.shouIndex)

      this.el.addEventListener('click', (e) => {
        if (e.target.closest('#btn-again')) {
          TXApp.goTab('divine')
          return
        }
        if (e.target.closest('#btn-detail')) {
          TXApp.navigateTo('detail', { index: result.shouIndex })
          return
        }
        const tab = e.target.closest('[data-annot-idx]')
        if (tab && annotations.length > 0) {
          const idx = parseInt(tab.dataset.annotIdx, 10)
          this.el.querySelectorAll('#annot-tabs-box .annot-tab').forEach(t =>
            t.classList.toggle('active', parseInt(t.dataset.annotIdx, 10) === idx))
          const a = annotations[idx]
          this.$('#annot-content').innerHTML =
            '<div class="annot-panel active">' +
              '<div class="annot-source">' + a.source + '</div>' +
              (a.quote
                ? '<div class="annot-quote"><span class="quote-label">原文</span><span class="quote-text">' + a.quote + '</span></div>'
                : '') +
              '<div class="annot-gloss"><span class="gloss-text">' + a.gloss + '</span></div>' +
              '<div class="annot-loc">辑自' + a.loc + '</div>' +
            '</div>'
        }
      })

      this.$('#result-root').innerHTML =
        '<div class="hexagram-hero">' +
          '<div class="hexagram-symbol">' + result.symbol.map(l => '<div class="symbol-line">' + l + '</div>').join('') + '</div>' +
          '<div class="hexagram-name">' + result.shouName + '</div>' +
          '<div class="hexagram-meta">' +
            '<span class="meta-tag tag tag-gold">' + result.shouXuan + '</span>' +
            '<span class="meta-tag tag tag-jade">' + result.shouYinYang + '首</span>' +
            '<span class="meta-tag tag tag-gold">第' + result.shouIndex + '首</span>' +
          '</div>' +
          '<div class="hexagram-position">方' + result.shouPosition + '</div>' +
        '</div>' +

        '<div class="zan-section card">' +
          '<div class="zan-header">' +
            '<div class="zan-name">' + result.zanName + '</div>' +
            '<div class="zan-tags">' +
              '<span class="tag tag-gold">' + result.zanWuxing + '·五行</span>' +
              '<span class="tag ' + (result.zanXiuJiu === '休' ? 'tag-jade' : 'tag-vermilion') + '">' + result.zanXiuJiu + '</span>' +
              '<span class="tag tag-gold">' + result.zanDayNight + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="zan-subname">' + result.fourFactors.ci + ' · ' + result.biaoType + '表</div>' +
        '</div>' +

        '<div class="fortune-section card">' +
          '<div class="section-title">吉凶</div>' +
          '<div class="fortune-level ' + fortune.tag + '"><span class="fortune-level-text">' + fortune.level + '</span></div>' +
          '<div class="fortune-desc">' + fortune.desc + '</div>' +
          '<div class="fortune-pattern">' +
            '<span class="pattern-label">从违格局：</span>' +
            '<span class="pattern-value">' + fortune.pattern + '</span>' +
          '</div>' +
          '<div class="fortune-table">' +
            ['经', '纬', '杂'].map(k =>
              '<div class="table-row">' +
                '<span class="table-label">' + k + '</span>' +
                '<span class="table-value">' + fortune.tableStates[k].join(' · ') + '</span>' +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>' +

        (shouData
          ? '<div class="ci-section card">' +
              '<div class="section-title">首辞</div>' +
              '<div class="ci-text">' + shouData.ci + '</div>' +
            '</div>'
          : '') +

        (result.zanCi
          ? '<div class="ci-section card">' +
              '<div class="section-title">赞辞 · ' + result.zanName + '</div>' +
              '<div class="ci-text zan-ci">' + result.zanCi + '</div>' +
              '<div class="divider"></div>' +
              '<div class="ce-label">测辞</div>' +
              '<div class="ci-text ce-text">' + result.zanCe + '</div>' +
            '</div>'
          : '') +

        (annotations.length > 0
          ? '<div class="annotations-section">' +
              '<div class="section-title">五家注解读</div>' +
              '<div class="annot-tabs" id="annot-tabs-box">' +
                annotations.map((a, i) =>
                  '<div class="annot-tab' + (i === 0 ? ' active' : '') + '" data-annot-idx="' + i + '">' +
                    '<span class="annot-tab-era">' + a.era + '</span>' +
                    '<span class="annot-tab-name">' + a.name + '</span>' +
                  '</div>'
                ).join('') +
              '</div>' +
              '<div class="annot-content" id="annot-content">' +
                '<div class="annot-panel active">' +
                  '<div class="annot-source">' + annotations[0].source + '</div>' +
                  (annotations[0].quote
                    ? '<div class="annot-quote"><span class="quote-label">原文</span><span class="quote-text">' + annotations[0].quote + '</span></div>'
                    : '') +
                  '<div class="annot-gloss"><span class="gloss-text">' + annotations[0].gloss + '</span></div>' +
                  '<div class="annot-loc">辑自' + annotations[0].loc + '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          : '') +

        '<div class="divine-info-section card">' +
          '<div class="section-title">起卦信息</div>' +
          '<div class="info-row"><span class="info-label">模式</span><span class="info-value">' + modeText + '</span></div>' +
          (compositeName
            ? '<div class="info-row"><span class="info-label">场景</span><span class="info-value highlight">' + compositeName + '</span></div>'
            : '') +
          (selectedTypeNames.length > 0
            ? '<div class="info-row"><span class="info-label">类型</span>' +
                '<div class="info-chips">' +
                  selectedTypeNames.map(n => '<span class="info-chip">' + n + '</span>').join('') +
                '</div>' +
              '</div>'
            : '') +
        '</div>' +

        (typeInterpretations.length > 0
          ? '<div class="type-interpretation-section">' +
              '<div class="section-title">类型解读</div>' +
              '<div class="interp-list">' +
                typeInterpretations.map(t =>
                  '<div class="interp-card card">' +
                    '<div class="interp-name">' + t.name + '</div>' +
                    '<div class="interp-xuan">太玄对应：' + t.xuanRef + '</div>' +
                    '<div class="interp-text">' + t.interpretation + '</div>' +
                    '<div class="interp-desc">' + t.desc + '</div>' +
                  '</div>'
                ).join('') +
              '</div>' +
            '</div>'
          : '') +

        '<div class="factors-section card">' +
          '<div class="section-title">四占</div>' +
          '<div class="factors-grid">' +
            '<div class="factor-item"><span class="factor-label">星</span><span class="factor-value">' + result.fourFactors.star + '</span></div>' +
            '<div class="factor-item"><span class="factor-label">时</span><span class="factor-value">' + result.fourFactors.time + '</span></div>' +
            '<div class="factor-item"><span class="factor-label">数</span><span class="factor-value">' + result.fourFactors.number + '</span></div>' +
            '<div class="factor-item"><span class="factor-label">辞</span><span class="factor-value">' + result.fourFactors.ci + '</span></div>' +
          '</div>' +
        '</div>' +

        '<div class="rounds-detail card">' +
          '<div class="section-title">六揲</div>' +
          '<div class="rounds-detail-list">' +
            result.rounds.map(r =>
              '<div class="round-detail-item">' +
                '<span class="round-detail-label">' + r.label + '</span>' +
                '<span class="round-detail-value">' + r.valueText + '</span>' +
                (r.coinsText
                  ? '<div class="round-detail-coins">' +
                      r.coinsText.map(c => '<span class="coin-mini ' + (c === '阳' ? 'coin-yang' : 'coin-yin') + '">' + c + '</span>').join('') +
                    '</div>'
                  : '') +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>' +

        (result.question && result.question !== '(无问)'
          ? '<div class="question-display card">' +
              '<div class="section-title">所问</div>' +
              '<div class="question-text">' + this.esc(result.question) + '</div>' +
            '</div>'
          : '') +

        '<div class="actions">' +
          '<button class="btn-primary" id="btn-again">再占一卦</button>' +
          '<button class="btn-outline" id="btn-detail">查看此首详情</button>' +
        '</div>'
    }
  }
})()
