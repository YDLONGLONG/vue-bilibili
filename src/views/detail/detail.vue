<template>
  <div style="margin-bottom: 8rem">
    <!--    video顶部信息-->
    <el-row style="padding: 2rem 0">
      <el-col :span="18">
        <div class="videoTop">
          <h2>{{ video.title }}</h2>
          <p>
            <span>{{ video.type | videoTypeFormat }}</span>
            <span style="padding-left: 1rem">{{ video.uploadAt | fullDateFormat }}</span>
          </p>
          <p>{{ video.playCount }} 播放 · {{ danmuCount }} 弹幕</p>
        </div>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" align="middle" class="userInfo">
          <el-col :span="4">
            <router-link :to="`/mine`" v-if="video.author._id===userId">
              <el-avatar icon="el-icon-user-solid" :size="64" :src="video.author.headUrl | urlFormat" :key="video.author.headUrl"></el-avatar>
            </router-link>
            <router-link :to="`/user/${video.author._id}`" v-else>
              <el-avatar icon="el-icon-user-solid" :size="64" :src="video.author.headUrl | urlFormat" :key="video.author.headUrl"></el-avatar>
            </router-link>
          </el-col>
          <el-col :span="18" :offset="2">
            <router-link :to="`/user/${video.author._id}`">{{ video.author.nick }}</router-link>
            <p class="sign" :title="video.author.sign">{{ video.author.sign }}</p>
            <el-button v-if="!userId" type="warning" size="small" disabled title="登录可关注">未关注</el-button>
            <el-button v-else-if="userId !== video.author._id" size="small" :type="isAttention ? 'success' : 'danger'" @click="togAtt">
              {{ isAttention ? '已关注' : '关注' }}
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--   视频 -->
    <el-row>
      <el-col :span="17">
        <!--        播放器-->
        <div class="player">
          <d-player :options="options"></d-player>
        </div>
        <!--      点赞收藏  -->
        <div class="zan">
          <span :class="video.zanList.indexOf(userId) !== -1 ? 'color-true' : 'color-false'" title="点赞" @click="support">
            <i class="el-icon-circle-check">{{ video.zanList.length }}</i>
          </span>
          <span :class="video.collectList.indexOf(userId) !== -1 ? 'color-true' : 'color-false'" title="收藏" @click="collect">
            <i class="el-icon-star-off">{{ video.collectList.length }}</i>
          </span>
        </div>
        <!--      详情  -->
        <div class="info">
          <div ref="infoDiv">
            {{ video.desc }}
          </div>
          <div class="more" @click="toggle">{{ more ? '展开更多' : '收起' }}</div>
        </div>
        <!--     写评论   -->
        <div disabled>
          <el-row type="flex" align="middle">
            <el-col :span="2">
              <el-avatar icon="el-icon-user-solid" :size="48" :src="user.headUrl | urlFormat" :key="user.headUrl"></el-avatar>
            </el-col>
            <el-col :span="18">
              <el-input type="textarea" v-model="content" rows="3" placeholder="在这里写点什么吧！"></el-input>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-button @click="send" type="primary" :disabled="!userId">
                {{ userId ? '发表评论' : '未登录' }}
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22" :push="2" style="margin: 1.5rem 0;border-top: 1px solid #E5E9EF;"></el-col>
          </el-row>
        </div>
        <!--     评论列表   -->
        <div>
          <!--      一条评论    -->
          <el-row class="comment" v-for="(comment, index) in commentList" :key="comment._id">
            <el-col :span="2">
              <router-link :to="`/user/${comment.author._id}`">
                <el-avatar icon="el-icon-user-solid" :size="48" :src="comment.author.headUrl | urlFormat" :key="comment.author.headUrl"></el-avatar>
              </router-link>
            </el-col>
            <el-col :span="22" class="item" style="border-bottom: 1px solid #E5E9EF;padding-bottom: 1rem;margin-bottom: 1rem">
              <router-link :to="`/user/${comment.author._id}`">
                <b>{{ comment.author.nick }}</b>
              </router-link>
              <div>{{ comment.content }}</div>
              <p>
                <span>{{ comment.date | fullDateFormat }}</span>
                <span v-show="userId">
                  <span @click="showArea(comment.author, index)" class="replySpan">
                    回复
                  </span>
                  <span @click="deleteContent(comment._id)" class="replySpan">删除</span>
                </span>
                  <!-- <span v-if="comment.author._id !== userId" @click="showArea(comment.author, index)" class="replySpan">
                    回复
                  </span>
                  <span v-else @click="deleteContent(comment._id)" class="replySpan">删除</span>
                </span> -->
              </p>
              <!--          一条回复    -->
              <el-row v-for="item in showAllReply[index] ? comment.reply : comment.reply.slice(0, 3)" :key="item._id" style="margin: 0;">
                <el-col :span="1">
                  <router-link :to="`/user/${item.from._id}`">
                    <el-avatar icon="el-icon-user-solid" :size="24" :src="item.from.headUrl | urlFormat" :key="item.from.headUrl"></el-avatar>
                  </router-link>
                </el-col>
                <el-col :span="23">
                  <router-link :to="`/user/${item.from._id}`">
                    <b>{{ item.from.nick }}</b>
                  </router-link>
                  <span style="font-size: 1.2rem;margin: 0 0.4rem">回复</span>
                  <router-link :to="`/user/${item.to._id}`">
                    <b>@{{ item.to.nick }}</b>
                  </router-link>
                  <span style="margin-left: 1rem">{{ item.content }}</span>
                  <p>
                    <span>{{ item.date | fullDateFormat }}</span>
                    <span v-show="userId">
                      <span v-if="item.from._id !== userId" @click="showArea(item.from, index, item.content)" class="replySpan">
                        回复
                      </span>
                      <span v-else @click="deleteContent(comment._id, item._id)" class="replySpan">删除</span>
                    </span>
                  </p>
                </el-col>
              </el-row>
              <p class="toggle" v-if="comment.reply.length > 3">
                共
                <b>{{ comment.reply.length }}</b>
                条回复,
                <span style="margin-left: 0.8rem;color: #00A1D6" @click="showReply(index, $event)" class="replySpan">
                  点击查看
                </span>
              </p>
              <!--             动态显示回复框 -->
              <div v-if="isReply[index]">
                <el-row type="flex" align="middle">
                  <el-col :span="2" :pull="2">
                    <el-avatar :size="48" icon="el-icon-user-solid" :src="user.headUrl | urlFormat"></el-avatar>
                  </el-col>
                  <el-col :span="20" :pull="2">
                    <el-input type="textarea" v-model="replyContent" rows="3" :placeholder="`回复@${who.nick}`"></el-input>
                  </el-col>
                  <el-col :span="2" :pull="1">
                    <el-button type="primary" :disabled="!userId" @click="sendReply(comment._id)">
                      {{ userId ? '回复' : '未登录' }}
                    </el-button>
                  </el-col>
                </el-row>
                <el-row></el-row>
              </div>
            </el-col>
          </el-row>
          <el-pagination
            background
            :current-page="page"
            layout="prev, pager, next,total"
            :total="commentCount"
            :page-size="5"
            @current-change="handleCurrent"
            hide-on-single-page
          ></el-pagination>
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-collapse>
          <el-collapse-item title="弹幕列表">
            <div style="display:flex;justify-content:space-between;font-size:16px;margin:0 10px 10px 0;"><span>时间</span><span>内容</span></div>
            <div style="display:flex;justify-content:space-between;margin-right: 10px;" v-for="(danmu,index) in danmuList" :key="index"><span>{{danmu[0].toFixed(2)}}</span><span>{{danmu[4]}}</span></div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="6" :offset="1">
        <h3 style="padding-top: 2rem;">推荐</h3>
        <VideoList :videos="videos" :showAuthor="true" style="overflow:hidden;width: 350px;"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
