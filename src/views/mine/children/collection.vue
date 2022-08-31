<template>
  <div class="collect">
    <VideoList :videos="videos" :showAuthor="true">
      <template v-slot:option="video">
        <el-row>
          <el-col :span="6" :offset="17" class="el-icon-delete" style="font-size: 1.2rem" @click.native="cancel(video._id)">
            取消收藏
          </el-col>
        </el-row>
      </template>
      <template v-slot:pagination>
        <el-pagination
          background
          :current-page="page"
          layout="prev, pager, next,total,jumper"
          :total="count"
          :page-size="9"
          @current-change="handleCurrent"
          hide-on-single-page
        ></el-pagination>
      </template>
    </VideoList>
  </div>
</template>
<script>
import VideoList from '../../../components/videoList'
import { getCollection, toggleAtt } from '../../../api/user'
import { collect } from '../../../api/video'
import { mapState } from 'vuex'
export default {
  name: 'myCollection',
  components: { VideoList },
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      page: 1,
      count: 0,
      videos: []
    }
  },
  methods: {
    cancel(_id) {
      this.$confirm('确定要取消吗?', '提示').then(async () => {
        let result = await collect({ _id, author: this.userId })
        this.init(this.page)
        this.$message.success(result.msg)
      })
    },
    //分页变化时
    handleCurrent(page) {
      this.page = page
      this.init(page)
    },
    async init(page = 1) {
      let result = await getCollection(this.userId, page)
      this.videos = result.data.collection
      this.count = result.data.count
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.collect {
  margin-top: 3rem;
  .el-row {
    margin-top: 0.8rem;
    font-size: 1.2rem;
    color: #999;
    .el-col:last-child {
      font-size: 1.4rem;
      color: #333;
      cursor: pointer;
      &:hover {
        color: #00a1d6;
      }
    }
    .el-icon-delete:before {
      margin-right: 4px;
    }
  }
}
</style>
