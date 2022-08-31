<template>
  <div>
    <!--    背景-->
    <div class="bgPic"></div>
    <!--    左侧菜单-->
    <el-menu :default-active="$route.path" active-text-color="#ff4757" class="menu" router>
      <el-menu-item index="/message/notice">
        <i class="el-icon-setting"></i>
        <span slot="title">系统通知</span>
      </el-menu-item>
      <el-menu-item index="/message/reply">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">回复我的</span>
      </el-menu-item>
      <el-menu-item index="/message/mymsg/6130d996b11d1d8bc0838e91">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">我的消息</span>
      </el-menu-item>
      <span class="tip" v-if="unread>0">{{unread}}</span>
    </el-menu>
    <!--    右侧组件  -->
    <div class="right">
      <div class="rightBg"></div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { getunread } from "../../api/chat";
export default {
  data() {
    return {
      unread:''
    };
  },
  computed: {
    ...mapState(["userId"])
  },
  methods: {
    ...mapActions(["setUserId"]),
    //获取未读消息数
    async getunread(){
      let result = await getunread(this.userId);
      if(result.data>99){
        this.unread = '99+';
      }else{
        this.unread = result.data;
      }
    },
  },
  created() {
      this.getunread();
    }
}
</script>
<style lang="scss" scoped>
.bgPic {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  background: url("../../assets/img/msgBG.jpg") center/cover no-repeat fixed;
}
.menu {
  padding: 20px 0;
  position: fixed;
  height: 100%;
  width: 150px;
  text-align: center;
  opacity: 0.9;
  border-radius: 1rem;
  left: 20%;
}
.right {
  position: fixed;
  height: 93%;
  left: 28%;
  width: 1000px;
  overflow: auto;
  .rightBg {
    position: fixed;
    width: 1000px;
    height: 100%;
    background-color: #bddef8;
    opacity: 0.5;
    z-index: -1;
    border-radius: 1rem;
  }
  div:nth-child(2) {
    margin: 30px;
    border-radius: 8px;
  }
}
.tip{
  position: absolute;
  z-index: 10;
  top: 150px;
  right: 5px;
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
