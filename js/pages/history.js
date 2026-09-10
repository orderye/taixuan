// js/pages/history.js - 历史记录页（对应 pages/history）
(function () {
  'use strict'

  TXPages.history = {
    title: '卜卦记录',
    isTab: true,

    render() {
      return '<div class="container fade-in"><div id="history-root"></div></div>'
    },

    onLoad() {
      this.el.addEventListener('click', (e) => {
        if (e.target.closest('#go-divine')) return TXApp.switchTab('divine')

        if (e.target.closest('#clear-btn')) return this.clearAll()

        const del = e.target.closest('[data-del-id]')
        if (del) {
          e.stopPropagation()
          return this.deleteRecord(del.dataset.delId)
        }

        const card = e.target.closest('[data-record-id]')
        if (card) {
          const record = TXApp.globalData.history.find(r => r.id === card.dataset.recordId)
          if (record) {
            TXApp.globalData.currentResult = record
            TXApp.navigateTo('result', { from: 'history' })
          }
        }
      })
    },

    onShow() {
      this.renderList()
    },

    renderList() {
      const records = TXApp.globalData.history
      const root = this.$('#history-root')

      if (records.length === 0) {
        root.innerHTML =
          '<div class="empty-state">' +
            '<div class="empty-icon-wrap"><span class="empty-icon-char">卦</span></div>' +
            '<span class="empty-title">尚无卜卦记录</span>' +
            '<span class="empty-desc">起卦占筮后，记录将显示于此</span>' +
            '<div class="empty-action" id="go-divine"><span>前往卜卦</span></div>' +
          '</div>'
        return
      }

      root.innerHTML =
        '<div class="history-list">' +
          '<div class="list-header">' +
            '<span class="list-count">共 ' + records.length + ' 条记录</span>' +
            '<span class="clear-btn" id="clear-btn">清空</span>' +
          '</div>' +
          records.map(r =>
            '<div class="record-card" data-record-id="' + r.id + '">' +
              '<div class="record-main">' +
                '<div class="record-shou">' +
                  '<span class="record-shou-name">' + r.shouName + '</span>' +
                  '<span class="record-zan-name">' + r.zanName + '</span>' +
                '</div>' +
                '<div class="record-info">' +
                  '<span class="record-question">' + this.esc(r.question) + '</span>' +
                  '<div class="record-tags">' +
                    '<span class="tag tag-gold">' + r.shouXuan + '</span>' +
                    '<span class="tag ' + (r.zanXiuJiu === '休' ? 'tag-jade' : 'tag-vermilion') + '">' + r.zanXiuJiu + '</span>' +
                    '<span class="tag tag-gold">' + r.fortuneLevel + '</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="record-footer">' +
                '<span class="record-time">' + r.timeStr + '</span>' +
                '<span class="record-method">' + r.methodText + '</span>' +
                '<span class="record-delete" data-del-id="' + r.id + '">删</span>' +
              '</div>' +
            '</div>'
          ).join('') +
        '</div>'
    },

    deleteRecord(id) {
      TXApp.showModal({
        title: '删除记录',
        content: '确定删除此条卜卦记录？',
        success: (res) => {
          if (res.confirm) {
            TXApp.globalData.history = TXApp.globalData.history.filter(r => r.id !== id)
            TXApp.persistHistory()
            this.renderList()
          }
        }
      })
    },

    clearAll() {
      if (TXApp.globalData.history.length === 0) return
      TXApp.showModal({
        title: '清空记录',
        content: '确定清空全部卜卦记录？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            TXApp.clearHistory()
            this.renderList()
          }
        }
      })
    }
  }
})()
