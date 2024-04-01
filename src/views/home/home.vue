<template>
  <div style="overflow: hidden">
    <!-- <vue-qr :text="this.qrcode" :size="200"></vue-qr>{{ noticeTxt }} -->
    <!-- 导航栏 -->
    <div class="type">
      <el-row type="flex" align="middle" class="left">
        <el-col :offset="3"
          ><router-link :to="`/home`"
            ><div><img src="../../assets/img/shouye.png" /></div>
            首页</router-link
          ></el-col
        >
        <el-col
          ><router-link :to="`/trendmaster`"
            ><div><img src="../../assets/img/dongtai.png" /></div>
            动态</router-link
          ></el-col
        >
        <el-col
          ><router-link :to="`/top`"
            ><div><img src="../../assets/img/remen.png" /></div>
            热门</router-link
          ></el-col
        >
        <el-col
          ><router-link :to="`/`"
            ><div @click="pay()"><img src="../../assets/img/pindao.png" /></div>
            频道</router-link
          ></el-col
        >
      </el-row>
      <el-row>
        <ul class="middle">
          <li>动画</li>
          <li>音乐</li>
          <li>舞蹈</li>
          <li>知识</li>
          <li>生活</li>
          <li>时尚</li>
          <li>娱乐</li>
          <li>放映厅</li>
          <li>番剧</li>
          <li>国创</li>
          <li>游戏</li>
          <li>科技</li>
          <li>鬼畜</li>
          <li>资讯</li>
          <li>影视</li>
          <li>更多</li>
        </ul>
      </el-row>
      <el-row>
        <ul class="right">
          <li>专栏</li>
          <li>活动</li>
          <li>社区中心</li>
          <li>直播</li>
          <li>课堂</li>
          <li>新歌热榜</li>
        </ul>
      </el-row>
    </div>
    <div class="header">
      <!-- 轮播图 -->
      <div class="carousel">
        <el-carousel height="250px">
          <el-carousel-item
            v-for="item in lunbo"
            :key="item._id"
            v-if="item.isAdopt === true"
            @click.native="goto(item._id)"
            :style="`background: url(http://localhost:3000${item.imgUrl}) no-repeat center/88%;cursor: pointer;`"
            ><div class="ctitle">{{ item.title }}</div></el-carousel-item
          >
        </el-carousel>
      </div>
      <!-- 换一换 -->
      <div class="list">
        <el-col :span="6" v-for="video in randomVideos" :key="video._id">
          <router-link
            target="_blank"
            :to="`/detail/${video._id}`"
            class="videoLink"
          >
            <img :src="video.imgUrl | urlFormat" />
            <div class="bottom">
              <div style="padding: 2rem">
                <h3>{{ video.title }}</h3>
                <p>UP {{ video.author.nick }}</p>
                <p>{{ video.playCount }}次播放</p>
              </div>
            </div>
          </router-link>
        </el-col>
      </div>
    </div>
    <!-- 右侧分类 -->
    <div>
      <ul class="fl">
        <li v-for="(type, index) in types" :key="index">
          <el-button
            size="medium"
            :type="type.btnType"
            @click="getPageByType(index)"
            round
            >{{ type.name }}</el-button
          >
        </li>
      </ul>
    </div>
    <div class="main">
      <!-- 中间视频列表 -->
      <div class="middle">
        <!-- 标题 -->
        <div class="title">
          本站视频<el-button type="info" style="margin: 0 20px">{{
            types[index].name
          }}</el-button>
        </div>
        <!-- 视频列表 -->
        <VideoList :videos="videos" :showAuthor="true">
          <!-- <template v-slot:pagination>
          <el-pagination
            background
            :current-page="page"
            layout="prev, pager, next,total,jumper"
            :total="count"
            :page-size="8"
            @current-change="handleCurrent"
            hide-on-single-page
          ></el-pagination>
        </template> -->
        </VideoList>
      </div>
      <!-- 右侧列表 -->
      <div class="rightList">
        <h1 class="rt">排行榜</h1>
        <router-link
          :to="`/detail/${video._id}`"
          v-for="(video, index) in videos"
          :key="video._id"
          class="item"
        >
          <div class="rl">
            <span>{{ index + 1 }} </span>
            <span>{{ video.title }}</span>
          </div>
        </router-link>
      </div>
    </div>
    <!-- 末尾直播 -->
    <div v-show="livesCount">
      <div class="title">本站直播</div>
      <LiveList :lives="lives">
        <!-- <template v-slot:pagination>
          <el-pagination
            background
            :current-page="livePage"
            layout="prev, pager, next,total,jumper"
            :total="livesCount"
            :page-size="1"
            @current-change="handLivePage"
            hide-on-single-page
          ></el-pagination>
        </template> -->
      </LiveList>
    </div>
  </div>
