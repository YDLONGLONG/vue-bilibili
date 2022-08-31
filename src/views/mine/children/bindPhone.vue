<template>
  <div class="pass">
    <el-form label-width="80px" :rules="rules" status-icon :model="user" ref="userForm" v-if="!phone">
      <el-form-item label="绑定手机">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-col :span="14">
          <el-input v-model.number="user.code"></el-input>
        </el-col>
        <el-col :span="2" :offset="3">
          <el-button type="primary" @click="sendCode" :disabled="isDisabled">{{ btnText }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
    <div v-else>该账户已经绑定手机号:{{this.phone}}</div>
  </div>
</template>
<script>
import { getPhone, bindPhone } from '../../../api/user'
import { mapState } from 'vuex'
import axios from 'axios'
import md5 from 'js-md5'
export default {
  name: 'bindPhone',
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      user: {
        phone: '',
        code: ''
      },
      code:'',
      beginTime:'',
      phone:'',
      rules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { type: 'number', message: '请输入正确的6位验证码', trigger: 'blur' }
        ]
      },
      btnText: '点击获取',
      isDisabled: false
    }
  },
  methods: {
    async submit() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          let result = await bindPhone({
            _id: this.userId,
            phone: this.user.phone
          })
          if (!result.err) {
            this.$message.success(result.msg)
            location.reload()
          } else this.$message.error(result.msg)
        } else {
          this.$message.error('请修改错误项')
          return false
        }
      })
    },
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
    async sendCode() {
      let code = this.getCode(100000, 999999)
      this.code = code
      this.beginTime = this.getTime()
      axios.get('http://47.98.53.42:18002/send.do', {
            params: {
                uid: 27687,
                pw: md5("F2A1B2D9" + this.getTime()),
                mb: this.user.phone,
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
    },
    async init() {
      let result = await getPhone(this.userId)
      this.phone = result.data.phone
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.pass {
  width: 70rem;
  margin: 3rem 0 0;
  padding: 4rem 15rem 4rem 2rem;
  border: 1px solid #d7dae2;
  border-radius: 8px;
}
</style>
