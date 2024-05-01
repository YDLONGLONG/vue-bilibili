<template>
<div class="show" ref="tree">
  <el-container>
    <VueDragResize :isActive="true"  :isResizable="false" :w="1" :h="1">
      <div>
      <el-button @click="drawer = true" circle style="position: fixed; z-index: 10;margin: 5px;">AI</el-button>
      <el-drawer
        :visible.sync="drawer"
        :with-header="false"
        :modal="false">
        <div>
        <iframe src="https://hailuoai.com/" width="100%" height="900px" frameborder="0"></iframe>
      </div>
      </el-drawer>
    </div>
    </VueDragResize>
    <!-- 头 -->
    <el-header height="10%" style="padding:0;">
      <Header />
      <Banner class="banner" v-show="this.$route.path == '/home'"/>
    </el-header>
    <el-main>
      <!-- 路由占位符 主要部分 -->
      <!--  匹配完整路径 使其能跳转自身   -->
      <keep-alive include='Home'>
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
import VueDragResize from 'vue-drag-resize'
export default {
  components: {
    Header,
    Footer,
    Banner,
    VueDragResize
  },
  data(){
    return{
      page:1,
      drawer: false,
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