</template>
<script>
import VideoList from "@/components/videoList";
import LiveList from "@/components/liveList";
import { getVideoPage, recommend, getRandomVideoPage } from "../../api/video";
import { getOnLive, pay, getPayStatus } from "../../api/live";
import vueQr from "vue-qr";
export default {
  name: "Home",
  components: { VideoList, LiveList, vueQr },
  data() {
    return {
      livePage: 1,
      lives: [],
      livesCount: 0,
      type: "",
      types: [
        // 视频分类
        {
          name: "生活",
        },
        {
          name: "科技",
        },
        {
          name: "游戏",
        },
        {
          name: "校园",
        },
        {
          name: "教育",
        },
        {
          name: "音乐",
        },
        {
          name: "电影",
        },
        {
          name: "首页",
        },
      ],
      lunbo: [],
      videos: [],
      randomVideos: [],
      page: 1,
      count: 0,
      index: 7,
      qrcode: "",
      noticeTxt: "请扫码完成支付",
    };
  },
  computed: {},
  methods: {
    // 创建支付订单
    async pay() {
      let data = {
        price: 0.01,
        name: "商品",
      };
      let result = await pay(data);
      this.qrcode = result.alipay_trade_precreate_response.qr_code;
      this.checkPayStatus(result.alipay_trade_precreate_response.out_trade_no);
      console.log(result);
    },
    // 轮询支付状态
    checkPayStatus(orderId) {
      let payTimer = setTimeout(() => {
        clearTimeout(payTimer);
        getPayStatus({ orderId }).then((queryRes) => {
          if (queryRes.code === "40004") {
            this.noticeTxt = "交易不存在";
          }
          console.log(queryRes);
        });
      }, 1500);
    },
    // 获取直播列表
    async handLivePage(page) {
      this.livePage = page;
      let result = await getOnLive(page);
      this.lives = result.data.lives;
      this.livesCount = result.data.count;
    },
    goto(_id) {
      this.$router.push("/detail/" + _id);
    },
    // 新增视频列表
    async getPageByType(type) {
      if (type === 7) {
        this.type = "";
      } else {
        this.type = type;
      }
      let result = await getVideoPage(1, this.type);
      this.videos = result.data.videos;
      this.count = result.data.count;
      this.index = type;
    },
    // 获取视频列表
    async handleCurrent(page) {
      this.livePage = page;
      let result = await getVideoPage(page, this.type);
      this.videos = result.data.videos;
      this.count = result.data.count;
    },
    async init() {
      let result = await getVideoPage();
      this.videos = result.data.videos;
      this.count = result.data.count;
      result = await recommend();
      this.lunbo = result.data;
      result = await getOnLive();
      this.lives = result.data.lives;
      this.livesCount = result.data.count;
      result = await getRandomVideoPage();
      this.randomVideos = result.data;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.$bus.$on("globalEvent", async (val) => {
      let result = await getVideoPage(val, this.type);
      this.videos = [...this.videos, ...result.data.videos];
    });
  },
};
</script>
<style lang="scss" scoped>
.type {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 20% 60% 20%;
  .left {
    width: 300px;
    height: 70px;
    border-right: gainsboro 1px solid;
  }
  .middle {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    li {
      margin: 1rem;
      width: 80px;
      height: 10px;
      text-align: center;
    }
    border-right: gainsboro 1px solid;
  }
  .right {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    li {
      margin: 1rem;
      width: 60px;
      height: 10px;
    }
  }
}
.header {
  display: grid;
  grid-template-columns: 37% 61%;
  // 轮播图
  .carousel {
    margin-bottom: 20px;
    margin-top: 20px;
    width: 550px;
    display: inline-block;
    .ctitle {
      position: relative;
      top: 80%;
      left: 10%;
      font-size: 20px;
      font-weight: bold;
      color: tomato;
    }
  }
  .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 900px;
    .bottom {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      position: absolute;
      display: none;
      height: 120px;
      width: 200px;
      top: 0;
    }
    .el-col:hover .bottom {
      display: block;
    }
    .el-col {
      width: 200px;
      //margin-bottom: 3rem;
      margin: 1rem;
      position: relative;
      img {
        width: 200px;
        height: 120px;
        object-fit: cover;
        &:hover {
          transition: 0.2s;
          // transform: scale(1.1);
        }
      }
    }
  }
}

.title {
  width: 300px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  line-height: 50px;
  margin: 10px 0 30px 0;
  span {
    margin-right: 10px;
  }
}

.main {
  display: grid;
  grid-template-columns: 69% 31%;
  .rightList {
    position: relative;
    top: 63px;
    width: 400px;
    height: 300px;
    margin-left: 30px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.rt {
  text-align: center;
}
.rl {
  padding: 8px;
}
.fl {
  position: absolute;
  left: 90%;
  top: 25%;
}
.item:nth-child(-n + 4) {
  span:nth-child(1) {
    color: white;
    background-color: rgb(0, 162, 255);
  }
}
.changebutton {
  position: absolute;
  left: 90.6%;
  top: 19%;
}
</style>
