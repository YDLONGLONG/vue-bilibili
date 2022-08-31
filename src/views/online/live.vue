<template>
    <div>
        <div v-if="livesCount">
      <div class="title">
        <span class="el-icon-time"></span>
        直播
      </div>
      <LiveList :lives="lives">
        <template v-slot:pagination>
          <el-pagination
            background
            :current-page="livePage"
            layout="prev, pager, next,total"
            :total="livesCount"
            :page-size="1"
            @current-change="handLivePage"
            hide-on-single-page
          ></el-pagination>
        </template>
      </LiveList>
    </div>
    <div v-else class="noLive">
      <div><img src="../../assets/img/livebg.jpg" class="h1img"></div>
      <h1>主播们正在飞速赶来~~~</h1>
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
import VideoList from '@/components/videoList'
import LiveList from '@/components/liveList'
import { getVideoPage, recommend } from '../../api/video'
import { getOnLive } from '../../api/live'
export default {
  name: 'Home',
  components: { VideoList, LiveList },
  data() {
    return {
      livePage: 1,
      lives: [],
      livesCount: 0,
      videos: [],
      page: 1,
      count: 0
    }
  },
  computed: {},
  methods: {
    async handLivePage(page) {
      this.livePage = page
      let result = await getOnLive(page)
      this.lives = result.data.lives
      this.livesCount = result.data.count
    },
    goto(_id) {
      this.$router.push('/detail/' + _id)
    },
    async init() {
      let result = await getVideoPage()
      this.videos = result.data.videos
      this.count = result.data.count
      result = await recommend()
      result = await getOnLive()
      this.lives = result.data.lives
      this.livesCount = result.data.count
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.title {
  width: 300px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  line-height: 50px;
  span {
    margin-right: 10px;
  }
}
.noLive{
  text-align: center;
}
h1{
  position: relative;
  top:150px;
  font-size: 50px;
}
.h1img{
  position: relative;
  top:150px;
}
</style>