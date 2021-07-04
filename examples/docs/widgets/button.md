# Button

## Base Demo
::: demo 
```
<template>
  <div class="examples-button">
    <p>{{ explain }}</p>
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      explain: '展示按钮组件'
    }
  }
}
</script>
```
:::