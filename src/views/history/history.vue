<template>
  <div>
    <router-link :to="`/detail/${video.videoId}`" v-for="(video, index) in videos" :key="video._id" class="item">
      <el-row type="flex" align="middle">
        <el-col :span="6"><img :src="video.videoImg | urlFormat" width="240px" height="135px"/></el-col>
        <el-col :span="8" :offset="1">
          <h3 class="title">{{ video.videoTitle }}</h3>
        </el-col>
        <el-col :span="8" :offset="1">
          <h3 class="title">观看时间：{{ video.date | fullDateFormat }}</h3>
        </el-col>
      </el-row>
    </router-link>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getUserInfo } from '../../api/user'
export default {
  data() {
    return {
      videos: []
    }
  },
    computed: {
    ...mapState(["userId"])
  },
  
  methods: {
    async init() {
      if (!this.userId) {
        this.$message.warning('请先登录')
        return await this.$router.push('/login')
      }
      let result = await getUserInfo(this.userId)
      this.videos = result.data[0].history
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
/* 排行项目 */
.item {
  display: block;
  margin: 20px 0;
  height: 160px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  &:hover {
    transition: 0.2s;
    box-shadow: 5px 5px 5px #dadada;
  }
  img {
    border-radius: 0.4rem;
    &:hover {
      transition: 0.2s;
      transform: scale(1.1);
    }
  }
  .el-row {
    height: 100%;
    .num {
      color: #b8c0cc;
      font-size: 30px;
    }
    .title {
      font-weight: bold;
      /* 超出宽度不换行显示省略号*/
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
