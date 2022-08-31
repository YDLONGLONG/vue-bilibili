<template>
  <div>
    <el-card class="chatBox" :body-style="{ padding: '0px' }">
      <div class="loginChat" v-if="!isEnter">
        <img :src="avatar" alt="" />
        <span>{{ username }}</span>
        <button @click="loginChat">进入聊天室</button>
      </div>
      <room
        v-else
        :user="user"
        :userList="userList"
        ref="chatroom"
        @sendServer="sendServer"
        :message="message"
        @handleFile="handleFile"
      />
    </el-card>
  </div>
</template>

<script>
const default_avatar = require("../../assets/img/qqtx.jpg");
import { getUserById } from "../../api/user";
import { mapState } from "vuex";
import Room from "./ChatRoom";
//引入socket.io-client
import io from "socket.io-client";
export default {
  components: { Room },
  data() {
    return {
      username: "",
      avatar: "",
      isEnter: false,
      socket: null,
      user: {},
      userList: [],
      message: {},
    };
  },
  computed: {
    ...mapState(["userId"])
  },
  created() {
    this.init()
  },
  mounted() {
    /**
     * 聊天室的主要功能
     */
    // 连接服务器
    this.socket = io(this.$apiServer);
    // 监听登录失败的请求
    this.socket.on("userExit", (data) => this.$message.error(data.msg));
    // 监听登录成功的请求
    this.socket.on("loginsuccess", (data) => {
      this.$message.success(data.msg);
      this.user = data;
      this.isEnter = true;
    });
    this.socket.on("addUser", (data) => {
      this.$store.commit("setJoinRoom", data);
      this.$refs.chatroom ? this.$refs.chatroom.haveOneJoinRoom() : null;
    });
    this.socket.on("leaveroom", (data) => {
      this.$store.commit("setLeaveRoom", data);
      this.$refs.chatroom ? this.$refs.chatroom.haveOneleaveRoom() : null;
    });
    // 监听用户列表的信息
    this.socket.on("userList", (data) => {
      this.userList = data;
    });
    // 监听聊天的消息
    this.socket.on("receiveMessage", (data) => {
      // 把接收到的消息显示到聊天窗口中
      this.message = data;
    });
    // 监听图片的消息
    this.socket.on("receiveImage", (data) => {
      // 把接收到的图片显示到聊天窗口中
      this.$refs.chatroom.handleImage(data);
    });
  },
  destroyed() {
    if (this.socket) this.socket.disconnect();
  },
  methods: {
    loginChat() {
      if(this.userId){
        this.socket.emit("login", {
        username: this.username,
        avatar: this.avatar,
      });
      }else{
        this.$message.warning("请先登录")
      }
    },
    handleFile(file) {
      this.socket.emit("sendImage", { ...this.user, file });
    },
    sendServer(content) {
      const { username, avatar } = this.user;
      this.socket.emit("sendMessage", { msg: content, username, avatar });
    },
    async init(){
      if(!this.userId){
        this.avatar = default_avatar;
      }else{
        let result = await getUserById(this.userId);
        this.avatar = "http://localhost:3000" + result.data.headUrl;
        this.username = result.data.nick;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.chatBox {
  position: relative;
  width: 900px;
  height: 550px;
  margin: 0 auto;
  margin-top: 40px;
  border: none;
}
.loginChat {
  width: 900px;
  height: 550px;
  background: url("../../assets/img/msgBG.jpg") center/cover no-repeat fixed;
  img {
    border-radius: 50%;
    width: 180px;
    height: 180px;
    top: 110px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  span {
    position: absolute;
    display: block;
    left: 50%;
    transform: translateX(-50%);
    font-size: 34px;
    top: 300px;
    color: yellow;
  }
  button {
    width: 135px;
    height: 47px;
    font-size: 20px;
    top: 410px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    background-color:lightgreen;
    cursor: pointer;
    border: none;
    border-radius: 50px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
}
</style>