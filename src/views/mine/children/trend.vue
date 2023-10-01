<template>
  <div>
    <div class="trendList" v-show="trendList.length" v-for="trend in trendList" :key="trend._id">
    <el-row type="flex" align="middle">
      <el-col :span="1">
        <el-avatar icon="el-icon-user-solid" :size="64" :src="user.headUrl | urlFormat"></el-avatar>
      </el-col>
      <el-col :span="18" :offset="1">
          <b class="nick">{{ user.nick }}</b>
          <p class="sign">{{ trend.date | dateFormat }}</p>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-button disabled style="border-color:#fff;">置顶</el-button>
            <el-dropdown-item><a @click="deleteTrend(trend._id)">删除</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <router-link :to="`/trendinfo/${trend._id}`">
        <p class="tc" v-html="trend.content"></p>
      </router-link> 
    </el-row>
    <el-row>
      <router-link :to="`/trendinfo/${trend._id}`">
        <p>点击查看更多</p>
      </router-link> 
    </el-row>
    <el-row type="flex">
      <el-col :span="2"><i class="el-icon-thumb"></i>赞 {{ trend.zanList.length }}</el-col>
      <el-col :span="2"><i class="el-icon-chat-round"></i>评论</el-col>
    </el-row>
  </div>
  </div>
</template>
<script>
import { getUserById } from '../../../api/user'
import { getTrendPage, deleteTrend } from '../../../api/trend'
import { mapState } from 'vuex'
export default {
  name: 'myTrend',
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      user:{},
      trendList:[],
      more: true,
    }
  },
  updated(){
    let DomList=document.getElementsByClassName('tc')
    for(let i of DomList){
      let DomListImg = i.querySelectorAll('img')
      for(let i in DomListImg){
        if( DomListImg[i].style){
          DomListImg[i].style.width='100px';
          DomListImg[i].style.height='100px';
          DomListImg[i].style.float='left';
        }
      }
    }
  },
  methods: {
    async deleteTrend(id){
      if(confirm("确认删除吗")){
      let res = await deleteTrend({_id:id,author:this.userId})
      this.$message.success(res.msg)
      }
    },
    async init(page = 1) {
        let result = await getUserById(this.userId)
      this.user = result.data
      let res = await getTrendPage(this.userId,page)
      this.trendList = res.data.trend
      this.count = res.data.trendCount
    }
  },
  created() {
    this.init()
  },
  mounted(){
    this.$bus.$on('globalEvent',async (val)=>{
        let result = await getTrendPage(this.userId,val)
          result.data.trend.forEach(item=>{
          this.trendList.push(item)
        })
      })
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
    max-height:12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    white-space: normal;
    &:hover{
      color: black;
    }
  }
}
.el-dropdown-link {
    cursor: pointer;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
