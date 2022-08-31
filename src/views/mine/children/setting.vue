<template>
<div class="total">
  <div class="userInfo">
    <el-form label-width="80px" status-icon :model="user" :rules="rules" ref="userInfo">
      <el-form-item label="头像">
        <el-upload
          name="img"
          :action="'/upload/avatar' | urlFormat"
          :show-file-list="false"
          :on-success="success"
          :before-upload="beforeUpload"
          accept=".jpg,.jpeg,.png"
        >
          <el-avatar icon="el-icon-user-solid" :size="64" :src="headUrl" title="点击头像可上传"></el-avatar>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="nick">
        <el-input v-model="user.nick"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="user.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="user.age"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item label="生日">
         <el-date-picker type="date" placeholder="选择日期" v-model="user.birth" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="user.address"></el-input>
      </el-form-item>
      <el-form-item label="个人简介">
        <textarea v-model="user.introduction" class="textarea"></textarea>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <BindEmail />
    <BindPhone />
    <SetPassword />
  </div> 
</div>
</template>
<script>
import { getUserById, updateUser, getUserInfo, updateUserInfo } from '../../../api/user'
import { mapState } from 'vuex'
import SetPassword from './setPassword'
import BindEmail from './bindEmail'
import BindPhone from './bindPhone'
export default {
  name: 'setting',
  components:{
    SetPassword,BindEmail,BindPhone
  },
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      user: {
        nick: '',
        headUrl: '',
        sex: '',
        value: new Date(),
        age:'',
        phone:'',
        birth:'',
        address:'',
        introduction:'',
      },
      headUrl: '',
      rules: {
        nick: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 14, message: '长度在 2 到 14 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.userInfo.validate(async valid => {
        if (valid) {
          this.user._id = this.userId
          this.user.userid = this.userId
          await updateUser(this.user)
          await updateUserInfo(this.user)
          this.$message.success('已保存')
          location.reload()
        } else {
          this.$message.error('修改错误项')
        }
      })
    },
    //上传前判断文件是否合法
    beforeUpload(file) {
      const isType = file.type === ('image/jpeg' || 'image/png')
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isType) {
        this.$message.error('格式只能是jpg/jpeg/png格式!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }
      return true
    },
    success(res) {
      this.headUrl = 'http://localhost:3000' + res.data
      this.user.headUrl = res.data
    },
    async getInfo(){
      if (this.userId) {
        let result = await getUserInfo(this.userId);
        this.user.age = result.data[0].age;
        this.user.phone = result.data[0].phone;
        this.user.birth = result.data[0].birth;
        this.user.address = result.data[0].address;
        this.user.introduction = result.data[0].introduction;
      }
    },
    async init() {
      let result = await getUserById(this.userId)
      let user = result.data
      this.headUrl = 'http://localhost:3000' + user.headUrl
      this.user.nick = user.nick
      this.user.sex = user.sex
    }
  },
  created() {
    this.init();
    this.getInfo();
  }
}
</script>
<style lang="scss" scoped>
.userInfo {
  width: 70rem;
  margin: 3rem 0 0;
  padding: 4rem 15rem 4rem 2rem;
  border: 1px solid #d7dae2;
  border-radius: 8px;
  height: 100%;
}
.total{
  display: flex;
}
.right{
  width: 70rem;
  margin: 3rem 0 0;
  padding: 4rem 15rem 4rem 2rem;
  border: 1px solid #d7dae2;
  border-radius: 8px;
  flex: 1;
}
.textarea{
  height: 200px;
  width: 450px;
  color: grey;
  font-size: 16px;
  border-color: rgb(215,218,226);
  resize:none;
}
</style>
