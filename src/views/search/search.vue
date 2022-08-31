<template>
<div>
  <div class="middle">
  <el-row>
        <router-link :to="`/search/video?keyWord=${keyWord}`">
          <el-col :span="2">
            <i class="el-icon-video-camera" style="color: #00C091;margin: 4px"></i>
            视频
          </el-col>
        </router-link>
        <router-link :to="`/search/user?keyWord=${keyWord}`">
          <el-col :span="2">
            <i class="el-icon-user" style="color: #00C091;margin: 4px"></i>
            用户
          </el-col>
        </router-link>
        <router-link :to="`/search/trend?keyWord=${keyWord}`">
          <el-col :span="2">
            <i class="el-icon-star-off" style="color: #00C091;margin: 4px"></i>
            动态
          </el-col>
        </router-link>
    </el-row>
  </div>
    <div>
      <router-view></router-view>
    </div>
</div>
</template>
<script>
export default {
  name: 'search',
  data() {
    return {
      keyWord: '',
    }
  },
   watch:{
    '$route.query.keyWord': function(){
      this.keyWord=this.$route.query.keyWord
    }
  },
  methods: {
  },
  created() {
    let { keyWord } = this.$route.query
    if(keyWord) this.keyWord = keyWord
  },
}
</script>
<style lang="scss" scoped>
.middle {
  border: 1px solid #ebebeb;
  border-radius: 0 0 10px 10px;
  text-align: center;
  font-size: 16px;
  height: 64px;
  line-height: 60px;
  .router-link-active {
    .el-col {
      border-bottom: #00a1d6 solid 2px;
    }
  }
  a .el-col {
    margin-left: 10px;
    &:hover {
      border-bottom: #00a1d6 solid 2px;
      color: #00a1d6;
    }
  }
}
</style>
