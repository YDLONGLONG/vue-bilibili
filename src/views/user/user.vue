<template>
  <div>
    <!-- 顶部 -->
    <div class="topBg">
      <el-row type="flex" align="middle">
        <el-col :span="2" style="text-align: center">
          <el-avatar :size="64" :src="user.headUrl | urlFormat" :key="user._id"></el-avatar>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 1.6rem">{{ user.nick }}</span>
          &nbsp;
          <!--    性别图标 -->
          <i class="el-icon-female el-icon" style="color:#FF758F" v-if="user.sex"></i>
          <i class="el-icon-male el-icon" style="color:#5FD4F2;" v-else></i>
          <div class="sign">
            <p style="color: #D6DEE4" title="个性签名">{{ user.sign }}</p>
          </div>
        </el-col>
        <el-col :span="2" :offset="11" v-if="userId && userId !== id">
          <el-button :type="isAttention ? 'success' : 'danger'" @click="togAtt">
            {{ isAttention ? '已关注' : '关注' }}
          </el-button>
        </el-col>
        <el-col :span="2" :offset="11" v-else>
          <el-button v-if="!userId" type="primary" disabled>未登录</el-button>
        </el-col>
      </el-row>
    </div>
    <!--  中间文字  -->
    <div class="middle">
      <el-row>
        <router-link :to="`/user/video/${user._id}`">
          <el-col :span="2">
            <i class="el-icon-video-camera" style="color: #00C091;margin: 4px"></i>
            他的视频
          </el-col>
        </router-link>
        <router-link :to="`/user/trend/${user._id}`">
          <el-col :span="2">
            <i class="el-icon-star-off" style="color: #00C091;margin: 4px"></i>
            他的动态
          </el-col>
        </router-link>
        <el-col :span="2" :offset="15" style="line-height: 200%;font-size: 1.4rem;">
          <p>粉丝数</p>
          <span>{{ user.fansCount }}</span>
        </el-col>
        <el-col :span="2" style="line-height: 200%;font-size: 1.4rem;">
          <p>关注数</p>
          <span>{{ attentionListLength }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { getUserById, toggleAtt, getAttentionList, getUserInfo } from '../../api/user'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userId']),
    isAttention() {
      return this.attentionList.indexOf(this.id) !== -1
    }
  },
  data() {
    return {
      id: '',
      user: {},
      page: 1,
      attentionList: [],
      attentionListLength:''
    }
  },
  methods: {
    //切换 关注
    async togAtt() {
      let result = await toggleAtt({ _id: this.userId, user: this.id })
      this.user.fansCount = result.data.targetUser.fansCount
      this.attentionList = result.data.myUser.attentionList
      this.$message.success(result.msg)
    },
    async init() {
      this.id = this.$route.params.id
      let result = await getUserById(this.id)
      this.user = result.data
      if (this.userId) {
        result = await getAttentionList(this.userId)
        this.attentionList = result.data.attentionList
        this.attentionListLength = result.data.attentionList.length
      }
    }
  },
  created() {
    if (this.$route.params.id === this.userId) {
      // this.$router.replace('/mine')
      this.$notify({
          title: '这是我的空间在新访客眼中的样子',
          message: '点击 X 关闭预览',
          duration:5000,
          onClose(){
            // window.history.back()
          }
        });
    }
    this.init()
  }
}
</script>
<style lang="scss" scoped>
/*顶部 */
.topBg {
  height: 200px;
  background: url('../../assets/img/headerbj.png') no-repeat;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  .el-row {
    background-image: linear-gradient(rgba(1, 1, 1, 0.1) 30%, rgba(1, 1, 1, 0.5));
    padding: 8px;
  }
  .el-icon {
    font-size: 1.5em;
    font-weight: bold;
  }
  .sign {
    font-size: 1.2rem;
    height: 20px;
    margin-top: 0.8rem;
  }
}
/*  中间*/
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
/*点击后显示的样式*/
.active {
  color: #00a1d6;
  border-bottom: 1px solid #00a1d6;
}
.topMenu {
  margin-bottom: 2rem;
  text-align: center;
  line-height: 42px;
  .el-col:not(:first-child) {
    cursor: pointer;
  }
}
.el-icon-delete {
  margin-top: 0.8rem;
  cursor: pointer;
  &:hover {
    color: #00a1d6;
  }
  &:before {
    margin-right: 4px;
  }
}
</style>
