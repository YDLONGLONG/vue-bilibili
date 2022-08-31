<template>
  <div>
    <el-form :model="userLogin" :rules="rules" status-icon ref="userLogin">
      <el-form-item prop="phone">
        <el-input v-model="userLogin.phone" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-col :span="14">
          <el-input v-model.number="userLogin.code" placeholder="输入验证码"></el-input>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary" @click="sendCode">{{ btnText }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:28rem" @click="codelogin">提交</el-button>
      </el-form-item>
      <router-link replace to="/login/loginForm" style="color: #00A1D6;display: inline-block;margin-right:50px">
        返回密码登录
      </router-link>
      <router-link replace to="/login/codelogin" style="color: #00A1D6;display: inline-block;margin-left:50px">
        邮箱验证登录
      </router-link>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { phonelogin } from '../../../api/user'
import axios from 'axios'
import md5 from 'js-md5'
export default {
  data() {
    return {
      userLogin: {
        phone: '',
        code:''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur'},
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { type: 'number', message: '请输入正确的6位验证码', trigger: 'blur' }
        ]
      },
      btnText: '点击获取',
      isDisabled: false,
      code:'',
      beginTime:''
    }
  },
  methods: {
    ...mapActions(['setUserId']),
    //转换时间戳
    pad2(n) {
        return n < 10 ? '0' + n : n
    },
    getTime() {
        var date = new Date();
        var time = date.getFullYear().toString() + this.pad2(date.getMonth() + 1) +
            this.pad2(date.getDate()) + this.pad2(date.getHours()) + this.pad2(date.getMinutes()) + this.pad2(date
                .getSeconds())
        return time
    },
    //生成验证码
    getCode(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    async codelogin() {
      this.$refs.userLogin.validate(async valid => {
        if (valid) {
            console.log(Number(this.beginTime)+5*60)
            console.log(this.getTime())
          if(Number(this.beginTime)+5*60<this.getTime()){
            this.$message.error("验证码已过期,请重新获取")
          }else{
            if(this.code==this.userLogin.code){
                let result = await phonelogin({
                    phone: this.userLogin.phone
                })
                if (!result.err) {
                    this.$message.success(result.msg)
                    this.setUserId(result.data._id)
                    await this.$router.go(-1)
                } else this.$message.error(result.msg)
            }
          }
        } else {
          this.$message.error('请修改错误项')
          return false
        }
      })
    },
    async sendCode() {
      let code = this.getCode(100000, 999999)
      this.code = code
      this.beginTime = this.getTime()
      axios.get('http://47.98.53.42:18002/send.do', {
            params: {
                uid: 27687,
                pw: md5("F2A1B2D9" + this.getTime()),
                mb: this.userLogin.phone,
                ms: "【科创中国知识产权服务中心】登录验证码：" + this.code +
                    "。您正在注册登录科创中国知识产权服务中心，有效期5分钟。若非本人操作，请勿泄露。",
                tm: this.getTime()
            }
        }).then(res => {
            
        })
        this.$message.success("验证码发送成功")
        let count = 0
        this.isDisabled = true
        let tag = setInterval(() => {
            if (++count >= 60) {
                clearInterval(tag)
                this.isDisabled = false
                return (this.btnText = '再次获取')
            }
            this.btnText = `${60 - count}秒后获取`
        }, 1000)
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.el-form {
  width: 28rem;
}
</style>
