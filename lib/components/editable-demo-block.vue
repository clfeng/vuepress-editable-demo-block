<template>
  <div class="editable-demo-block"
    :class="{ hover: hovering }"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <div class="dispaly-area" v-if="dynamicComponent">
      <component :is="dynamicComponent" />
    </div>
    <div class="meta" :style="{ height: codeHeight }">
      <div class="code-wrappper" ref="codeWrapper">
        <code-mirror v-model="code" :options="codeOptions" />
        <div class="block-toolbar">
          <span class="opr-item" @click="renderCode(true)">运行</span>
          <span class="opr-item" :data-clipboard-text="code" ref="copyBtn">复制</span>
        </div>
      </div>
    </div>
    <div class="demo-block-control" @click="isExpanded = !isExpanded">
      <span :class="['arrow', { 'arrow--expanded': isExpanded }]"></span>
      <span v-show="hovering">{{ controlText }}</span>
    </div>
  </div>
</template>
<style lang="stylus">
.editable-demo-block {
  border: solid 1px #eeeefb;

  &:hover {
    box-shadow: 0 0 8px 0 #ebeef5, 0 2px 4px 0 #ebeef5;
  }

  .dispaly-area {
    padding: 20px;
    margin-bottom: 20px;
  }

  .meta {
    background-color: #fafafa;
    border-top: 1px solid #eaeefb;
    overflow: hidden;
    height: 0;
  }

  .code-wrappper {
      position: relative;

      .block-toolbar {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #f2f6fc;
        z-index: 10;

        .opr-item {
          border: 1px solid #3eaf7c;
          border-radius: 4px;
          padding: 5px;
          cursor: pointer;
        }
      }
    }

  .demo-block-control {
      border-top: 1px solid #eaeefb;
      height: 44px;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: center;
      margin-top: -1px;
      color: #d3dce6;
      cursor: pointer;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #409eff;
        background-color: #f9fafc;
      }

      .arrow {
        border-top: 5px solid #d3dce6;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        margin-right: 5px;

        &:hover {
          border-top-color: #409eff;
        }

        &.arrow--expanded {
          transform: rotate(180deg);

        }
      }
  } 
  
}
</style>
<script>
import "codemirror/theme/monokai.css";
import "codemirror/mode/vue/vue";

import { codemirror as CodeMirror } from "vue-codemirror-lite";
import Clipboard from 'clipboard';

const HTML_REG = /<template>([\s\S]+)<\/template>/;
const CSS_REG = /<style>([\s\S]+)<\/style>/;
const JS_REG = /<script>([\s\S]+)<\/script>/;

const CODE_MIRROR_OPTIONS = {
  mode: 'vue',
  indentUnit: 4,
  smartIndent: true,
  tabSize: 4,
  readOnly: false,
  showCursorWhenSelecting: true,
  lineNumbers: false,
  theme: 'monokai',
  scrollbarStyle: 'null',
}

export default {
  name: "EditableDemoBlock",

  props: {
    htmlStr: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default () {
        return {};
      }
    },
  },

  components: {
    CodeMirror,
  },

  data() {
    return {
      hovering: false,
      isExpanded: false,
      codeHeight: '0px',
      demoText: {
        hideText: '隐藏代码',
        showText: '显示代码'
      },
      code: '',
      dynamicComponent: null,
    };
  },

  computed: {
    controlText () {
      return this.isExpanded ? this.demoText.hideText : this.demoText.showText;
    },
    codeOptions () {
      return {
        ...CODE_MIRROR_OPTIONS,
        ...this.options
      };
    },
  },

  watch: {
    htmlStr: {
      immediate: true,
      handler () {
        this.code = decodeURIComponent(this.htmlStr);
        this.renderCode(false);
      }
    },
    isExpanded (v) {
      if (!v) {
        this.codeHeight = '0px';
        return;
      }

      let codeWrapperEl = this.$refs.codeWrapper;
      let clientRect = codeWrapperEl.getBoundingClientRect();
      this.codeHeight = `${clientRect.height}px`;
    }
  },

  mounted () {
    this.enableCopy();
  },

  methods: {
    enableCopy () {
      let clipboard = new Clipboard(this.$refs.copyBtn);
      clipboard.on('success', (e) => {
        console.log('copy-success');
      });
    },
    renderCode (isShowTip) {
      if (!this.code) {
        return;
      }
      if (this.styleEl) {
        document.head.removeEventListener(this.styleEl);
      }

      try {
        let decodeHtmlStr = this.code;
        let htmlCode = decodeHtmlStr.match(HTML_REG)[0];
        htmlCode = htmlCode.trim().replace(/^<template>/, '').replace(/<\/template>$/, '');

        let cssCode = decodeHtmlStr.match(CSS_REG);
        cssCode = cssCode ? cssCode[0] : '';
        cssCode = cssCode.trim().replace(/<style>/).replace(/<\/style>/, '');

        if (cssCode) {
          this.styleEl = document.createElement('style');
          this.styleEl.textContent = cssCode;
          document.head.appendChild(this.styleEl);
        }

      let jsCode = decodeHtmlStr.match(JS_REG)[1];
      let jsCodeScript = jsCode.replace(
          /export\s+default\s*?\{\n*/,
          `
            function getVueConfig () {
              return ({
          `
        ).replace(
          /\n*\}\s*$/,
          `
              });
            };
            let vueConfig = getVueConfig();
            return vueConfig;
          `
        );

        let jsCodeFn = new Function(jsCodeScript);
        let vueAttrs = jsCodeFn();

        this.dynamicComponent = {
          template: htmlCode,
          ...vueAttrs,
        };
        isShowTip && console.log('run success')
      } catch (error) {
          console.error(e);
          console.error('解析错误！');
      }
    }
  },

  beforeDestroy () {
    if (this.styleEl) {
      document.head.removeChild(this.styleEl);
    }
  },
};
</script>
