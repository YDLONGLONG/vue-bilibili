<template>
  <div>
    <el-form :model="userLogin" :rules="rules" status-icon ref="userLogin">
      <el-form-item prop="email">
        <el-input v-model="userLogin.email" placeholder="输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-col :span="14">
          <el-input v-model.number="userLogin.code" placeholder="输入验证码"></el-input>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary" @click="getCode">{{ btnText }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:28rem" @click="codelogin">提交</el-button>
      </el-form-item>
      <router-link replace to="/login/loginForm" style="color: #00A1D6;display: inline-block;margin-right:50px">
        返回密码登录
      </router-link>
      <router-link replace to="/login/phonelogin" style="color: #00A1D6;display: inline-block;margin-left:50px">
        手机验证登录
      </router-link>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { codelogin,sendEmail } from '../../../api/user'
export default {
  data() {
    return {
      userLogin: {
        email: '',
        code:''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
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
    ...mapActions(['setUserId']),
    async codelogin() {
      this.$refs.userLogin.validate(async valid => {
        if (valid) {
          let result = await codelogin({
            code: this.userLogin.code,
            email: this.userLogin.email,
          })
          if (!result.err) {
            this.$message.success(result.msg)
            this.setUserId(result.data._id)
            await this.$router.go(-1)
          } else this.$message.error(result.msg)
        } else {
          this.$message.error('请修改错误项')
          return false
        }
      })
    },
    async getCode() {
      let result = await sendEmail(this.userLogin.email)
      if (!result.err) {
        this.$message.success(result.msg)
      } else this.$message.error(result.msg)
      let count = 0
      this.isDisabled = true
      let tag = setInterval(() => {
        if (++count >= 60) {
          clearInterval(tag)
          this.isDisabled = false
          return (this.btnText = '点击获取')
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
