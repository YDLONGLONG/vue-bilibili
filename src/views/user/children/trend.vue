<template>
  <div>
    <div class="trendList" v-show="trendList.length" v-for="trend in trendList" :key="trend._id">
    <el-row type="flex" align="middle">
      <el-col :span="1">
        <el-avatar icon="el-icon-user-solid" :size="64" :src="trend.author.headUrl | urlFormat"></el-avatar>
      </el-col>
      <el-col :span="18" :offset="1">
          <b class="nick">{{ trend.author.nick }}</b>
          <p class="sign">{{ trend.date | dateFormat }}</p>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>举报</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <router-link target="_blank" :to="`/trendinfo/${trend._id}`">
        <p class="tc" v-html="trend.content">{{trend.content}}</p>
      </router-link> 
    </el-row>
    <el-row>
      <router-link :to="`/trendinfo/${trend._id}`">
        <p>点击查看更多</p>
      </router-link> 
    </el-row>
    <el-row type="flex">
        <el-col :span="2"><i class="el-icon-thumb"></i>赞 {{ trend.zanList.length }}</el-col>
        <el-col :span="2"><i class="el-icon-chat-round"></i>评论 {{ trend.zanList.length }}</el-col>
    </el-row>
  </div>
  </div>
</template>
<script>
import { getTrendPage } from '../../../api/trend'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
        user:{},
      trendList:[],
    }
  },
  methods: {
    async init(page = 1) {
      this.id = this.$route.params.id
      let res = await getTrendPage(this.id ,page)
      this.trendList = res.data.trend
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
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
  }
  .tc{
    height:12rem;
    overflow: hidden;
    &:hover{
      color: black;
    }
  }
}
</style>
