<template>
  <div class="pass">
    <el-form label-width="80px" :rules="rules" status-icon :model="user" ref="userForm" v-if="!email">
      <el-form-item label="绑定邮箱">
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-col :span="14">
          <el-input v-model.number="user.code"></el-input>
        </el-col>
        <el-col :span="2" :offset="3">
          <el-button type="primary" @click="getCode" :disabled="isDisabled">{{ btnText }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
    <div v-else>该账户已经绑定邮箱:{{this.email}}</div>
  </div>
</template>
<script>
import { getEmail, sendEmail, bindEmail } from '../../../api/user'
import { mapState } from 'vuex'
export default {
  name: 'bindEmail',
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      user: {
        email: '',
        code: ''
      },
      email:'',
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
          let result = await bindEmail({
            _id: this.userId,
            email: this.user.email,
            code: this.user.code
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
    async getCode() {
      let result = await sendEmail(this.user.email)
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
    },
    async init() {
      let result = await getEmail(this.userId)
      this.email = result.data.email
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
