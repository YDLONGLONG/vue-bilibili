<template>
<div class="bg">
  <div class="total">
    <div class="trendList">
    <el-row type="flex" align="middle">
      <el-col :span="1">
        <router-link :to="`/user/trend/${author._id}`">
          <el-avatar icon="el-icon-user-solid" :size="64" :src="author.headUrl | urlFormat"></el-avatar>
        </router-link>
      </el-col>
      <el-col :span="18" :offset="1">
          <router-link :to="`/user/trend/${author._id}`"><b class="nick">{{ author.nick }}</b></router-link>
          <p class="sign">{{ trendInfo.date | dateFormat }}</p>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-dropdown v-if="this.userId===this.trendInfo.author">
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>置顶</el-dropdown-item>
            <el-dropdown-item><a @click="deleteTrend(trendInfo._id)">删除</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-else>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-button disabled style="border-color:#fff;">举报</el-button>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
        <p v-html="trendInfo.content" class="vhtml">{{trendInfo.content}}</p>
    </el-row>
    <el-row type="flex">
        <el-col :span="3"><a @click="support" style="cursor:pointer" :class="trendInfo.zanList.indexOf(userId) !== -1 ? 'color-true' : 'color-false'"><i class="el-icon-thumb">赞 {{ trendInfo.zanList.length }}</i></a></el-col>
        <el-col :span="3"><i class="el-icon-chat-round">评论 {{ commentCount }}</i></el-col>
    </el-row>
  </div>
  <div class="cr">
  <!--     写评论   -->
        <div disabled>
          <el-row type="flex" align="middle">
            <el-col :span="2">
              <el-avatar icon="el-icon-user-solid" :size="48" :src="user.headUrl | urlFormat" :key="user.headUrl"></el-avatar>
            </el-col>
            <el-col :span="18">
              <el-input type="textarea" v-model="content" rows="3" placeholder="在这里写点什么吧！"></el-input>
            </el-col>
            <el-col :span="3" style="margin-left:1rem">
              <el-button @click="send" type="primary" :disabled="!userId">
                {{ userId ? '发表评论' : '未登录' }}
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22" :push="2" style="margin: 1.5rem 0;border-top: 1px solid #E5E9EF;"></el-col>
          </el-row>
        </div>
  <!--      一条评论    -->
          <el-row class="comment" v-for="(comment, index) in commentList" :key="comment._id">
            <el-col :span="2">
              <router-link :to="`/user/${comment.commentator._id}`">
                <el-avatar icon="el-icon-user-solid" :size="48" :src="comment.commentator.headUrl | urlFormat" :key="comment.commentator.headUrl"></el-avatar>
              </router-link>
            </el-col>
            <el-col :span="22" class="item" style="border-bottom: 1px solid #E5E9EF;padding-bottom: 1rem;margin-bottom: 1rem">
              <router-link :to="`/user/${comment.commentator._id}`">
                <b>{{ comment.commentator.nick }}</b>
              </router-link>
              <div>{{ comment.content }}</div>
              <p>
                <span>{{ comment.date | fullDateFormat }}</span>
                <span v-show="userId">
                  <span @click="showArea(comment.commentator, index)" class="replySpan">
                    回复
                  </span>
                  <span @click="deleteContent(comment._id)" class="replySpan" v-show="userId==comment.commentator._id">删除</span>
                </span>
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
        </div>
  </div>
