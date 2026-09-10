(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim() || '#8b1a1a';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#4a5d6b';
  var ink = style.getPropertyValue('--ink').trim() || '#1a1815';
  var muted = style.getPropertyValue('--muted').trim() || '#6b6559';
  var rule = style.getPropertyValue('--rule').trim() || '#d4c7b0';
  var bg2 = style.getPropertyValue('--bg2').trim() || '#fbf7ec';

  function initChart(id, option) {
    var el = document.getElementById(id);
    if (!el) return null;
    var c = echarts.init(el, null, { renderer: 'svg' });
    c.setOption(option);
    window.addEventListener('resize', function () { c.resize(); });
    return c;
  }

  function init() {
    if (typeof echarts === 'undefined') {
      console.error('ECharts not loaded');
      return;
    }

    initChart('chart-yinyang', {
      animation: false,
      tooltip: { appendToBody: true, trigger: 'axis' },
      legend: { top: 0, textStyle: { color: muted } },
      grid: { top: 45, left: 50, right: 25, bottom: 55 },
      xAxis: {
        type: 'category',
        data: ['天玄 (1-27)', '地玄 (28-54)', '人玄 (55-81)'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: ink }
      },
      yAxis: {
        type: 'value', min: 0, max: 27, interval: 9,
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted }
      },
      series: [
        {
          name: '阳',
          type: 'bar',
          stack: 'total',
          data: [24, 13, 0],
          itemStyle: { color: accent },
          label: { show: true, color: '#f7f1e5', fontSize: 12, position: 'inside' }
        },
        {
          name: '阴',
          type: 'bar',
          stack: 'total',
          data: [3, 14, 27],
          itemStyle: { color: accent2 },
          label: { show: true, color: '#f7f1e5', fontSize: 12, position: 'inside' }
        }
      ]
    });

    initChart('chart-corresp', {
      animation: false,
      tooltip: { appendToBody: true, trigger: 'axis' },
      legend: { top: 0, textStyle: { color: muted } },
      grid: { top: 45, left: 55, right: 25, bottom: 55 },
      xAxis: {
        type: 'category',
        data: ['天玄 (1-27)', '地玄 (28-54)', '人玄 (55-81)'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: ink }
      },
      yAxis: {
        type: 'value', min: 0, max: 27, interval: 9,
        axisLine: { lineStyle: { color: rule } },
        splitLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted }
      },
      series: [
        {
          name: '有《易》卦对应',
          type: 'bar',
          data: [21, 19, 20],
          itemStyle: { color: accent },
          label: { show: true, color: '#f7f1e5', fontSize: 12, position: 'inside' }
        },
        {
          name: '无直接对应',
          type: 'bar',
          data: [6, 8, 7],
          itemStyle: { color: accent2 },
          label: { show: true, color: '#f7f1e5', fontSize: 12, position: 'inside' }
        }
      ]
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: true, theme: 'neutral', securityLevel: 'loose' });
  }
})();
