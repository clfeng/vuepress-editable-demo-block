# vuepress-plugin-editable-demo-block
The plugin is used to help you add vue examples when writing a document. 
Using this plugin, your users can easily modify your examples.
With the editable functions your user can understand your example better.

## Feature
- display code and examples
- real-time rendering
- only support vue

![examples](./examples.gif)


### Install
```
// npm 
npm i vuepress-plugin-editable-demo-block

// yarn 
yarn add vuepress-plugin-editable-demo-block
```

### Usage 
```
// docs/.vuepress/config.js
module.exports = {
  plugins: [
    require('vuepress-plugin-editable-demo-block'),
  ],
}
```

### custome editable-demo-block component's behavior
```
// docs/.vuepress/enhanceApp.js
export default ({
  Vue, 
}) => {
  Vue.prototype.$editableDemoBlockCfg = {
    runSuccessTip: function () { // render suncess tip function
      console.log('run success');
    },
    runFailTip: function () { // // render fail tip function
      this.$message.error('run fail');
    },
    hideText: 'hide code', // tip text when code is hide
    showText: 'show code', // tip text when code is show
  }
}
```

### Start
Write the following code in the Markdown file:

```
::: demo 
\``` <= delete start backslash
<template>
  <div class="examples-button">
    <p>{{ explain }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      explain: 'display button component'
    }
  }
}
</script>
\``` <= delete start backslash
:::

```

### run examples
`yarn install`

`cd examples && yarn install && yarn dev`

