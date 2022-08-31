<template>
  <div class="total">
      <el-row type="flex" v-for="video in videos" :key="video._id" class="list">
        <el-col :span="4">
          <router-link :to="`/detail/${video._id}`">
          <img :src="video.imgUrl | urlFormat" width="240px" height="135px"/>
          </router-link>
        </el-col>
        <el-col :span="14" :offset="2" class="info">
          <h3 class="title">{{ video.title }}</h3>
          <p>{{video.uploadAt | fullDateFormat}}</p>
          <p>播放{{video.playCount}} 点赞{{video.zanList.length}} 收藏{{video.collectList.length}}</p>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-button style="position:relative;top:30%" @click="edit(video._id)">编辑</el-button>
          <el-button style="position:relative;top:30%" @click="deleteVideo(video._id)">删除</el-button>
        </el-col>
      </el-row>
       <el-pagination
            background
            :current-page="page"
            layout="prev, pager, next,total,jumper"
            :total="count"
            :page-size="9"
            @current-change="handleCurrent"
            hide-on-single-page
          ></el-pagination>
  </div>
</template>

<script>
import { getVideoPageByUser, deleteVideoById } from '../../../api/video'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      page: 1,
      sortBy: '',
      //搜索内容
      keyWord: '',
      videos: [],
      count: 0
    }
  },
  computed: {
      ...mapState(['userId'])
    },
    methods: {
      handleCurrent(page) {
        this.page = page
        this.init(page, this.keyWord, this.sortBy)
      },
      edit(id){
        this.$router.push(`/creation/upload/${id}`)
      },
      deleteVideo(_id) {
      this.$confirm('确定要删除吗?', '提示').then(async () => {
        let result = await deleteVideoById(_id)
        this.$message.success(result.msg)
        this.init(this.page, this.keyWord, this.sortBy)
      })
    },
      async init(page = 1, keyWord = '', sortBy = '') {
        let result = await getVideoPageByUser({ author: this.userId, page, keyWord, sortBy })
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
.total{
    margin-top: 3rem;
    width: 85%;
    position: relative;
    left: 15%;
    .list{
      padding: 2rem;
      border-bottom: 1px solid #E7E7E7;
      .title {
      font-weight: bold;
      /* 超出宽度不换行显示省略号*/
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .info{
      display: flex;
      flex-direction : column;
      h3,p{
        flex: 1;
      }
    }
    img{
      border-radius: 1rem;
    }
  }
}
</style>