// js/app.js - 核心框架：页面注册/路由/底部导航/返回栏/Toast/Modal/本地存储
// 页面模块通过 TXPages.<key> 自注册（见 js/pages/*.js），本文件提供运行时。
(function () {
  'use strict'

  const TXPages = (window.TXPages = {})

  // ============ 本地存储（对应小程序 wx.setStorageSync） ============
  const Storage = {
    KEY: 'divinationHistory',
    load() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY)) || []
      } catch (e) {
        return []
      }
    },
    save(list) {
      try {
        localStorage.setItem(this.KEY, JSON.stringify(list))
      } catch (e) { /* 隐私模式等场景忽略 */ }
    },
    remove() {
      try { localStorage.removeItem(this.KEY) } catch (e) { /* noop */ }
    }
  }

  // ============ HTML 转义 ============
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  const TXApp = {
    globalData: {
      currentResult: null,
      history: []
    },

    // 运行时状态
    _container: null,
    _tabBar: null,
    _backBar: null,
    _tabInstances: {},   // tab 页常驻实例 { tabKey: inst }
    _stack: [],          // 二级页实例栈
    _activeTab: null,    // 当前 tab key
    _instSeq: 0,

    // ============ 启动 ============
    start() {
      this._container = document.getElementById('page-container')
      this._tabBar = document.getElementById('tab-bar')
      this._backBar = document.getElementById('back-bar')

      this.globalData.history = Storage.load()

      // 底部导航
      this._tabBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-item')
        if (!btn) return
        this.switchTab(btn.dataset.key)
      })

      // 返回栏
      this._backBar.addEventListener('click', (e) => {
        if (e.target.closest('[data-act="goBack"]')) this.goBack()
      })

      // 禁止弹窗蒙层滚动穿透（简单处理）
      document.getElementById('tx-modal').addEventListener('touchmove', (e) => e.preventDefault())

      this.switchTab('index')
    },

    // ============ Tab 导航 ============
    switchTab(key) {
      const def = TXPages[key]
      if (!def || !def.isTab) return

      // 关闭全部二级页
      this._stack.forEach(inst => this._destroyInstance(inst))
      this._stack = []

      // 隐藏当前显示的实例
      if (this._current && this._current !== this._tabInstances[key]) {
        this._hideInstance(this._current)
      }

      let inst = this._tabInstances[key]
      if (!inst) {
        inst = this._createInstance(def, {})
        this._tabInstances[key] = inst
      }
      this._showInstance(inst)

      this._activeTab = key
      this._updateTabBar()
      this._backBar.style.display = 'none'
      this._tabBar.style.display = ''
    },

    // ============ 二级页导航（对应 wx.navigateTo） ============
    navigateTo(key, params) {
      const def = TXPages[key]
      if (!def) return
      const inst = this._createInstance(def, params || {})
      this._stack.push(inst)
      if (this._current) this._hideInstance(this._current)
      this._showInstance(inst)
      this._backBar.style.display = ''
      this._backBar.querySelector('.back-title').textContent = def.title || ''
      this._tabBar.style.display = 'none'
    },

    // ============ 返回（对应 wx.navigateBack） ============
    goBack() {
      const inst = this._stack.pop()
      if (!inst) return
      this._destroyInstance(inst)

      const prev = this._stack[this._stack.length - 1]
      if (prev) {
        this._showInstance(prev)
        this._backBar.querySelector('.back-title').textContent = prev.def.title || ''
      } else {
        const tabInst = this._tabInstances[this._activeTab]
        this._showInstance(tabInst)
        this._backBar.style.display = 'none'
        this._tabBar.style.display = ''
        this._updateTabBar()
      }
    },

    // 退回某个 tab（对应「navigateBack + switchTab」）
    goTab(key) {
      this.switchTab(key)
    },

    // ============ 实例管理 ============
    _createInstance(def, params) {
      // 实例以 def 为原型，页面方法内 this.renderXxx() 可直接调用
      const inst = Object.create(def)
      inst.def = def
      inst.params = params
      inst.id = 'p' + (++this._instSeq)
      inst.el = document.createElement('div')
      inst.el.className = 'page-container'
      inst.el.innerHTML = def.render(params, inst) || ''
      inst.$ = (sel) => inst.el.querySelector(sel)
      inst.$$ = (sel) => inst.el.querySelectorAll(sel)
      inst.esc = esc
      this._container.appendChild(inst.el)
      if (def.onLoad) def.onLoad.call(inst, params)
      return inst
    },

    _showInstance(inst) {
      inst.el.classList.add('active')
      this._current = inst
      if (inst.def.onShow) inst.def.onShow.call(inst)
      if (inst.def.title) document.title = inst.def.title
      inst.el.scrollTop = 0
      window.scrollTo(0, 0)
    },

    _hideInstance(inst) {
      inst.el.classList.remove('active')
      if (inst.def.onHide) inst.def.onHide.call(inst)
    },

    _destroyInstance(inst) {
      this._hideInstance(inst)
      if (inst.def.onUnload) inst.def.onUnload.call(inst)
      if (inst.el.parentNode) inst.el.parentNode.removeChild(inst.el)
      if (this._current === inst) this._current = null
    },

    _updateTabBar() {
      this._tabBar.querySelectorAll('.tab-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.key === this._activeTab)
      })
    },

    // ============ 历史记录（对应 app.js globalData） ============
    saveHistory(record) {
      this.globalData.history.unshift(record)
      if (this.globalData.history.length > 100) {
        this.globalData.history = this.globalData.history.slice(0, 100)
      }
      Storage.save(this.globalData.history)
    },

    persistHistory() {
      Storage.save(this.globalData.history)
    },

    clearHistory() {
      this.globalData.history = []
      Storage.remove()
    },

    // ============ Toast ============
    _toastTimer: null,
    showToast(msg, duration) {
      const el = document.getElementById('tx-toast')
      el.textContent = msg
      el.classList.add('show')
      clearTimeout(this._toastTimer)
      this._toastTimer = setTimeout(() => el.classList.remove('show'), duration || 1800)
    },

    // ============ Modal（对应 wx.showModal） ============
    showModal(opt) {
      const mask = document.getElementById('tx-modal')
      mask.innerHTML =
        '<div class="tx-modal">' +
          '<div class="tx-modal-title">' + esc(opt.title || '提示') + '</div>' +
          '<div class="tx-modal-content">' + esc(opt.content || '') + '</div>' +
          '<div class="tx-modal-btns">' +
            (opt.showCancel === false ? '' : '<button class="tx-modal-btn cancel">' + (opt.cancelText || '取消') + '</button>') +
            '<button class="tx-modal-btn confirm">' + (opt.confirmText || '确定') + '</button>' +
          '</div>' +
        '</div>'
      mask.classList.add('show')

      const close = () => mask.classList.remove('show')
      mask.querySelectorAll('.tx-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          close()
          if (opt.success) {
            opt.success({ confirm: btn.classList.contains('confirm'), cancel: btn.classList.contains('cancel') })
          }
        })
      })
    }
  }

  window.TXApp = TXApp
  window.TXPages = TXPages
})()
