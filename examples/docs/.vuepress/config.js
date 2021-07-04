module.exports = {
  sidebar: [
    '/widgets/button',
  ],
  plugins: [
    require('../../../lib/index'),
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '基础组件', link: '/widgets/button' },
    ]
  }
}