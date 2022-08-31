<!-- 顶部导航-->
<template>
  <el-menu
    :default-active="'/' + $route.path.split('/', 2)[1]"
    router
    class="el-menu-demo"
    text-color="#fff"
    :class="this.$route.path == '/home' ? 'header' : '' "
  >
    <!-- mode="horizontal" -->
    <el-row :align="'middle'" type="flex">
      <el-col >
        <router-link :to="`/home`" :style="this.$route.path == '/home' ? 'color:white' : '' ">主站</router-link>
      </el-col>
      <el-col >
        <router-link :to="`/top`" :style="this.$route.path == '/home' ? 'color:white' : '' ">全站排行榜</router-link>
      </el-col>
      <el-col >
        <router-link :to="`/live`" :style="this.$route.path == '/home' ? 'color:white' : '' ">直播</router-link>
      </el-col>
      <el-col >
        <router-link :to="`/chatting`" :style="this.$route.path == '/home' ? 'color:white' : '' ">聊天室</router-link>
      </el-col>
      <el-col >
        <router-link :to="`/trendmaster`" :style="this.$route.path == '/home' ? 'color:white' : '' ">动态</router-link>
      </el-col>
      <el-col style="width:400%" class="ss">
        <el-input placeholder="输入关键字搜索" v-model="keyWord" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <!-- <el-input v-model="keyWord" placeholder="输入关键字搜索"></el-input>
        <el-button type="info" size="medium" @click="search">搜索</el-button> -->
      </el-col>
      <el-col  v-if="!userId">
        <router-link :to="`/login`">
          <el-button size="medium" type="primary">登录</el-button>
        </router-link>
      </el-col>
      <el-col  v-else>
          <el-dropdown>
            <span class="el-dropdown-link">
              <router-link :to="`/mine`">
              <el-avatar :src="headUrl" icon="el-icon-user-solid" :size="48"></el-avatar>
              </router-link>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                  <a href="http://www.wego666.top/">官方论坛</a>
              </el-dropdown-item>
              <el-dropdown-item>
                  <a href="https://ydlonglong.github.io">我的博客</a>
              </el-dropdown-item>
              <el-dropdown-item>
                  <span @click="logout">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-col>
      <el-col >
        <!-- <el-badge :value="unread" v-if="unread>0" style="margin-top: 10px;margin-right: 40px;">
          <router-link :to="`/message`" :style="this.$route.path == '/home' ? 'color:white' : '' ">消息</router-link>
        </el-badge> -->
        <router-link :to="`/message`" :style="this.$route.path == '/home' ? 'color:white' : '' ">消息</router-link>
        <span class="tip" v-if="unread>0">{{unread}}</span>
      </el-col>
      <el-col >
        <router-link :to="`/history`" :style="this.$route.path == '/home' ? 'color:white' : '' ">历史</router-link>
      </el-col>
      <el-col >
        <router-link :to="`/mine`" :style="this.$route.path == '/home' ? 'color:white' : '' ">个人中心</router-link>
      </el-col>
      <el-col >
        <router-link :to="`/creation`" :style="this.$route.path == '/home' ? 'color:white' : '' ">创作中心</router-link>
      </el-col>
      <el-col >
        <router-link :to="`/creation/upload`">
          <el-button size="medium" type="danger">投稿</el-button>
        </router-link>
      </el-col>
    </el-row>
  </el-menu>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { isLogin, logout, getUserHeadUrl } from "../api/user";
import { getunread } from "../api/chat";
export default {
  data() {
    return {
      keyWord: "",
      headUrl: "",
      unread:''
    };
  },
  computed: {
    ...mapState(["userId"])
  },
  watch: {
    userId(newValue) {
      //登录获取头像
      if (newValue) {
        this.getHeadUrl();
      }
    }
  },
  methods: {
    ...mapActions(["setUserId"]),
    async logout() {
      let result = await logout();
      this.setUserId("");
      this.headUrl = "";
      this.$message.success(result.msg);
      await this.$router.replace("/home");
    },
    search() {
      if (this.keyWord.trim() !== "") {
        this.$router.push({
          path: "/search",
          query: {
            keyWord: this.keyWord
          }
        });
      } else {
        this.keyWord = "";
        this.$message.warning("请输入内容！");
      }
    },
    //获取用户头像
    async getHeadUrl() {
      if (this.userId) {
        let result = await getUserHeadUrl(this.userId);
        this.headUrl = "http://localhost:3000" + result.data.headUrl;
      }
    },
    //获取未读消息数
    async getunread(){
      let result = await getunread(this.userId);
      if(result.data>99){
        this.unread = '99+';
      }else{
        this.unread = result.data;
      }
    },
    async init() {
      try {
        let result = await isLogin();
        if (result.err !== 0) {
          this.setUserId("");
        }
      } catch (e) {
        this.setUserId("");
      }
    }
  },
  created() {
    this.init();
    this.getHeadUrl();
    this.getunread();
  }
};
</script>
<style lang="scss" scoped>
.el-menu {
  text-align: center;
  .el-row {
    // margin: 0 3rem;
    display: flex;
    justify-content: space-around;
    .el-input {
    margin: 5px 5px;
    }
    .ss{
      display: flex;
      justify-content: space-around;
    }
  }
}
.el-avatar {
  cursor: pointer;
}
.header{
  background-color: transparent;
  // opacity: 1;
  z-index: 2;
}
// .header {
//   height: 175px;
//   background-image: url("../assets/img/banner.png");
//   background-position-y: 80%
// }
.tip{
  position: absolute;
  z-index: 10;
  top: 5px;
  min-width: 20px;
  padding: 0 3px;
  height: 18px;
  background: rgb(245, 108, 108);
  border-radius: 9px;
  font-size: 14px;
  color: white;
  text-align: center;
}
</style>
