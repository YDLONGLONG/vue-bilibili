<!-- 视频列表 -->
<template>
  <div>
    <div class="list">
      <el-col :span="6" v-for="video in videos" :key="video._id">
        <router-link target="_blank" :to="`/detail/${video._id}`" class="videoLink">
          <img :src="video.imgUrl | urlFormat" />
        </router-link>
        <div class="rest">
          <div>
            <router-link target="_blank" :to="`/detail/${video._id}`" class="title">{{ video.title }}</router-link>
          </div>
          <!--       显示时间及播放量 收藏  个人页  -->
          <div v-if="showAuthor">
            <router-link class="el-icon-user" :to="`/user/${video.author._id}`">{{ video.author.nick }}</router-link>
          </div>
          <div style="margin-top: 0.8rem">
            <i class="el-icon-video-play" title="播放数">{{ video.playCount }}</i>
            <i class="el-icon-time" title="上传时间">{{ video.uploadAt | fullDateFormat }}</i>
            <i class="el-icon-star-off" title="收藏数">{{ video.collectList.length }}</i>
          </div>
          <!--      附加功能的插槽    -->
          <slot name="option" :_id="video._id"></slot>
        </div>
      </el-col>
    </div>
    <!-- 分页插槽 -->
    <slot name="pagination"></slot>
  </div>
</template>
<script>
export default {
  name: 'videoList',
  props: { videos: Array, showAuthor: Boolean }
}
</script>
<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 1200px;
  .el-col {
    width: 320px;
    //margin-bottom: 3rem;
    margin: 1rem;
    img {
      width: 320px;
      height: 180px;
      object-fit: cover;
      &:hover {
        transition: 0.2s;
        // transform: scale(1.1);
      }
    }
  }
}
.videoLink {
  display: block;
  line-height: 0;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.rest {
  padding: 1.2rem 0.8rem;
  // border-color: #b8c0cc;
  border-color: white;
  border-style: solid;
  border-width: 0 1px 1px;
  border-radius: 0 0 8px 8px;
  p {
    margin: 0.6rem 0;
  }
  i {
    color: #999999;
    margin-right: 8px;
    font-size: 1.2rem;
    &:before {
      margin-right: 4px;
    }
  }
  .el-icon-user {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #999;
    &:hover {
      color: #00a1d6;
    }
  }
}
.title{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
