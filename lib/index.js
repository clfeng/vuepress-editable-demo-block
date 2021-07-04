const path = require('path');

module.exports = (options, ctx) => {
  return {
    alias: {
      'vue': 'vue/dist/vue.js'
    },
    plugins: [
      [
        '@vuepress/register-components',
        {
          components: [
            {
              name: 'editable-demo-block',
              path: path.resolve(__dirname, './components/editable-demo-block.vue')
            }
          ]
        }
      ]
    ],
    extendMarkdown: md => {
      md.use(require('markdown-it-container'), 'demo', {
        validate: function (params) {
          return params.trim().match(/^demo\s*(.*)$/);
        },
        render: function (tokens, idx) {
          if (tokens[idx].nesting === 1) {
            let htmlStr = tokens[idx + 1].content;
            return `
              <ClientOnly>
                <editable-demo-block html-str="${encodeURIComponent(htmlStr)}">`;
          }

          return `
                </editable-demo-block>
              </ClientOnly>
            `;
        }
      })
    }
  }
}