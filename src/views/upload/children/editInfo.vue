<template>
<div class="total">
  <div class="videoForm">
    <!-- 上传文件 -->
    <el-row class="video" type="flex" justify="space-between">
      <el-col>
        <!-- 视频 -->
        <router-link :to="`/detail/${videoForm._id}`"><img :src="videoForm.imgUrl | urlFormat" width="325px" height="185px" style="border-radius: 6px;"/></router-link>
      </el-col>
    </el-row>
    <el-form :model="videoForm" label-width="80px" :rules="rules" label-position="top" ref="videoForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="videoForm.title"></el-input>
      </el-form-item>
      <el-form-item label="视频类型" prop="type">
        <el-select v-model="videoForm.type" placeholder="请选择视频类型">
          <el-option v-for="(type, index) in types" :label="type" :value="index" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" v-model="videoForm.desc" rows="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(videoForm)">立即提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import { getVideoById, updateVideoInfo } from '../../../api/video'
export default {
  data() {
    return {
      // 视频分类
      types: ['生活', '科技', '游戏', '校园', '教育', '音乐', '电影'],
      rules: {
        title: [
          { message: '请输入标题', trigger: 'blur' },
          { max: 30, message: '长度不超过30个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
      },
      videoForm: {
        title: '',
        type: '',
        desc: ''
      },
    }
  },
  methods: {
    async submit(formName) {
      let result =  await updateVideoInfo({_id:formName._id,title:formName.title,type:formName.type,desc:formName.desc})
      this.$message.success(result.msg)
    },
    async init(id) {
      let res = await getVideoById(id)
      this.videoForm = res.data.video
    }
  },
  computed: {
    ...mapState(['userId'])
  },
  created() {
    let { id } = this.$route.params
    if (id) this.init(id)
  }
}
</script>
<style lang="scss" scoped>
/*表单*/
.videoForm {
  width: 80rem;
  margin: 2rem auto;
  .video {
    text-align: center;
  }
}
.total{
  width: 80%;
  margin: 3rem auto 0;
  padding: 3rem;
  border: 3px solid #d7dae2;
  border-radius: 3rem;
}
</style>
