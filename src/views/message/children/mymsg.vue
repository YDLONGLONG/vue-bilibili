<template>
  <div class="chatRoom" ref="room">
    <div class="chatList">
      <div class="listTop">
        <span>近期消息</span>
      </div>
      <div class="userChat">
        <ul class="onlineList">
          <li class="userBox" v-for="item in userList" :key="item.username" @click="jump(item._id)">
              <img :src="item.headUrl | urlFormat" alt="" />
              <span>{{ item.nick }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="roomRight">
      <p class="name">{{ user.nick }}</p>
      <div class="chatContent">
        <ul class="join" ref="joinUs">
          <li
            v-for="(item1, index) in messageContent"
            :key="index"
            :class="{
              'my-message': item1.type === 1 ? true : false,
              'other-message': item1.type === 2 ? true : false,
            }"
          >
            <div v-if="item1.type === 1">
              <span @contextmenu.prevent="onContextmenu">{{ item1.msg }}</span>
              <img :src="url+my.headUrl" class="avatar" />
            </div>
            <div v-if="item1.type === 2">
              <img :src="url+user.headUrl" alt class="avatar" />
              <p class="content" @contextmenu.prevent="onContextmenu">{{ item1.msg }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="sendMessage">
        <div class="icon">
          <span
            class="iconfont icon-smile"
            @click="emojiShow = !emojiShow"
          ></span>
          <div
            class="emoji"
            tabindex="1"
            v-show="emojiShow"
            @blur="handleEmojiBlur"
          >
            <span
              v-for="item in emojiList"
              :key="item.codes"
              @click="handleEmoji(item)"
              >{{ item.char }}</span
            >
          </div>
        </div>
        <textarea
          cols="80"
          rows="5"
          ref="textarea"
          @keydown.enter="handlePress"
        ></textarea>
        <button class="sendMessage" @click="sendContentToServe">发送</button>
        <img :src="imgUrl" alt />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import io from "socket.io-client";
import emoji from "../../../assets/emoji.json";
import { getUserHeadUrl,getAttentionUser } from '../../../api/user'
import { getChat,addChat,deleteOneChat } from '../../../api/chat'
export default {
  name: "Room",
  data() {
    return {
      messageContent: [], //0不渲染，1表示自己发出的信息，2表示别人发出的信息
      emojiList: [],
      content: "",
      emojiShow: false,
      imgUrl: "",
      imgAllUrl: [],
      user: {},
      userList: [],
      message: {},
      my:{},
      url:''
    };
  },
  computed: {
    ...mapState(["userId"]),
  },
  watch: {
    message(newValue) {
      this.handleMessageBox(newValue);
    },
  },
  created(){
    let { _id } = this.$route.params
    this.init(_id)
  },
  mounted() {
    this.emojiList = emoji;
    /**
     * 聊天室的主要功能
     */
    // 连接服务器
    this.socket = io(this.$apiServer);
    // 监听聊天的消息
    this.socket.on("msg", (data) => {
      // 把接收到的消息显示到聊天窗口中
      this.message = data;
    });
    if(this.userId){
        this.socket.emit("loginOne",this.userId);
      }else{
        this.$message.warning("请先登录")
      }
  },
  destroyed() {
    if (this.socket) this.socket.disconnect();
  },
  updated() {
    // 聊天定位到底部
    this.handleScrollBottom();
  },
  methods: {
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "撤回",
            onClick: () => {
              console.log("撤回");
            }
          },
          {
            label: "删除",
            onClick: () => {
              console.log("删除");
            }
          }
        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 3, // 菜单样式 z-index
        minWidth: 230 // 主菜单最小宽度
      });
      return false;
    },
    handlePress(e) {
      if (e.ctrlKey && e.keyCode == 13) {
        //用户点击ctrl+enter触发换行
        this.$refs.textarea.value += "\n";
      } else {
        //用户点击了enter触发发送消息
        this.sendContentToServe();
      }
    },
    handleEmojiBlur() {
      this.emojiShow = false;
    },
    handleEmoji(emoji) {
      this.content = this.$refs.textarea.value;
      this.$refs.textarea.value += emoji.char;
    },
    loadOverImg() {
      this.$previewRefresh();
      this.handleScrollBottom();
    },
    handleImage(file) {
      this.handleMessageBox(file);
    },
    sendContentToServe() {
      // 获取到聊天的内容
      this.content = this.$refs.textarea.value;
      this.$refs.textarea.value = "";
      if (!this.content) {
        return this.$message.info("请输入内容!");
      }
      //发送给服务器
      let { _id } = this.$route.params
      this.socket.emit("msg", { msg: this.content, fromid:this.userId, toid:_id });
      this.addChat(this.content)
    },
    handleMessageBox(newValue) {
      if (newValue.fromid === this.userId) {
        //是自己发的信息
        this.messageContent.push({ ...newValue, type: 1 });
      } else {
        //是别人发的信息
        this.messageContent.push({ ...newValue, type: 2 });
      }
    },
    //聊天定位到底部
    handleScrollBottom() {
      const ul = this.$refs.joinUs;
      ul.scrollTop = ul.scrollHeight;
    },
    //跳转聊天室
    jump(id){
      this.$router.push('/message/mymsg/' + id);
      //局部刷新页面
      this.getChat(id)
    },
    //发送消息给服务器
    async addChat(msg){
      let { _id } = this.$route.params
      await addChat({userid:this.userId,friendid:_id,msg:msg,type:1})
    },
    //获取聊天记录
    async getChat(_id){
      let result = await getUserHeadUrl(_id);
      this.user = result.data;
      //清空聊天记录
      this.messageContent = []
      let re = await getChat({userid:this.userId,friendid:_id,page:1})
      for(let i=0;i<re.data.chat.length;i++){
        if (re.data.chat[i].userid === this.userId) {
          //是自己发的信息
          this.messageContent.push({ _id:re.data.chat[i]._id,msg:re.data.chat[i].msg, type: 1, time:re.data.chat[i].time });
        } else {
          //是别人发的信息
          this.messageContent.push({ _id:re.data.chat[i]._id,msg:re.data.chat[i].msg, type: 2 , time:re.data.chat[i].time });
        }
      }
      let r = await getChat({userid:_id,friendid:this.userId,page:1})
      for(let i=0;i<r.data.chat.length;i++){
        if (r.data.chat[i].userid === this.userId) {
          //是自己发的信息
          this.messageContent.push({ _id:r.data.chat[i]._id,msg:r.data.chat[i].msg, type: 1 ,time:r.data.chat[i].time});
        } else {
          //是别人发的信息
          this.messageContent.push({ _id:r.data.chat[i]._id,msg:r.data.chat[i].msg, type: 2 ,time:r.data.chat[i].time});
        }
      }
      //升序排序
      this.messageContent.sort(function(a, b) {
          if (a.time < b.time ) {
              return -1;
          } else if (a.time > b.time ) {
              return 1;
          } else {
              if (a.time < b.time ) {
                  return 1;
              } else if (a.time > b.time ) {
                  return -1;
              }
              return 0;
          }
      });
    },
    async init(_id){
      if (!this.userId) {
        this.$message.warning('请先登录')
        return await this.$router.push('/login')
      }
      //获取用户信息
      let result = await getUserHeadUrl(_id)
      this.user = result.data
      let resu = await getUserHeadUrl(this.userId)
      this.my = resu.data
      this.url = this.$apiServer
      let res = await getAttentionUser(this.userId)
      this.userList = res.data;
      this.getChat(_id);
    }
  },
};
</script>

