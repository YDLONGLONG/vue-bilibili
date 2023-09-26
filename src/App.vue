<template>
<div class="show" ref="tree">
  <el-container>
    <!-- 头 -->
    <el-header height="10%" style="padding:0;">
      <Header />
      <Banner class="banner" v-show="this.$route.path == '/home'"/>
    </el-header>
    <el-main>
      <!-- 路由占位符 主要部分 -->
      <!--  匹配完整路径 使其能跳转自身   -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-main>
    <el-footer>
      <Footer v-show="$route.meta.show"></Footer>
    </el-footer>
  </el-container>
  <el-backtop target=".show"></el-backtop>
</div>
</template>
<script>
import Header from './components/header'
import Footer from './components/footer'
import Banner from "./components/banner.vue"
export default {
  components: {
    Header,
    Footer,
    Banner
  },
  data(){
    return{
      page:1
    }
  },
  mounted() {
    this.$refs.tree.addEventListener('scroll',async e => {
      if(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight===0){
        this.page +=1
        this.$bus.$emit('globalEvent',this.page)
      }
    }, false)
  }
}
</script>
<style lang="scss">
.banner{
  position: relative;
  bottom: 50px;
  z-index: 1;
}
.el-container {
  width: 100vw;
  min-height: 100%;
}
.el-main {
  width: 1440px;
  margin: 0 auto 50px;
  padding: 0;
}
.el-main-else{
  width: 1640px;
  margin: 0 auto 50px;
  padding: 0;
}
/* 分页*/
.el-pagination {
  text-align: center;
}
.dplayer-danloading {
  display: none;
}
.show{
  height: 100%;
  overflow-x: hidden;
}
</style>
