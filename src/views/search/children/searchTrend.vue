<template>
<div>
  <div class="trendList" v-show="trendList.length" v-for="trend in trendList" :key="trend._id">
    <el-row type="flex" align="middle">
    <el-col>
        <p class="sign">{{ trend.date | dateFormat }}</p>
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
    </div>
</div>
</template>
<script>
import { searchTrend } from '../../../api/trend'
export default {
  name: 'searchTrend',
  data() {
    return {
      keyWord: '',
      trendList:[]
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
    async init() {
      let res = await searchTrend(this.keyWord)
      this.trendList = res.data.trends
    }
  },
  created() {
    let { keyWord } = this.$route.query
    this.keyWord = keyWord
    this.init()
  },
}
</script>
<style lang="scss" scoped>
.trendList {
  width: 70rem;
  margin: 3rem 0 0;
  border-radius: 0.5rem;
  border: 1px solid #d7dae2;
  .tc{
    max-height:12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
  .el-row {
    padding: 2rem;
    margin-bottom: 1rem;
  }
}
</style>