<style lang="scss" scoped>
.chatRoom {
  display: flex;
  .chatList {
    width: 185px;
    height: 550px;
    padding: 20px 0 0 20px;
    background: url("../../../assets/img/msgBG.jpg") center/cover no-repeat fixed;
    .avatar {
      position: relative;
      span {
        position: absolute;
        left: 53px;
        top: 11px;
        font-size: 18px;
        color: yellow;
      }
      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
    }
    .el-divider {
      margin: 10px 0;
    }
    .listTop {
      span {
        color: #fff;
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
      }
      padding-left: 5px;
    }
    .userChat {
      overflow: auto;
      height: 420px;
      .onlineList {
        list-style: none;
        padding-left: 10px;
        margin: 0;
        img {
          width: 50px;
          height: 50px;
          margin: 5px 10px 0 0;
        }
        .userBox {
          position: relative;
          height: 55px;
          img{
            border-radius: 50%;
          }
          cursor: pointer;
          span {
            position: absolute;
            top: 16px;
            font-size: 20px;
            color: #fff;
          }
        }
      }
    }
    .userChat::-webkit-scrollbar {
      display: none;
    }
  }
}
.roomRight {
  flex: 1;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  .name {
    display: flex;
    justify-content: center;
    line-height: 40px;
    margin-block-start: 0;
    margin-block-end: 0;
    font-size: 18px;
    border-bottom: 1px solid rgba(100, 100, 100, 0.3);
  }
  .chatContent {
    height: 340px;
    .join {
      text-align: center;
      color: #ccc;
      overflow: auto;
      height: 100%;
      margin-bottom: 0;
      margin-top: 0;
      padding: 5px 30px 0;
      list-style: none;
      li {
        padding-bottom: 12px;
      }
    }
    .join::-webkit-scrollbar {
      display: none;
    }
    .my-message {
      display: flex;
      justify-content: flex-end;
      div {
        display: flex;
        position: relative;
        &::after {
          content: "";
          right: 45px;
          top: 50%;
          transform: translateY(-50%);
          position: absolute;
          border-left: 6px solid #9eea6a;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid transparent;
        }
        .file {
          max-width: 330px;
          max-height: 170px;
          margin-right: 12px;
          cursor: pointer;
        }
        .avatar {
          width: 45px;
          height: 45px;
        }
        span {
          overflow: auto;
          box-sizing: border-box;
          display: inline-block;
          border-radius: 5px;
          line-height: 30px;
          background-color: #9eea6a;
          color: #000;
          padding: 5px;
          margin-right: 12px;
          min-width: 45px;
          max-width: 500px;
        }
      }
    }
    .other-message {
      position: relative;
      display: flex;
      justify-content: flex-start;
      div {
        display: flex;
        position: relative;
        &::before {
          content: "";
          left: 45px;
          top: 45%;
          transform: translateY(-50%);
          position: absolute;
          border-left: 5px solid transparent;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-right: 5px solid #ccc;
        }
        .file {
          max-width: 330px;
          max-height: 170px;
          margin-top: 15px;
          margin-left: 11px;
          cursor: pointer;
        }
        .avatar {
          width: 45px;
          height: 45px;
        }
        .content {
          overflow: auto;
          //margin-top: 15px;
          box-sizing: border-box;
          display: inline-block;
          border-radius: 5px;
          line-height: 30px;
          background-color: #fff;
          color: #000;
          padding: 5px;
          margin-left: 11px;
          border: 1px solid #ccc;
          min-width: 45px;
          max-width: 500px;
        }
      }
    }
  }
  .sendMessage {
    position: relative;
    flex: 1;
    background-color: #fff;
    padding-left: 15px;
    .icon {
      height: 30px;
      padding-top: 6px;
      display: flex;
      .icon-smile,
      .icon-Path,
      .icon-jietu {
        font-size: 20px;
        padding: 0 6px;
        cursor: pointer;
      }
      .icon-jietu {
        font-size: 23px !important;
      }
      .emoji {
        position: absolute;
        display: flex;
        flex-wrap: wrap;
        width: 276px;
        height: 218px;
        overflow: auto;
        bottom: 190px;
        background-color: #fff;
        border: 1px solid #cccccc;
        outline: none;
        span {
          padding: 7px;
          cursor: pointer;
        }
      }
    }
    textarea {
      border: none;
      resize: none;
      outline: none;
      font-size: 15px;
      padding-left: 10px;
    }
    textarea::-webkit-scrollbar {
      display: none;
    }
    .sendMessage {
      position: absolute;
      bottom: 35px;
      right: 20px;
      font-size: 16px;
      border-radius: 5px;
      padding: 4px 10px;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
    }
  }
}
</style>