// js/pages/index.js - 首页（对应 pages/index）
(function () {
  'use strict'

  TXPages.index = {
    title: '谁能书阁下',
    isTab: true,

    render(params, inst) {
      const todayStr = TaixuanUtil.formatLunar(new Date())
      return (
        '<div class="container fade-in">' +

        '<div class="hero">' +
          '<img class="hero-bg-image" src="assets/images/hero-bg.jpg" alt="">' +
          '<div class="hero-bg-overlay"></div>' +
          '<div class="hero-decoration hero-deco-left"></div>' +
          '<div class="hero-decoration hero-deco-right"></div>' +
          '<div class="hero-content">' +
            '<div class="hero-eyebrow">扬雄 · 西汉</div>' +
            '<div class="hero-title">太玄经</div>' +
            '<div class="hero-divider">' +
              '<div class="hero-divider-line"></div>' +
              '<div class="hero-divider-dot"></div>' +
              '<div class="hero-divider-line"></div>' +
            '</div>' +
            '<div class="hero-quote">"观大易之损益兮，览老氏之倚伏"</div>' +
            '<div class="hero-date">' + todayStr + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="entry-grid">' +
          '<div class="entry-card" data-act="goDivine">' +
            '<div class="entry-card-inner">' +
              '<div class="entry-seal"><span class="entry-seal-char">卜</span></div>' +
              '<div class="entry-info">' +
                '<span class="entry-title">起卦占筮</span>' +
                '<span class="entry-desc">揲蓍法 · 硬币法</span>' +
              '</div>' +
              '<div class="entry-arrow">›</div>' +
            '</div>' +
          '</div>' +
          '<div class="entry-card" data-act="goBrowse">' +
            '<div class="entry-card-inner">' +
              '<div class="entry-seal"><span class="entry-seal-char">览</span></div>' +
              '<div class="entry-info">' +
                '<span class="entry-title">浏览经文</span>' +
                '<span class="entry-desc">天玄 · 地玄 · 人玄</span>' +
              '</div>' +
              '<div class="entry-arrow">›</div>' +
            '</div>' +
          '</div>' +
          '<div class="entry-card" data-act="goHistory">' +
            '<div class="entry-card-inner">' +
              '<div class="entry-seal"><span class="entry-seal-char">录</span></div>' +
              '<div class="entry-info">' +
                '<span class="entry-title">卜卦记录</span>' +
                '<span class="entry-desc">查看历史占筮</span>' +
              '</div>' +
              '<div class="entry-arrow">›</div>' +
            '</div>' +
          '</div>' +
          '<div class="entry-card" data-act="goAbout">' +
            '<div class="entry-card-inner">' +
              '<div class="entry-seal"><span class="entry-seal-char">源</span></div>' +
              '<div class="entry-info">' +
                '<span class="entry-title">关于太玄</span>' +
                '<span class="entry-desc">源流与说明</span>' +
              '</div>' +
              '<div class="entry-arrow">›</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="stats-bar">' +
          '<div class="stat-item"><span class="stat-num">81</span><span class="stat-label">首</span></div>' +
          '<div class="stat-divider"></div>' +
          '<div class="stat-item"><span class="stat-num">729</span><span class="stat-label">赞</span></div>' +
          '<div class="stat-divider"></div>' +
          '<div class="stat-item"><span class="stat-num">3</span><span class="stat-label">玄</span></div>' +
          '<div class="stat-divider"></div>' +
          '<div class="stat-item"><span class="stat-num">6</span><span class="stat-label">揲</span></div>' +
        '</div>' +

        '<div class="recent-section" id="recent-section"></div>' +

        '</div>'
      )
    },

    onLoad() {
      this.el.addEventListener('click', (e) => {
        const actEl = e.target.closest('[data-act]')
        if (!actEl) return
        const act = actEl.dataset.act
        if (act === 'goDivine') TXApp.switchTab('divine')
        else if (act === 'goBrowse') TXApp.switchTab('browse')
        else if (act === 'goHistory') TXApp.switchTab('history')
        else if (act === 'goAbout') TXApp.navigateTo('about')
        else if (act === 'viewResult') {
          const record = TXApp.globalData.history.find(r => r.id === actEl.dataset.id)
          if (record) {
            TXApp.globalData.currentResult = record
            TXApp.navigateTo('result', { from: 'history' })
          }
        }
      })
    },

    onShow() {
      this.renderRecent()
    },

    // 最近卜卦 / 空状态（每次显示时刷新）
    renderRecent() {
      const section = this.$('#recent-section')
      const recent = TXApp.globalData.history.slice(0, 3)

      if (recent.length > 0) {
        section.innerHTML =
          '<div class="section-title-with-deco">' +
            '<div class="section-deco-line"></div>' +
            '<span class="section-deco-text">最近卜卦</span>' +
            '<div class="section-deco-line"></div>' +
          '</div>' +
          '<div class="recent-list">' +
            recent.map(r =>
              '<div class="recent-item" data-act="viewResult" data-id="' + r.id + '">' +
                '<div class="recent-left">' +
                  '<span class="recent-shou-name">' + r.shouName + '</span>' +
                  '<span class="recent-zan-name">' + r.zanName + '</span>' +
                '</div>' +
                '<div class="recent-right">' +
                  '<span class="recent-question">' + this.esc(r.question) + '</span>' +
                  '<span class="recent-time">' + r.timeStr + '</span>' +
                '</div>' +
                '<div class="recent-arrow">›</div>' +
              '</div>'
            ).join('') +
          '</div>'
      } else {
        section.innerHTML =
          '<div class="empty-history">' +
            '<div class="empty-icon">' +
              '<div class="empty-coin coin-1"></div>' +
              '<div class="empty-coin coin-2"></div>' +
              '<div class="empty-coin coin-3"></div>' +
            '</div>' +
            '<span class="empty-history-text">尚未卜卦</span>' +
            '<span class="empty-history-sub">点击"起卦占筮"开始</span>' +
          '</div>'
      }
    }
  }
})()
