// js/pages/divine.js - 卜卦页（对应 pages/divine，含自动类型检测）
(function () {
  'use strict'

  const ROUND_LABELS = ['方', '州', '部', '家', '赞·高位', '赞·低位']
  const ROUND_INTERVAL = 800

  function freshState() {
    return {
      mode: 'single',
      activeCategory: 'career',
      selectedTypeIds: [],
      selectedTypes: [],
      compositeName: '',
      maxSelection: 1,
      method: 'coins',
      question: '',
      conversationText: '',
      conversationReady: false,
      autoHint: '',
      manuallySelected: false,
      isDivining: false,
      currentRound: -1,
      rounds: []
    }
  }

  TXPages.divine = {
    title: '卜卦',
    isTab: true,

    render() {
      this.S = freshState()
      const S = this.S

      const modeBtn = (key, title, l1, l2) =>
        '<div class="mode-btn' + (S.mode === key ? ' active' : '') + '" data-mode="' + key + '">' +
          '<span class="mode-title">' + title + '</span>' +
          '<div class="mode-desc">' +
            '<span class="md-line">' + l1 + '</span>' +
            '<span class="md-line">' + l2 + '</span>' +
          '</div>' +
        '</div>'

      return (
        '<div class="container fade-in">' +

        '<div id="init-block">' +

          '<div class="init-section card">' +
            '<div class="section-title">占测模式</div>' +
            '<div class="mode-toggle">' +
              modeBtn('single', '单项占测', '选1个类型', '专注一事一问') +
              modeBtn('composite', '复合占测', '选2个类型', '交叉推演') +
              modeBtn('conversation', '会话占测', '输入一段话', '自动归类') +
            '</div>' +
          '</div>' +

          '<div class="conversation-section card" id="conv-section" style="display:none">' +
            '<div class="conv-head">' +
              '<div class="section-title">会话内容</div>' +
              '<span class="conv-test-tag">测试</span>' +
            '</div>' +
            '<textarea class="conv-input" id="conv-input" placeholder="说出你心中的困惑，用汉字描述……（20字以内）" maxlength="20"></textarea>' +
            '<div class="conv-footer">' +
              '<span class="conv-count" id="conv-count">0/20</span>' +
              '<span class="conv-tip">限汉字输入，将据此匹配预测类型</span>' +
            '</div>' +
          '</div>' +

          '<div id="type-template">' +
            '<div class="category-tabs" id="cat-tabs"></div>' +
            '<div class="type-grid" id="type-grid"></div>' +
            '<div id="preset-block"></div>' +
            '<div class="selection-summary card" id="selection-summary" style="display:none"></div>' +
          '</div>' +

          '<div class="config-section card">' +
            '<div class="section-title">起卦配置</div>' +
            '<div class="config-row">' +
              '<span class="config-label">方法</span>' +
              '<div class="method-toggle">' +
                '<div class="method-btn active" data-method="coins">硬币法</div>' +
                '<div class="method-btn" data-method="sticks">揲蓍法</div>' +
              '</div>' +
            '</div>' +
            '<div class="config-row" id="question-row">' +
              '<span class="config-label">所问</span>' +
              '<input class="config-input" id="question-input" placeholder="默念所问之事，输入于此……（可不填）" maxlength="100">' +
            '</div>' +
            '<div class="intent-hint" id="intent-hint" style="display:none">' +
              '<span class="ih-tag">自动识别</span>' +
              '<span class="ih-text" id="intent-hint-text"></span>' +
            '</div>' +
          '</div>' +

          '<div class="start-section">' +
            '<button class="btn-primary" id="start-btn">开始卜卦</button>' +
            '<div class="start-hint" id="start-hint"></div>' +
          '</div>' +

        '</div>' +

        '<div class="divining-section" id="divining-section" style="display:none">' +
          '<div class="divining-header">' +
            '<div class="divining-title">六揲定卦</div>' +
            '<div class="divining-subtitle" id="divining-subtitle"></div>' +
          '</div>' +
          '<div class="rounds-list" id="rounds-list"></div>' +
          '<div class="divining-indicator" id="divining-indicator" style="display:none">' +
            '<div class="indicator-dot"></div>' +
            '<div class="indicator-dot"></div>' +
            '<div class="indicator-dot"></div>' +
          '</div>' +
        '</div>' +

        '</div>'
      )
    },

    onLoad() {
      this.renderCatTabs()
      this.renderTypeGrid()
      this.renderPresets()
      this.updateModeView()
      this.updateStartState()
      this.bindEvents()
    },

    bindEvents() {
      const S = this.S

      this.el.addEventListener('click', (e) => {
        const modeBtn = e.target.closest('[data-mode]')
        if (modeBtn) return this.selectMode(modeBtn.dataset.mode)

        const catTab = e.target.closest('[data-cat]')
        if (catTab) {
          S.activeCategory = catTab.dataset.cat
          this.renderCatTabs()
          this.renderTypeGrid()
          return
        }

        const typeCard = e.target.closest('[data-type-id]')
        if (typeCard) return this.toggleType(parseInt(typeCard.dataset.typeId, 10))

        const preset = e.target.closest('[data-preset]')
        if (preset) {
          const ids = preset.dataset.preset.split(',').map(n => parseInt(n, 10))
          S.manuallySelected = true
          return this.updateSelections(ids)
        }

        const methodBtn = e.target.closest('[data-method]')
        if (methodBtn && !S.isDivining) {
          S.method = methodBtn.dataset.method
          this.$$('.method-btn').forEach(b => b.classList.toggle('active', b.dataset.method === S.method))
          return
        }

        if (e.target.closest('#start-btn')) return this.startDivine()
      })

      this.$('#conv-input').addEventListener('input', (e) => {
        const text = (e.target.value || '').replace(/[^\u4e00-\u9fa5]/g, '').slice(0, 20)
        e.target.value = text
        S.conversationText = text
        S.conversationReady = text.length > 0
        this.$('#conv-count').textContent = text.length + '/20'
        this.$('#conv-count').classList.toggle('ready', text.length > 0)
        this.updateStartState()
      })

      this.$('#question-input').addEventListener('input', (e) => {
        S.question = e.target.value
        // 单项模式：匹配改为起卦时后台执行，前端不展示；复合模式保持实时识别
        if (S.mode !== 'single') {
          this.autoDetectType(S.question)
        } else if (S.autoHint) {
          S.autoHint = ''
          this.renderIntentHint()
        }
        this.updateStartState()
      })
    },

    // ============ 模式选择 ============
    selectMode(mode) {
      const S = this.S
      if (S.isDivining) return
      S.mode = mode
      S.selectedTypeIds = []
      S.selectedTypes = []
      S.compositeName = ''
      S.autoHint = ''
      S.manuallySelected = false
      S.conversationText = ''
      S.conversationReady = false
      S.maxSelection = mode === 'composite' ? 2 : 1

      // 重置会话输入框
      const convInput = this.$('#conv-input')
      convInput.value = ''
      this.$('#conv-count').textContent = '0/20'
      this.$('#conv-count').classList.remove('ready')

      this.$$('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode))
      this.renderTypeGrid()
      this.renderPresets()
      this.renderSummary()
      this.renderIntentHint()
      this.updateModeView()
      this.updateStartState()
    },

    // 会话区 / 类型模板显隐
    updateModeView() {
      const S = this.S
      this.$('#conv-section').style.display = S.mode === 'conversation' ? '' : 'none'
      this.$('#type-template').style.display = S.mode === 'conversation' ? 'none' : ''
      this.$('#question-row').style.display = S.mode === 'conversation' ? 'none' : ''
    },

    // ============ 类型选择 ============
    renderCatTabs() {
      const S = this.S
      this.$('#cat-tabs').innerHTML = TaixuanTypes.CATEGORIES.map(c =>
        '<div class="cat-tab' + (S.activeCategory === c.id ? ' active' : '') + '" data-cat="' + c.id + '">' + c.name + '</div>'
      ).join('')
    },

    renderTypeGrid() {
      const S = this.S
      const cat = TaixuanTypes.CATEGORIES.find(c => c.id === S.activeCategory)
      this.$('#type-grid').innerHTML = (cat ? cat.types : []).map(t => {
        const sel = S.selectedTypeIds.indexOf(t.id)
        const cls = 'type-card' + (sel >= 0 ? ' selected' : '') + (sel < 0 && S.selectedTypeIds.length >= S.maxSelection ? ' disabled' : '')
        return (
          '<div class="' + cls + '" data-type-id="' + t.id + '">' +
            '<span class="tc-check">✓</span>' +
            (sel >= 0 ? '<span class="tc-order">' + (sel + 1) + '</span>' : '') +
            '<div class="tc-num">No.' + (t.id < 10 ? '0' + t.id : t.id) + '</div>' +
            '<div class="tc-name">' + t.name + '</div>' +
            '<div class="tc-desc">' + t.desc + '</div>' +
          '</div>'
        )
      }).join('')
    },

    renderPresets() {
      const S = this.S
      const block = this.$('#preset-block')
      if (S.mode !== 'composite') {
        block.innerHTML = ''
        return
      }
      block.innerHTML =
        '<div class="section-title preset-title">复合场景库</div>' +
        '<div class="preset-grid">' +
          TaixuanTypes.COMPOSITE_PRESETS.map(p => {
            const isSelected = S.selectedTypeIds.length === 2 &&
              S.selectedTypeIds.indexOf(p.typeIds[0]) >= 0 &&
              S.selectedTypeIds.indexOf(p.typeIds[1]) >= 0
            return (
              '<div class="preset-card' + (isSelected ? ' selected' : '') + '" data-preset="' + p.typeIds[0] + ',' + p.typeIds[1] + '">' +
                '<div class="pc-num">' + p.id + '</div>' +
                '<div class="pc-body">' +
                  '<div class="pc-name">' + p.name + '</div>' +
                  '<div class="pc-desc">' + p.desc + '</div>' +
                '</div>' +
              '</div>'
            )
          }).join('') +
        '</div>'
    },

    toggleType(id) {
      const S = this.S
      const ids = S.selectedTypeIds.slice()
      const idx = ids.indexOf(id)
      if (idx >= 0) {
        ids.splice(idx, 1)
      } else {
        if (ids.length >= S.maxSelection) ids.shift()
        ids.push(id)
      }
      S.manuallySelected = true
      this.updateSelections(ids)
    },

    updateSelections(ids) {
      const S = this.S
      S.selectedTypeIds = ids
      S.selectedTypes = ids.map(id => TaixuanTypes.getTypeById(id))
      S.compositeName = ids.length === 2 ? TaixuanTypes.getCompositeName(ids) : ''
      this.renderTypeGrid()
      this.renderPresets()
      this.renderSummary()
      this.updateStartState()
    },

    renderSummary() {
      const S = this.S
      const box = this.$('#selection-summary')
      if (S.selectedTypeIds.length === 0) {
        box.style.display = 'none'
        return
      }
      box.style.display = ''
      box.innerHTML =
        '<div class="ss-mode-tag' + (S.mode === 'composite' ? ' composite' : '') + '">' + (S.mode === 'single' ? '单项' : '复合') + '</div>' +
        '<div class="ss-chips">' +
          S.selectedTypes.map(t => '<span class="ss-chip">' + t.name + '</span>').join('') +
          (S.compositeName ? '<span class="ss-chip composite-name">' + S.compositeName + '</span>' : '') +
        '</div>'
    },

    // ============ 自动类型识别 ============
    renderIntentHint() {
      const S = this.S
      const hint = this.$('#intent-hint')
      if (S.autoHint) {
        hint.style.display = ''
        this.$('#intent-hint-text').textContent = S.autoHint
      } else {
        hint.style.display = 'none'
      }
    },

    autoDetectType(text) {
      const S = this.S
      const textTrim = (text || '').trim()
      if (!textTrim || S.isDivining) {
        if (S.autoHint) { S.autoHint = ''; this.renderIntentHint() }
        return
      }
      // 用户已手动选过类型时不自动代填，避免覆盖其选择
      if (S.manuallySelected) return
      const matches = IntentDict.matchTypes(textTrim)
      if (matches.length === 0) {
        if (S.autoHint) { S.autoHint = ''; this.renderIntentHint() }
        return
      }
      const limit = S.maxSelection
      const ids = matches.slice(0, limit).map(m => m.id)
      const names = ids.map(id => TaixuanTypes.getTypeById(id).name)
      this.updateSelections(ids)
      S.autoHint = names.join(' + ')
      this.renderIntentHint()
    },

    // 会话关键词匹配（后台运行，前端不展示）：取最匹配两个；无命中则流年大运兜底
    matchByConversation(text) {
      const matches = IntentDict.matchTypes(text || '')
      if (matches.length === 0) return [32]
      return matches.slice(0, 2).map(m => m.id)
    },

    // ============ 开始按钮状态 ============
    canStartDivine() {
      const S = this.S
      if (S.mode === 'conversation') return S.conversationReady
      if (S.mode === 'single') {
        return S.selectedTypeIds.length === 1 || !!(S.question || '').trim()
      }
      return S.selectedTypeIds.length === S.maxSelection
    },

    startHintText() {
      const S = this.S
      if (S.mode === 'conversation') return '请输入会话内容'
      if (S.mode === 'single') return '请选择1个预测类型或填写所问'
      return '请选择' + S.maxSelection + '个预测类型'
    },

    updateStartState() {
      const ok = this.canStartDivine()
      this.$('#start-btn').disabled = !ok
      this.$('#start-hint').textContent = ok ? '' : this.startHintText()
    },

    // ============ 起卦执行 ============
    startDivine() {
      const S = this.S
      if (S.isDivining || !this.canStartDivine()) return

      S.isDivining = true
      S.currentRound = -1
      S.rounds = []

      const seedText = S.mode === 'conversation' ? S.conversationText : S.question
      const rng = seedText
        ? TaixuanEngine.seededRNG(TaixuanEngine.seedFromString(seedText + Date.now()))
        : null

      const rawResult = S.method === 'sticks'
        ? TaixuanEngine.divineBySticks(rng || undefined)
        : TaixuanEngine.divineByCoins(rng || undefined)

      S.rounds = rawResult.meta.rounds.map((r, i) => ({
        round: i + 1,
        label: ROUND_LABELS[i],
        value: r.value,
        valueText: ['一', '二', '三'][r.value - 1],
        coinsText: r.coins ? r.coins.map(c => c ? '阳' : '阴') : null
      }))

      // 切换到卜卦过程视图
      this.$('#init-block').style.display = 'none'
      this.$('#divining-section').style.display = ''
      this.$('#divining-subtitle').textContent =
        (S.method === 'sticks' ? '揲蓍法' : '硬币法') + ' · ' + (seedText || '心诚则灵')
      this.renderRounds()

      let roundIdx = 0
      const animateNext = () => {
        if (roundIdx >= S.rounds.length) {
          this.finishDivine(rawResult)
          return
        }
        S.currentRound = roundIdx
        this.renderRounds()
        roundIdx++
        setTimeout(animateNext, ROUND_INTERVAL)
      }
      animateNext()
    },

    renderRounds() {
      const S = this.S
      this.$('#rounds-list').innerHTML = S.rounds.map((r, i) => {
        const cls = 'round-item' + (S.currentRound >= i ? ' active' : '') + (S.currentRound === i ? ' current' : '')
        return (
          '<div class="' + cls + '">' +
            '<div class="round-num">' + r.round + '</div>' +
            '<div class="round-content">' +
              '<div class="round-label">' + r.label + '</div>' +
              (S.currentRound >= i
                ? '<div class="round-result">' +
                    '<span class="round-value">' + r.valueText + '</span>' +
                    (r.coinsText
                      ? '<div class="round-coins">' +
                          r.coinsText.map(c => '<span class="coin-tag ' + (c === '阳' ? 'coin-yang' : 'coin-yin') + '">' + c + '</span>').join('') +
                        '</div>'
                      : '') +
                  '</div>'
                : '<div class="round-pending"><span class="pending-dots">···</span></div>') +
            '</div>' +
          '</div>'
        )
      }).join('')

      const indicator = this.$('#divining-indicator')
      indicator.style.display = (S.currentRound >= 0 && S.currentRound < 6) ? '' : 'none'
    },

    finishDivine(rawResult) {
      const S = this.S
      const shouInfo = rawResult.shou
      const zanInfo = rawResult.zan
      const fortune = TaixuanEngine.judgeFortune(rawResult)
      const zanCi = TaixuanData.getZanCi(shouInfo.index, zanInfo.position)
      const zanCe = TaixuanData.getZanCe(shouInfo.index, zanInfo.position)
      const shouCi = TaixuanData.getShouCi(shouInfo.index)

      const isConv = S.mode === 'conversation'
      // 类型归属：会话占测 → 会话匹配；单项占测 → 手选优先，否则起卦时后台匹配所问 Top1；复合 → 用户所选
      let typeIds
      if (isConv) {
        typeIds = this.matchByConversation(S.conversationText)
      } else if (S.mode === 'single') {
        if (S.selectedTypeIds.length === 1) {
          typeIds = S.selectedTypeIds
        } else if ((S.question || '').trim()) {
          const matches = IntentDict.matchTypes(S.question)
          typeIds = matches.length > 0 ? [matches[0].id] : []
        } else {
          typeIds = []
        }
      } else {
        typeIds = S.selectedTypeIds
      }

      const record = {
        id: TaixuanUtil.generateId('div'),
        time: Date.now(),
        timeStr: TaixuanUtil.formatTime(new Date(), 'MM-DD HH:mm'),
        question: isConv ? S.conversationText : (S.question || '(无问)'),
        method: S.method,
        methodText: S.method === 'sticks' ? '揲蓍法' : '硬币法',
        mode: S.mode,
        modeText: isConv ? '会话占测' : (S.mode === 'single' ? '单项占测' : '复合占测'),
        selectedTypeIds: typeIds,
        selectedTypeNames: typeIds.map(id => TaixuanTypes.getTypeById(id).name),
        compositeName: S.compositeName,
        typeInterpretations: typeIds.map(id => TaixuanTypes.getTypeInterpretation(id, fortune.level)),
        shouName: shouInfo.name,
        shouIndex: shouInfo.index,
        shouXuan: shouInfo.xuan,
        shouYinYang: shouInfo.yinYang,
        shouPosition: shouInfo.position,
        shouCi: shouCi,
        zanName: zanInfo.name,
        zanPosition: zanInfo.position,
        zanWuxing: zanInfo.wuxing,
        zanDayNight: zanInfo.dayNight,
        zanXiuJiu: zanInfo.xiuJiu,
        zanCi: zanCi,
        zanCe: zanCe,
        biaoType: rawResult.biao.type,
        fortuneLevel: fortune.level,
        fortuneDesc: fortune.desc,
        fortunePattern: fortune.pattern,
        rounds: S.rounds,
        fourFactors: rawResult.fourFactors,
        symbol: shouInfo.symbol
      }

      TXApp.globalData.currentResult = record
      TXApp.saveHistory(record)

      TXApp.navigateTo('result', {})

      // 复位为初始化视图，返回时可直接再占
      // （替换 el 节点，避免旧节点上的监听器叠加）
      setTimeout(() => {
        const parent = this.el.parentNode
        const newEl = document.createElement('div')
        newEl.className = 'page-container'
        parent.insertBefore(newEl, this.el)
        parent.removeChild(this.el)
        this.el = newEl
        this.S = freshState()
        newEl.innerHTML = this.render({})
        this.onLoad()
      }, 100)
    }
  }
})()
