<template> 
  <div> 
    <slide-verify
      ref="slideblock"
      @fulfilled="onFulfilled"
      @success="onSuccess"
      @fail="onFail"
      :imgs="puzzleImgList"
      @refresh="onRefresh"
      :accuracy="accuracy"
      :slider-text="text"
    ></slide-verify>
    <div class="zt">{{ msg }}</div>
  </div>
</template>
 
<script>
export default {
  name: "Table",
  data() {
    return {
      puzzleImgList: [
        require('../assets/img/banner.png'),
        require('../assets/img/bgImg.webp'),
        require('../assets/img/head.jpg'),
        require('../assets/img/livebg.jpg'),
        require('../assets/img/loginbj.jpeg'),
        require('../assets/img/msgBG.jpg'),
        require('../assets/img/onlineBg.jpg'),
        require('../assets/img/qqtx.jpg'),
      ], 
      msg: "",
      text: "右滑验证",
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 5
    };
  },
  created() { 
  },
  methods: {
    // 验证成功，触发该方法
    onSuccess(times) {
      let ms = (times / 1000).toFixed(1);
      this.msg = "验证成功, 耗时 " + ms + "s";
        this.$emit('isCan',{is:true})
    },
    onFail() {
      //console.log("验证不通过");
      this.msg = "";
    },
    onRefresh() {
      //console.log("点击了刷新小图标");
      this.msg = "";
    },
    onFulfilled() {
      //console.log("刷新成功啦！");
    },
    // onAgain() {
    //   console.log("检测到非人为操作的哦！");
    //   this.msg = "try again";
    //   // 刷新
    //   this.$refs.slideblock.reset();
    // },
    // handleClose() {
    //   // console.log("val", val);
    // },
  },
};
</script>
<style lang="scss" scoped>
.zt{
    font-size: 20px;
}
</style>