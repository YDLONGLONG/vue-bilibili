<template>
  <div class="reply" v-show="msg.length">
    <div v-for="(item, i) in msg" :key="item._id">
      <div style="cursor: pointer">
        <el-row>
          <el-col :span="2" style="text-align: center">
            <router-link :to="`/mine`" v-if="item.user._id===userId">
              <el-avatar icon="el-icon-user-solid" :size="46" :src="item.user.headUrl | urlFormat"></el-avatar>
            </router-link>
            <router-link :to="`/user/${item.user._id}`" v-else>
              <el-avatar icon="el-icon-user-solid" :size="46" :src="item.user.headUrl | urlFormat"></el-avatar>
            </router-link>
          </el-col>
          <el-col :span="22" class="content">
            <el-row>
              <el-col :span="19">
                <router-link :to="`/user/${item.user._id}`">
                  <b>{{ item.user.nick }}</b>
                </router-link>
                <span>回复了我的评论</span>
                <div v-if="item.content == undefined || item.content.length <0 || JSON.stringify(item.content) == '{}' || Object.keys(item.content).length<0" class="text-wrap">
                  <span>该评论已删除</span>
                </div>
                <div v-else class="text-wrap">
                  {{ item.content }}
                </div>
                <div class="youSay" v-show="item.youSay">{{ item.you.nick }}: {{ item.youSay }}</div>
                <p>
                  {{ item.date | fullDateFormat }}
                  <span class="el-icon-chat-line-round" @click.stop="reply(i, item.comment._id, item.user._id, item.content)">
                    回复
                  </span>
                  <span class="el-icon-delete" @click.stop="deleteMsg(item._id)">删除</span>
                  <span class="el-icon-film" @click="linkTo(item.comment.video)">查看原视频</span>
                </p>
              </el-col>
              <el-col :span="4" :title="item.comment.content" :offset="1" class="last text-wrap">
                {{ item.comment.content }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-bottom:2rem" type="flex" align="middle" v-show="isShow[i]">
        <el-col :span="2" style="text-align: center">
          <el-avatar :size="46" :src="item.you.headUrl | urlFormat"></el-avatar>
        </el-col>
        <el-col :span="19">
          <el-input type="textarea" style="font-size: 1.2rem" v-model="replyMsg" placeholder="输入回复内容" rows="3"></el-input>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="primary" @click="replyUser">回复</el-button>
        </el-col>
      </el-row>
      <!--   分隔线   -->
      <el-row style="margin: 1rem 0">
        <el-col :span="22" :offset="2" style=" border-bottom: 1px solid #E5E9EF;"></el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getMsg, deleteMsg } from '../../../api/message'
import { sendCommentReply } from '../../../api/comment'
import { mapState } from 'vuex'
export default {
  name: 'reply',
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      isShow: [],
      replyMsg: '',
      msg: [],
      to: '',
      commentId: '',
      heSay: '',
      flag: ''
    }
  },
  methods: {
    async deleteMsg(msgId) {
      let result = await deleteMsg(msgId, this.userId)
      this.msg = result.data
      this.isShow = new Array(this.msg.length).fill(false)
      this.$message.success(result.msg)
    },
    async replyUser() {
      if (this.replyMsg.trim()) {
        let result = await sendCommentReply({
          _id: this.commentId,
          from: this.userId,
          to: this.to,
          content: this.replyMsg,
          heSay: this.heSay
        })
        this.$message.success(result.msg)
        this.isShow[this.flag] = false
      } else this.$message.warning('输入内容')
      this.replyMsg = ''
    },
    linkTo(video) {
      this.$router.push(`/detail/${video}`)
    },
    reply(j, commentId, to, heSay) {
      //重置回复文本域是否显示
      for (let i = 0; i < this.isShow.length; i++) {
        this.$set(this.isShow, i, false)
      }
      this.$set(this.isShow, j, true)
      this.flag = j
      this.commentId = commentId
      this.to = to
      this.heSay = heSay
    },
    async init() {
      if (!this.userId) {
        this.$message.warning('请先登录')
        return await this.$router.push('/login')
      }
      this.msg = (await getMsg(this.userId)).data
      this.isShow = new Array(this.msg.length).fill(false)
    }
  },
  created() {
    if (this.$route.params.id === this.userId) {
      this.$router.replace('/mine')
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.reply {
  padding: 2rem;
  border-radius: 0.8rem;
  background-color: white;
  .content {
    color: #505050;
    margin-bottom: 1rem;
    .youSay {
      color: #999;
      font-size: 1.2rem;
      margin: 0.8rem 0;
      border-left: 2px solid #e7e7e7;
      padding: 0.2rem;
    }
    span {
      margin-left: 1rem;
    }
    div:nth-child(3) {
      margin: 0.5rem 0;
    }
    p:last-child {
      font-size: 1.2rem;
      color: #999999;
      span {
        cursor: pointer;
        font-size: 1.4rem;
        &:hover {
          color: #00a1d6;
        }
        &:before {
          margin-right: 0.3rem;
        }
      }
    }
    .last {
      height: 6rem;
      overflow: hidden;
    }
  }
}
.text-wrap {
  /*换行*/
  word-wrap: break-word;
  word-break: break-all;
}
</style>
