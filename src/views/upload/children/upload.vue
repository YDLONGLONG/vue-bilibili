<template>
<div class="total">
  <div class="videoForm">
    <!-- 上传文件 -->
    <el-row class="video" type="flex" justify="space-between">
      <el-col :span="12">
        <!-- 视频 -->
        <el-upload
          drag
          :auto-upload="false"
          :limit="1"
          name="video"
          action=""
          ref="video"
          :on-change="videoUpload"
          :on-exceed="videoExceed"
          accept=".mp4,.flv"
          :on-remove="videoRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将视频文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传mp4/flv文件，且不超过1GB</div>
        </el-upload>
      </el-col>
      <el-col :span="12" class="titlePic">
        <!-- 封面 -->
        <el-upload
          :auto-upload="false"
          :limit="1"
          name="img"
          class="avatar-uploader"
          action=""
          :on-change="imgUpload"
          ref="img"
          :on-exceed="imgExceed"
          :on-remove="imgRemove"
          accept=".jpg,.jpeg,.png"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon">视频封面</i>
        </el-upload>
        <h4 class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过2MB</h4>
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
        <el-button type="primary" @click="submit('videoForm')">立即提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import { uploadVideo } from '../../../api/video'
export default {
  data() {
    return {
      // 视频分类
      types: ['生活', '科技', '游戏', '校园', '教育', '音乐', '电影'],
      imgUrl: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 30, message: '长度不超过30个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
      },
      videoForm: {
        title: '',
        type: '',
        desc: ''
      },
      img: '',
      video: ''
    }
  },
  methods: {
    imgRemove() {
      this.imgUrl = ''
      this.img = ''
    },
    videoRemove() {
      this.video = ''
    },
    //文件个数超出回调
    videoExceed() {
      this.$message.error('视频只能上传一个')
    },
    imgExceed() {
      this.$message.error('图片只能上传一个')
    },
    videoUpload(file) {
      let types = ['mp4', 'flv']
      let name = file.name
      let temp = name.lastIndexOf('.') + 1
      const index = types.indexOf(name.slice(temp))
      const isLt1G = file.raw.size / 1024 / 1024 < 1024
      if (index === -1) {
        this.$message.error('格式只能是mp4/flv格式!')
        this.$refs.video.uploadFiles.length = 0
        return false
      }
      if (!isLt1G) {
        this.$message.error('视频大小不能超过1GB!')
        this.$refs.video.uploadFiles.length = 0
        return false
      }
      this.video = file
      return true
    },
    imgUpload(file) {
      let types = ['jpg', 'png', 'jpeg']
      let name = file.name
      let temp = name.lastIndexOf('.') + 1
      const index = types.indexOf(name.slice(temp))
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (index === -1) {
        this.$message.error('格式只能是jpg/jpeg/png格式!')
        this.$refs.img.uploadFiles.length = 0
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        this.$refs.img.uploadFiles.length = 0
        return false
      }
      this.imgUrl = URL.createObjectURL(file.raw)
      this.img = file
      return true
    },
    submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.img && this.video) {
            let fd = new FormData()
            let form = this.videoForm
            for (let key in form) {
              fd.append(key, form[key])
            }
            fd.append('author', this.userId)
            fd.append('img', this.img.raw)
            fd.append('video', this.video.raw)
            let loading = this.$loading({
              text: '正在上传...',
              fullscreen: true,
              lock: true,
              background: 'rgba(255,255,255,.7)'
            })
            let clear = () => {
              loading.close()
              this.$refs.video.uploadFiles.length = 0
              this.$refs.img.uploadFiles.length = 0
              //重置data中的数据
              Object.assign(this.$data, this.$options.data())
            }
            let result
            try {
              result = await uploadVideo(fd)
            } catch (e) {
              this.$message.success('网络出错')
              return clear()
            }
            clear()
            this.$message.success(result.msg)
          } else {
            this.$message.error('请完善图片和视频')
          }
        } else {
          this.$message.error('请修改错误项')
          return false
        }
      })
    },
    init() {
      if (!this.userId) {
        this.$message.warning('请先登录')
        this.$router.push('/login/loginForm')
      }
    }
  },
  computed: {
    ...mapState(['userId'])
  },
  created() {
    this.init()
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
/* 封面*/
.titlePic {
  width: 322px;
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    color: #606266;
    &:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      line-height: 18rem;
    }
    .avatar {
      width: 32rem;
      height: 18rem;
      display: block;
    }
  }
}
.el-progress {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.total{
  width: 80%;
  margin: 3rem auto 0;
  padding: 3rem;
  border: 3px solid #d7dae2;
  border-radius: 3rem;
}
</style>
