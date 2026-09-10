// js/pages/browse.js - 浏览81首（对应 pages/browse，三玄切换 + 搜索）
(function () {
  'use strict'

  TXPages.browse = {
    title: '白首太玄经',
    isTab: true,

    render() {
      this.activeTabIdx = 0
      return (
        '<div class="container fade-in">' +

        '<div class="search-bar">' +
          '<div class="search-input-wrap">' +
            '<span class="search-icon">搜</span>' +
            '<input class="search-input" id="search-input" placeholder="搜索首名或首辞">' +
          '</div>' +
        '</div>' +

        '<div class="search-results" id="search-results" style="display:none"></div>' +

        '<div class="browse-mode" id="browse-mode">' +
          '<div class="xuan-tabs" id="xuan-tabs"></div>' +
          '<div id="xuan-content"></div>' +
        '</div>' +

        '</div>'
      )
    },

    onLoad() {
      this.renderTabs()
      this.loadGroup(0)

      this.el.addEventListener('click', (e) => {
        const tab = e.target.closest('[data-tab-idx]')
        if (tab) {
          this.loadGroup(parseInt(tab.dataset.tabIdx, 10))
          return
        }
        const card = e.target.closest('[data-shou-index]')
        if (card) {
          TXApp.navigateTo('detail', { index: card.dataset.shouIndex })
        }
      })

      this.$('#search-input').addEventListener('input', (e) => {
        this.onSearch(e.target.value.trim())
      })
    },

    renderTabs() {
      this.$('#xuan-tabs').innerHTML = TaixuanEngine.SAN_XUAN.map((xuanName, i) =>
        '<div class="xuan-tab' + (this.activeTabIdx === i ? ' active' : '') + '" data-tab-idx="' + i + '">' + xuanName + '</div>'
      ).join('')
    },

    loadGroup(tabIndex) {
      this.activeTabIdx = tabIndex
      this.renderTabs()

      const fang = tabIndex + 1
      const shouList = TaixuanData.getXuanGroup(fang).map(s => {
        const info = TaixuanEngine.getShouInfo(s.index)
        return {
          index: s.index,
          name: s.name,
          ci: s.ci,
          xuan: info.xuan,
          yinYang: info.yinYang,
          position: info.position,
          zhou: info.zhou,
          hasZan: s.zan && s.zan.length > 0
        }
      })

      const zhouGroups = []
      for (let z = 1; z <= 3; z++) {
        zhouGroups.push({
          zhou: z,
          zhouName: ['一州', '二州', '三州'][z - 1],
          shouList: shouList.filter(s => s.zhou === z)
        })
      }

      const startIndex = tabIndex * 27 + 1
      const group = {
        xuan: TaixuanEngine.SAN_XUAN[tabIndex],
        xuanShort: TaixuanEngine.SAN_XUAN[tabIndex].slice(0, 1),
        startIndex: startIndex,
        endIndex: startIndex + 26,
        zhouGroups: zhouGroups
      }

      this.$('#xuan-content').innerHTML =
        '<div class="xuan-info">' +
          '<div class="xuan-info-seal">' + group.xuanShort + '</div>' +
          '<div class="xuan-info-text">' +
            '<span class="xuan-info-name">' + group.xuan + '</span>' +
            '<span class="xuan-info-range">第' + group.startIndex + '首 ~ 第' + group.endIndex + '首 · 九首一州，共三州</span>' +
          '</div>' +
        '</div>' +
        group.zhouGroups.map(zg =>
          '<div class="zhou-group">' +
            '<div class="zhou-header">' +
              '<div class="zhou-title">' + group.xuan + ' · ' + zg.zhouName + '</div>' +
              '<div class="zhou-line"></div>' +
            '</div>' +
            '<div class="shou-grid">' +
              zg.shouList.map(s =>
                '<div class="shou-card" data-shou-index="' + s.index + '">' +
                  '<div class="shou-card-name">' + s.name + '</div>' +
                  '<div class="shou-card-index">第' + s.index + '首</div>' +
                  '<div class="shou-card-yinyang">' + s.yinYang + ' · ' + s.position + '</div>' +
                  '<div class="shou-card-ci">' + s.ci + '</div>' +
                  '<div class="shou-card-dot' + (s.hasZan ? ' dot-filled' : '') + '"></div>' +
                '</div>'
              ).join('') +
            '</div>' +
          '</div>'
        ).join('')
    },

    onSearch(key) {
      const resultsBox = this.$('#search-results')
      const browseBox = this.$('#browse-mode')

      if (!key) {
        resultsBox.style.display = 'none'
        browseBox.style.display = ''
        return
      }

      const allShou = TaixuanData.getAllShouNames()
      const results = allShou
        .filter(s => s.name.indexOf(key) >= 0 || s.ci.indexOf(key) >= 0 || String(s.index) === key)
        .map(s => {
          const info = TaixuanEngine.getShouInfo(s.index)
          return { index: s.index, name: s.name, xuan: info.xuan, yinYang: info.yinYang }
        })

      browseBox.style.display = 'none'
      resultsBox.style.display = ''

      resultsBox.innerHTML =
        '<div class="result-count">找到 ' + results.length + ' 首</div>' +
        '<div class="shou-grid">' +
          results.map(s =>
            '<div class="shou-card" data-shou-index="' + s.index + '">' +
              '<div class="shou-card-name">' + s.name + '</div>' +
              '<div class="shou-card-index">第' + s.index + '首</div>' +
              '<div class="shou-card-xuan">' + s.xuan + '</div>' +
            '</div>'
          ).join('') +
        '</div>' +
        (results.length === 0 ? '<div class="no-result"><span>未找到相关首</span></div>' : '')
    }
  }
})()