</div>
</template>
<script>
import { getUserById, getUserHeadUrl } from '../../api/user'
import { getTrendInfo, getCommentPage, zan, sendComment, replyComment, deleteComment, deleteTrend } from '../../api/trend'
import { mapState } from 'vuex'
export default {
  name: 'myTrend',
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      user:{},
      author:{},
      trendInfo:{
        author:'',
        zanList:''
      },
      page: 1,
      commentList:[],
      showAllReply:[],
      isReply: [],
      content: '',
      replyContent: '',
      who: {},
      heSay: '',
      commentCount: 0,
    }
  },
  methods: {
    //删除动态
    async deleteTrend(id){
      if(confirm("确认删除吗")){
      let res = await deleteTrend({_id:id,author:this.userId})
      this.$message.success(res.msg)
      this.$router.push('/mine/trend')
      }
    },
    //发表评论
    async send() {
      if (!this.content.trim()) {
        this.content = ''
        return this.$message.warning('请输入内容')
      }
      let result = await sendComment({ trend: this.trendInfo._id, commentator: this.userId, content: this.content })
      this.$message.success(result.msg)
      result = await getCommentPage(this.trendInfo._id)
      this.commentList = result.data.comment
      this.commentCount = result.data.commentCount
      this.content = ''
    },
    //删除
    async deleteContent(_id, reply) {
      if(confirm("确认删除吗")){
      let result = await deleteComment({ _id, reply, trend: this.trendInfo._id, page: this.page })
      this.$message.success(result.msg)
      this.commentList = result.data.comment
      this.isReply = new Array(this.commentList.length).fill(false)
      this.commentCount = result.data.commentCount
      }
    },
    //分页
    async handleCurrent(page) {
      this.page = page
      let result = await getCommentPage(this.trendInfo._id, page)
      this.commentList = result.data.comment
      this.isReply = new Array(this.commentList.length).fill(false)
      this.showAllReply = new Array(this.commentList.length).fill(false)
    },
    //点赞
    async support() {
      if (!this.userId) {
        return this.$message.warning('先登录')
      }
      let result = await zan({ _id: this.trendInfo._id, author: this.userId })
      this.trendInfo.zanList = result.data
      this.$message.success(result.msg)
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
      let result = await replyComment({
        _id: commentId,
        from: this.userId,
        to: this.who._id,
        content: this.replyContent,
        trend: this.trendInfo._id,
        page: this.page,
        heSay: this.heSay
      })
      this.$message.success(result.msg)
      this.commentList = result.data.comment
      this.isReply = new Array(this.commentList.length).fill(false)
      this.commentCount = result.data.commentCount
      this.replyContent = ''
    },
    showImg(){
      var content = document.getElementsByClassName('vhtml')[0].getElementsByTagName('img');
      if(content.length!=0){
      var oldwidth,oldheight;
      var maxwidth=600;
      var maxheight=300;
      if(content[0].width > content[0].height)
        {
            if(content[0].width > maxwidth)
            {
                oldwidth = content[0].width;
                content[0].height = content[0].height * (maxwidth/oldwidth);
                content[0].width = maxwidth;
            }
        }else{
            if(content[0].height > maxheight)
            {
                oldheight = content[0].height;
                content[0].width = content[0].width * (maxheight/oldheight);
                content[0].height = maxheight;
            }
        }
      }
    },
    async init(_id) {
      let result1 = await getTrendInfo(_id)
      this.trendInfo = result1.data[0]

      let result2 = await getUserHeadUrl(this.trendInfo.author)
      this.author = result2.data
      
      let result3 = await getUserById(this.userId)
      this.user = result3.data
      
      let result4 = await getCommentPage(_id)
      this.commentList = result4.data.comment
      this.commentCount = result4.data.commentCount
      this.isReply = new Array(this.commentList.length).fill(false)
      this.showAllReply = new Array(this.commentList.length).fill(false)

      this.showImg();
    }
  },
    created() {
    let { _id } = this.$route.params
    if(_id) this.init(_id)
  },
  mounted(){
    this.$bus.$on('globalEvent',async (val)=>{
        let { _id } = this.$route.params
        let result = await getCommentPage(_id,val)
        result.data.comment.forEach(item=>{
          this.commentList.push(item)
        })
      })
  }
}
</script>
<style lang="scss" scoped>
.total{
  background-color: #fff;
  position: relative;
  left: 25%;
  width: 700px;
  height: 100%;
  border: 1px solid #fff;
  border-radius: 1%;
}
.trendList {
  width: 70rem;
  margin: 3rem 0 0;
  border-radius: 0.5rem;
  border: 1px solid #d7dae2;
  .el-row {
    padding: 2rem;
    margin-bottom: 1rem;
    .nick {
      font-size: 16px;
      padding-left: 3rem;
    }
    .sign{
      padding-left: 3rem;
    }
    .el-col > p:nth-child(2) {
      color: #6d757a;
      margin-top: 1rem;
      font-size: 1.2rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .color-true {
    color: #00a1d6;
    }
    .color-false {
      color: #333;
    }
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
.cr{
  width: 700px;
  margin-top: 2rem;
}
</style>
