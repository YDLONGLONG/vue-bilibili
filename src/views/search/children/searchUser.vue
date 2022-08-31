<template>
<div>
  <div class="userList" v-show="users.length">
    <el-row v-for="user in users" :key="user._id" type="flex" align="middle">
      <el-col :span="1">
        <router-link :to="`/user/${user._id}`">
          <el-avatar icon="el-icon-user-solid" :size="64" :src="user.headUrl | urlFormat"></el-avatar>
        </router-link>
      </el-col>
      <el-col :span="18" :offset="1">
        <router-link :to="`/user/${user._id}`">
          <b class="nick">{{ user.nick }}</b>
        </router-link>
        <p class="sign">{{ user.sign }}</p>
      </el-col>
    </el-row>
  </div>
</div>
</template>
<script>
import { searchUser } from '../../../api/user'
export default {
  name: 'searchUser',
  data() {
    return {
      keyWord: '',
      page: 1,
      sortBy: '',
      users:[]
    }
  },
  methods: {
    //分页变化时
    handleCurrent(page) {
      this.page = page
      this.init(page, this.sortBy)
    },
    async init() {
      let res = await searchUser(this.keyWord)
      this.users = res.data.users
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
.userList {
  width: 70rem;
  margin: 3rem 0 0;
  border: 1px solid #d7dae2;
  border-radius: 0.5rem;
  .el-row {
    padding: 2rem;
    border-bottom: 1px solid #eeeeee;
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
}
</style>
