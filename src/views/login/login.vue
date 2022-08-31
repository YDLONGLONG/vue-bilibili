<template>
  <div>
    <!-- 背景图 -->
    <div class="bg">
    </div>
    <div class="left">
      <p>提交BUG请访问：<a href="http://www.wego666.top/">官方论坛</a></p>
      <p>更多玩法请访问：<a href="https://ydlonglong.github.io">个人博客</a></p>
      <img src="https://s1.hdslb.com/bfs/static/passport/static/img/2233login.af9c53d.png">
      <p>登录即代表你同意<a href="https://www.bilibili.com/protocal/licence.html">用户协议</a>和<a href="https://www.bilibili.com/blackboard/privacy-pc.html">隐私政策</a></p>
      <div v-show="this.$route.path=='/login/codelogin' || this.$route.path=='/login/phonelogin'">
      <p>验证码登录时</p>
      <p>未注册的用户将自动注册</p>
      <p>用户初始密码为:123456</p>
      </div>
    </div>
    <div class="login">
      <img src="../../assets/img/qqtx.jpg" />
      <div class="form">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
// 登录背景
.bg {
  position: fixed;
  left: 0;
  height: 100%;
  width: 100%;
  background: url('../../assets/img/loginbj.jpeg') no-repeat fixed left top/100% 100%;
  filter: blur(1px);
}
.login {
  position: absolute;
  background: white;
  left: 65%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60rem;
  height: 45rem;
  border-radius: 30px;
  img {
    position: absolute;
    background-color: white;
    top: -12%;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 2px 2px 3px black;
  }
}
.form {
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.left{
  position: absolute;
  background: white;
  left: 33%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60rem;
  height: 45rem;
  border-radius: 30px;
  p{
    margin: 10px;
    font-size: 20px;
    text-align: center;
    a{
      color: brown;
    }
  }
  img{
    position: relative;
    left: 10%;
  }
}
</style>
