<template>
  <div>
    <div style="margin-top: 2rem">
      <el-row class="topMenu" v-show="count > 8">
        <!--    搜索框    -->
        <el-col :span="3" :offset="6">
          <el-input size="small" placeholder="搜索视频" prefix-icon="el-icon-search" v-model="keyWord" @keyup.enter.native="search"></el-input>
        </el-col>
        <el-col :span="1" :offset="1" ref="col1" @click.native="sort('uploadAt', $event)">
          最新上传
        </el-col>
        <el-col :span="1" :offset="1" ref="col2" @click.native="sort('playCount', $event)">
          最多播放
        </el-col>
      </el-row>
      <div style="display:flex;">
      <div style="width: 1100px;">
        <VideoList :videos="videos">
          <template v-slot:pagination>
            <el-pagination
              background
              :current-page="page"
              layout="prev, pager, next,total,jumper"
              :total="count"
              :page-size="8"
              @current-change="handleCurrent"
              hide-on-single-page
            ></el-pagination>
          </template>
        </VideoList>
      </div>
      <div class="grjj">
        <h1>个人资料</h1>
        <hr>
        <div>
          <p><i class="el-icon-user-solid"></i>年龄：{{userinfo.age ? userinfo.age : '暂未设置'}}</p>
          <p><i class="el-icon-phone"></i>电话：{{userinfo.phone ? userinfo.phone : '暂未设置'}}</p>
          <p v-if="userinfo.birth"><i class="el-icon-burger"></i>生日：{{userinfo.birth|dateFormat}}</p><p v-else>生日：暂未设置</p>
          <p><i class="el-icon-office-building"></i>地址：{{userinfo.address ? userinfo.address : '暂未设置'}}</p>
          <p><i class="el-icon-tickets"></i>个人简介：{{userinfo.introduction ? userinfo.introduction : '暂未设置'}}</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import { getUserById, getUserInfo } from '../../../api/user'
import { getVideoPageByUser } from '../../../api/video'
import VideoList from '../../../components/videoList'
import { mapState } from 'vuex'
export default {
  components: { VideoList },
  computed: {
    ...mapState(['userId']),
  },
  data() {
    return {
      user: {},
      userinfo:{
        age:'暂未设置',
        phone:'暂未设置',
        birth:'',
        address:'暂未设置',
        introduction:'暂未设置'
      },
      page: 1,
      sortBy: '',
      //搜索内容
      keyWord: '',
      videos: [],
      count: 0,
    }
  },
  methods: {
    handleCurrent(page) {
      this.page = page
      this.init(page, this.keyWord, this.sortBy)
    },
    search() {
      // 重置样式
      this.$refs.col1.$el.className = 'el-col el-col-1 el-col-offset-1'
      this.$refs.col2.$el.className = 'el-col el-col-1 el-col-offset-1'
      if (!this.keyWord.trim()) {
        this.keyWord = ''
      }
      this.init(1, this.keyWord)
      this.page = 1
      this.sortBy = ''
    },
    sort(key, eve) {
      // 重置样式
      this.$refs.col1.$el.className = 'el-col el-col-1 el-col-offset-1'
      this.$refs.col2.$el.className = 'el-col el-col-1 el-col-offset-1'
      eve.target.className += ' active'
      this.sortBy = key
      this.init(1, this.keyWord, key)
      this.page = 1
    },
    async init(page = 1, keyWord = '', sortBy = '') {
      this.id = this.$route.params.id
      let result = await getUserById(this.id)
      this.user = result.data
      if (this.userId) {
        let res = await getUserInfo(this.id);
        this.userinfo.age = res.data[0].age
        this.userinfo.phone = res.data[0].phone
        this.userinfo.birth = res.data[0].birth
        this.userinfo.address = res.data[0].address
        this.userinfo.introduction = res.data[0].introduction 
      }
      result = await getVideoPageByUser({ author: this.id, page, keyWord, sortBy })
      this.videos = result.data.videos
      this.count = result.data.count
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
/*顶部 */
.topBg {
  height: 200px;
  background: url('../../../assets/img/headerbj.png') no-repeat;
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
  .el-row{
    .el-col:nth-last-child(-n+2){
      position: relative;
      left: 75%;
    }
  }
}
.grjj{
  margin-left: 20px;
  border: 1px solid rgb(215,218,226);
  border-radius: 10px;
  width: 320px;
  height: 500px;
  h1{
    margin: 10px;
    text-align: center;
    color: grey;
  }
  p{
    margin: 10px;
    font-size: 16px;
    color: grey;
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
