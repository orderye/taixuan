// js/pages/about.js - 关于页（对应 pages/about）
(function () {
  'use strict'

  TXPages.about = {
    title: '关于太玄',

    render() {
      const items = [
        { title: '源流', content: '《太玄经》，西汉扬雄（字子云）仿《周易》而作，凡三篇、八十一首、七百二十九赞。以三方、九州、二十七部、八十一家为本，取三进制以别于《易》之二进制。' },
        { title: '结构', content: '一首九赞，九赞分三组：经（1,5,7）、纬（3,4,8）、杂（2,6,9）。旦筮用经，夕筮用纬，中筮用杂。方州部家各一揲定首，再两揲定赞，合六揲而成卦。' },
        { title: '筮法', content: '揲蓍法取三十三策，别一挂小指，中分其余，以三搜之，两揲而得七八九，映射一二三。硬币法以三枚铜钱代之，阳数合数定值，概率近似揲蓍。' },
        { title: '吉凶', content: '逢昼为从（吉），逢夜为违（凶）。三表各三赞，依从违格局定吉凶等次：三从为大休，三违为大咎，余为始中终之休咎。' }
      ]

      const annotators = [
        { name: '范望', era: '晋', source: '范望《太玄经解赞》', desc: '晋代范望注，最早系统注释《太玄经》者之一，训诂与义理并重。' },
        { name: '司马光', era: '宋', source: '司马光《集注太玄经》', desc: '北宋司马光集注，汇集前人说而加以己见，为太玄经注疏集大成之作。' },
        { name: '胡次和', era: '宋', source: '胡次和《太玄经注》', desc: '宋代胡次和注，参校诸本，考订异文，补充范望所未及。' },
        { name: '叶子奇', era: '明', source: '叶子奇《太玄本旨》', desc: '明代叶子奇著，以理学释玄，强调太玄与易之相通。' },
        { name: '陈本礼', era: '清', source: '陈本礼《太玄阐秘》', desc: '清代陈本礼撰，融汇汉宋，阐发太玄象数秘旨。' }
      ]

      const sources = '本程序依据扬雄《太玄经》原著，参校司马光《集注太玄经》、黄宗羲《易学象数论·太玄蓍法》。五家注释辑自识典古籍等文献，首一、首二含完整赞辞测辞。'

      return (
        '<div class="container fade-in">' +

        '<div class="about-hero">' +
          '<div class="about-title">太玄经卜卦</div>' +
          '<div class="about-subtitle">程序化占筮实现</div>' +
        '</div>' +

        '<div class="about-list">' +
          items.map(it =>
            '<div class="about-item card">' +
              '<div class="about-item-title">' + it.title + '</div>' +
              '<div class="about-item-content">' + it.content + '</div>' +
            '</div>'
          ).join('') +
        '</div>' +

        '<div class="annotators-section">' +
          '<div class="section-title">五家注者</div>' +
          '<div class="annotators-list">' +
            annotators.map(a =>
              '<div class="annotator-card card">' +
                '<div class="annotator-header">' +
                  '<span class="annotator-era">' + a.era + '</span>' +
                  '<span class="annotator-name">' + a.name + '</span>' +
                '</div>' +
                '<div class="annotator-source">' + a.source + '</div>' +
                '<div class="annotator-desc">' + a.desc + '</div>' +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>' +

        '<div class="sources-section card">' +
          '<div class="about-item-title">引用</div>' +
          '<div class="about-item-content">' + sources + '</div>' +
        '</div>' +

        '<div class="about-footer">' +
          '<span class="footer-text">— 诚则灵 —</span>' +
        '</div>' +

        '</div>'
      )
    }
  }
})()
