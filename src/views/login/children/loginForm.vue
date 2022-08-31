<template>
  <div>
    <el-form :model="userLogin" status-icon :rules="rules" ref="userLogin">
      <el-form-item prop="account">
        <el-input v-model="userLogin.account" placeholder="输入邮箱/手机号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="userLogin.password" autocomplete="off" placeholder="输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width:30%;margin:0 3px;" type="primary" @click="login">登录</el-button>
        <el-popover
        placement="right"
        trigger="click">
        <Table @isCan="isCan" />
        <el-button slot="reference" type="warning" style="width:35%">登录验证</el-button>
      </el-popover>
        <!-- 注册 -->
        <router-link to="/login/signIn" replace>
          <el-button style="width:30%;margin:0 3px;">注册</el-button>
        </router-link>
      </el-form-item>
      <router-link to="/login/reSet" style="color: #00A1D6;float:left" replace>忘记密码？</router-link>
      <router-link replace to="/login/codelogin" style="color: #00A1D6;float: right">验证码登录</router-link>
    </el-form>
  </div>
</template>
<script>
import Table from '../../../components/SlideVerify.vue'
import { mapActions } from 'vuex'
import { isLogin, login } from '../../../api/user'
export default {
  data() {
    return {
      userLogin: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在 6 到 14 个字符', trigger: 'blur' }
        ]
      },
      isCanValue:false
    }
  },
  components:{
    Table
  },
  methods: {
    ...mapActions(['setUserId']),
    login() {
      if(this.isCanValue){
        this.$refs.userLogin.validate(async valid => {
        if (valid) {
          let result = await login(this.userLogin)
          if (result.err === 0) {
            this.$message.success(result.msg)
            this.setUserId(result.data._id)
            await this.$router.go(-1)
          } else {
            this.$message.error(result.msg)
          }
        } else {
          this.$message.error('请修改错误项')
          return false
        }
      })
      }else{
        this.$message.warning("请先验证")
      }
    },
    isCan(val){
      this.isCanValue = val.is;
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
