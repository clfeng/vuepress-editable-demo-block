import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

export default ({
  Vue, 
}) => {
  Vue.use(ElementUI);

  Vue.prototype.$editableDemoBlockCfg = {
    runSuccessTip: function () {
      this.$message({
        message: 'run success',
        type: 'success'
      });
    },
    runFailTip: function () {
      this.$message.error('run fail');
    },
    hideText: 'hide code',
    showText: 'show code',
  }
}