//vue-dplayer
import VueDPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'
import VideoList from '../../components/videoList'
import { getVideoById, getDanmu, sendDanmu, setPlayCount, zan, collect } from '../../api/video'
import { getUserHeadUrl, toggleAtt, addHistory } from '../../api/user'
import { sendComment, getCommentPage, sendCommentReply, deleteComment } from '../../api/comment'
import { mapState } from 'vuex'
export default {
  components: {
    VideoList,
    'd-player': VueDPlayer
  },
  computed: {
    ...mapState(['userId']),
    isAttention() {
      if (this.user.attentionList) {
        return this.user.attentionList.indexOf(this.video.author._id) !== -1
      } else return false
    }
  },
  data() {
    return {
      danmuList:[],
      showAllReply: [],
      user: {},
      videoId: '',
      page: 1,
      who: {},
      danmuCount: 0,
      isReply: [],
      content: '',
      replyContent: '',
      commentList: [],
      video: {},
      more: true,
      //弹幕视频配置
      options: {
        video: {
          url: ''
        },
        danmaku: {
          user: '',
          bottom: '10%',
          unlimited: true
        },
        theme: '#00A1D6',
        apiBackend: {
          read: async (endpoint, callback) => {
            let result = await getDanmu(this.video._id)
            this.danmuList = result.data
            callback('', result.data)
          },
          send: async (url, data, cb) => {
            data.author = this.userId
            data.player = this.videoId
            let result = await sendDanmu(data)
            if (result.err !== 0) {
              return this.$message.error(result.msg)
            }
            this.$message.success(result.msg)
            cb()
          }
        }
      },
      videos: [],
      commentCount: 0,
      heSay: ''
    }
  },
  methods: {
    async togAtt() {
      let result = await toggleAtt({ _id: this.userId, user: this.video.author._id })
      this.user.attentionList = result.data.myUser.attentionList
      this.$message.success(result.msg)
    },
    toggle() {
      //展开更多
      if (this.more) {
        this.$refs.infoDiv.style.height = 'auto'
      }
      //收起
      else {
        this.$refs.infoDiv.style.height = '2rem'
      }
      this.more = !this.more
    },
    //点赞
    async support() {
      if (!this.userId) {
        return this.$message.warning('先登录')
      }
      let result = await zan({ _id: this.video._id, author: this.userId })
      this.video.zanList = result.data
      this.$message.success(result.msg)
    },
    //收藏
    async collect() {
      if (!this.userId) {
        return this.$message.warning('先登录')
      }
      let result = await collect({ _id: this.video._id, author: this.userId })
      this.video.collectList = result.data
      this.$message.success(result.msg)
    },
    //发表评论
    async send() {
      if (!this.content.trim()) {
        this.content = ''
        return this.$message.warning('请输入内容')
      }
      let result = await sendComment({ video: this.video._id, author: this.userId, content: this.content })
      this.$message.success(result.msg)
      result = await getCommentPage(this.video._id)
      this.commentList = result.data.comment
      this.commentCount = result.data.commentCount
      this.content = ''
    },
    //  显示回复文本域
    showArea(who, tag, heSay) {
      for (let i = 0; i < this.isReply.length; i++) {
        this.$set(this.isReply, i, false)
      }
      this.isReply[tag] = true
      this.who = who
      this.heSay = heSay
    },
    //显示所有回复
    showReply(index, event) {
      event.path[1].style.display = 'none'
      this.$set(this.showAllReply, index, true)
    },
    //回复
    async sendReply(commentId) {
      if (!this.replyContent.trim()) {
        this.replyContent = ''
        return this.$message.warning('请输入内容')
      }
      let result = await sendCommentReply({
        _id: commentId,
        from: this.userId,
        to: this.who._id,
        content: this.replyContent,
        video: this.video._id,
        page: this.page,
        heSay: this.heSay
      })
      this.$message.success(result.msg)
      this.commentList = result.data.comment
      this.isReply = new Array(this.commentList.length).fill(false)
      this.commentCount = result.data.commentCount
      this.replyContent = ''
    },
    //删除
    async deleteContent(_id, reply) {
      if(confirm("确认删除吗")){
      let result = await deleteComment({ _id, reply, video: this.video._id, page: this.page })
      this.$message.success(result.msg)
      this.commentList = result.data.comment
      this.isReply = new Array(this.commentList.length).fill(false)
      this.commentCount = result.data.commentCount
      }
    },
    //分页
    async handleCurrent(page) {
      this.page = page
      let result = await getCommentPage(this.video._id, page)
      this.commentList = result.data.comment
      this.isReply = new Array(this.commentList.length).fill(false)
      this.showAllReply = new Array(this.commentList.length).fill(false)
    },
    async init(_id) {
      let result = await getVideoById(_id)
      this.video = result.data.video
      this.videos = result.data.otherVideos
      this.danmuCount = result.data.danmuCount
      this.options.video.url = this.$apiServer + this.video.videoUrl
      this.options.video.type = this.video.videoUrl.split('.').pop()
      await setPlayCount(_id)
      result = await getCommentPage(_id)
      this.commentList = result.data.comment
      this.commentCount = result.data.commentCount
      this.isReply = new Array(this.commentList.length).fill(false)
      this.showAllReply = new Array(this.commentList.length).fill(false)
      if (this.userId) {
        let result = await getUserHeadUrl(this.userId)
        this.user = result.data
        await addHistory({userid:this.userId,videoId:this.video._id,videoAuthor:this.video.author.nick,videoTitle:this.video.title,videoImg:this.video.imgUrl})
      }
    }
  },
  async created() {
    let { _id } = this.$route.params
    this.videoId = _id
    if (_id) this.init(_id)
  }
}
</script>
<style lang="scss" scoped>
.videoTop {
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  p {
    color: #999999;
    font-size: 1.2rem;
  }
}
.userInfo {
  height: 10rem;
  p {
    margin: 0.4rem 0;
    color: #999999;
    font-size: 1.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-button {
    width: 10rem;
  }
}
.player {
  height: 60rem;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  .dplayer /deep/ {
    width: 96rem;
    height: 54rem;
    .dplayer-danmaku-item {
      font-size: 2.5rem;
      font-weight: bold;
    }
  }
}
.zan {
  padding: 2rem 0;
  width: 100%;
  i:before {
    font-size: 2.5rem;
    vertical-align: sub;
    margin-right: 0.2rem;
  }
  .color-true {
    color: #00a1d6;
  }
  .color-false {
    color: #333;
  }
  span {
    margin-right: 2rem;
    cursor: pointer;
    display: inline-block;
    &:hover {
      color: #00a1d6;
    }
  }
}
.info {
  border-top: 1px solid #e5e9ef;
  border-bottom: 1px solid #e5e9ef;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  :first-child {
    height: 2rem;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  :last-child {
    cursor: pointer;
    color: #00a1d6;
  }
}
.comment {
  .item {
    b {
      color: #6d757a;
      font-size: 1.2rem;
      &:hover {
        color: #00a1d6;
      }
    }
    div {
      margin: 1rem 0 0.5rem;
    }
    p {
      margin: 0.8rem 0;
      color: #99a2aa;
      font-size: 1.2rem;
    }
    .replySpan {
      margin-left: 1.5rem;
      cursor: pointer;
      padding: 0.2rem;
      border-radius: 4px;
      &:hover {
        color: #00a1d6;
        background-color: #e5e9ef;
      }
    }
    .toggle {
      color: #6d757a;
    }
  }
}
.el-collapse-item {
  max-height: 360px;
	overflow-y: auto;
}
.el-collapse-item::-webkit-scrollbar {
    width: 4px;
}
.el-collapse-item::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0,0,0,0.2);
}
.el-collapse-item::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}

</style>
