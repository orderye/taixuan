// js/pages/detail.js - 首详情页（对应 pages/detail：首信息/首辞/五家全注/九赞/翻页）
(function () {
  'use strict'

  TXPages.detail = {
    title: '首详情',

    render() {
      return '<div class="container fade-in" id="detail-root"></div>'
    },

    onLoad(params) {
      this.shouIndex = parseInt(params.index, 10) || 1
      this.activeAnnotator = 0

      this.el.addEventListener('click', (e) => {
        if (e.target.closest('#annot-tabs-box')) {
          const tab = e.target.closest('[data-annot-idx]')
          if (tab) {
            this.activeAnnotator = parseInt(tab.dataset.annotIdx, 10)
            this.renderAnnotTabs()
            this.renderAnnotPanels()
          }
          return
        }
        if (e.target.closest('#nav-prev')) this.goToPrev()
        else if (e.target.closest('#nav-next')) this.goToNext()
      })

      this.loadShou(this.shouIndex)
    },

    loadShou(index) {
      const shouData = TaixuanData.getShouData(index)
      if (!shouData) return

      const shouInfo = TaixuanEngine.getShouInfo(index)
      const jiuTianIdx = Math.floor((index - 1) / 9)
      const jiuTian = TaixuanEngine.JIU_TIAN[jiuTianIdx]

      const zanList = TaixuanEngine.ZAN_POSITIONS.map(zp => {
        const zanData = TaixuanData.getZanData(index, zp.index)
        const biao = TaixuanEngine.getBiao(zp.index)
        return {
          pos: zp.index,
          name: zp.name,
          subName: zp.subName,
          category: zp.category,
          level: zp.level,
          wuxing: TaixuanEngine.ZAN_WUXING[zp.index],
          dayNight: TaixuanEngine.zanDayNight(index, zp.index),
          xiuJiu: TaixuanEngine.zanXiuJiu(index, zp.index),
          biaoType: biao.type,
          ci: zanData ? zanData.ci : '(赞辞待补)',
          ce: zanData ? zanData.ce : '(测辞待补)',
          hasData: !!zanData
        }
      })

      const symbol = TaixuanEngine.buildShouSymbol(shouInfo.fang, shouInfo.zhou, shouInfo.bu, shouInfo.jia)
      this.annotations = TaixuanAnnotations.getAnnotations(index)
      this.activeAnnotator = 0

      this.$('#detail-root').innerHTML =
        '<div class="shou-hero">' +
          '<div class="shou-symbol">' + symbol.map(l => '<div class="symbol-line">' + l + '</div>').join('') + '</div>' +
          '<div class="shou-name">' + shouData.name + '</div>' +
          '<div class="shou-meta">' +
            '<span class="tag tag-gold">' + shouInfo.xuan + '</span>' +
            '<span class="tag tag-jade">' + shouInfo.yinYang + '首</span>' +
            '<span class="tag tag-gold">' + jiuTian + '</span>' +
          '</div>' +
          '<div class="shou-position">第' + index + '首 · 方' + shouInfo.fang + ' 州' + shouInfo.zhou + ' 部' + shouInfo.bu + ' 家' + shouInfo.jia + '</div>' +
        '</div>' +

        '<div class="ci-card card">' +
          '<div class="section-title">首辞</div>' +
          '<div class="ci-text">' + shouData.ci + '</div>' +
        '</div>' +

        (this.annotations.length > 0
          ? '<div class="annotations-section">' +
              '<div class="section-title">五家全注</div>' +
              '<div class="annot-tabs" id="annot-tabs-box"></div>' +
              '<div class="annot-content" id="annot-content"></div>' +
            '</div>'
          : '') +

        '<div class="zan-list-section">' +
          '<div class="section-title">九赞</div>' +
          '<div class="zan-list">' +
            zanList.map(z =>
              '<div class="zan-item' + (z.hasData ? '' : ' zan-empty') + '">' +
                '<div class="zan-item-header">' +
                  '<div class="zan-item-name">' + z.name + '</div>' +
                  '<div class="zan-item-tags">' +
                    '<span class="tag tag-gold">' + z.wuxing + '</span>' +
                    '<span class="tag ' + (z.xiuJiu === '休' ? 'tag-jade' : 'tag-vermilion') + '">' + z.xiuJiu + '</span>' +
                    '<span class="tag tag-gold">' + z.dayNight + '</span>' +
                    '<span class="tag tag-gold">' + z.biaoType + '</span>' +
                  '</div>' +
                '</div>' +
                '<div class="zan-item-sub">' + z.subName + ' · ' + z.category + z.level + '</div>' +
                (z.hasData
                  ? '<div class="zan-item-ci"><span class="zan-ci-label">辞：</span><span class="zan-ci-text">' + (z.ci || '(赞辞待补)') + '</span></div>' +
                    (z.ce ? '<div class="zan-item-ce"><span class="zan-ce-label">测：</span><span class="zan-ce-text">' + z.ce + '</span></div>' : '')
                  : '<div class="zan-item-pending"><span>赞辞待补</span></div>') +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>' +

        '<div class="nav-bar">' +
          '<div class="nav-btn' + (index <= 1 ? ' disabled' : '') + '" id="nav-prev"><span>上一首</span></div>' +
          '<div class="nav-index">' + index + ' / 81</div>' +
          '<div class="nav-btn' + (index >= 81 ? ' disabled' : '') + '" id="nav-next"><span>下一首</span></div>' +
        '</div>'

      this.shouIndex = index
      if (this.annotations.length > 0) {
        this.renderAnnotTabs()
        this.renderAnnotPanels()
      }
    },

    renderAnnotTabs() {
      const box = this.$('#annot-tabs-box')
      if (!box) return
      box.innerHTML = this.annotations.map((a, i) =>
        '<div class="annot-tab' + (this.activeAnnotator === i ? ' active' : '') + '" data-annot-idx="' + i + '">' +
          '<span class="annot-tab-era">' + a.era + '</span>' +
          '<span class="annot-tab-name">' + a.name + '</span>' +
        '</div>'
      ).join('')
    },

    renderAnnotPanels() {
      const box = this.$('#annot-content')
      if (!box) return
      const a = this.annotations[this.activeAnnotator]
      if (!a) { box.innerHTML = ''; return }
      box.innerHTML =
        '<div class="annot-panel active">' +
          '<div class="annot-source">' + a.source + '</div>' +
          (a.quote
            ? '<div class="annot-quote"><span class="quote-label">原文</span><span class="quote-text">' + a.quote + '</span></div>'
            : '') +
          '<div class="annot-gloss"><span class="gloss-text">' + a.gloss + '</span></div>' +
          '<div class="annot-loc">辑自' + a.loc + '</div>' +
        '</div>'
    },

    goToPrev() { if (this.shouIndex > 1) this.loadShou(this.shouIndex - 1) },
    goToNext() { if (this.shouIndex < 81) this.loadShou(this.shouIndex + 1) }
  }
})()
