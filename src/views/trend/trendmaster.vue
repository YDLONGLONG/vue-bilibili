<template>
  <div>
      <div class="total">
          <div class="left">
              <div>
                  <el-row><img src="../../assets/img/headerbj.png" style="width:100%;"></el-row>
                  <el-row type="flex" align="middle">
                      <el-col :offset="2">
                          <router-link :to="`/mine/trend`">
                          <el-avatar icon="el-icon-user-solid" :size="64" :src="user.headUrl | urlFormat" :key="user._id"></el-avatar>
                          </router-link>
                      </el-col>
                      <el-col>{{user.nick}}</el-col>
                  </el-row>
                  <el-row type="flex" align="middle">
                      <el-col :offset="4"><router-link :to="`/mine/attention`"><div style="position:relative;left:13%">{{attentions.length}}</div>关注</router-link></el-col>
                      <el-col><div style="position:relative;left:13%">{{user.fansCount}}</div >粉丝</el-col>
                      <el-col><router-link :to="`/mine/trend`"><div style="position:relative;left:13%">+</div>动态</router-link></el-col>
                  </el-row>
              </div>
          </div>
          <div class="middle">
              <div class="fbdt">
                  <quill-editor ref="myQuillEditor" class="myQuillEditor" :options="editorOption" @change="onEditorChange($event)"/>
                  <!-- <el-input class="srk" v-model="content" placeholder="有什么和大家分享的"></el-input> -->
                  <el-button type="primary" style="position:relative;left:90%;top:10px;" @click="send">发布</el-button>
              </div>
              <div class="dtlb">
                  <!-- 关注动态 -->
                  <div class="trendList" v-show="attrendList.length" v-for="trend in attrendList" :key="trend._id">
                    <el-row type="flex" align="middle">
                    <el-col :span="1">
                      <router-link :to="`/user/trend/${trend.author._id}`">
                        <el-avatar icon="el-icon-user-solid" :size="64" :src="trend.author.headUrl | urlFormat"></el-avatar>
                      </router-link>
                    </el-col>
                    <el-col :span="18" :offset="1">
                        <b class="nick">{{ trend.author.nick }}</b>
                        <p class="sign">{{ trend.date | dateFormat }}</p>
                    </el-col>
                    <el-col :span="3" :offset="1">
                        <el-dropdown>
                          <span class="el-dropdown-link">
                            <i class="el-icon-more"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><span @click="dialogFormVisible = true">举报</span></el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <!-- 举报内容 -->
                        <el-dialog title="我要举报" :model="form" :visible.sync="dialogFormVisible" width="500px">
                          <el-form>
                            <el-form-item label="请选择举报的理由：">
                              <el-radio-group v-model="form.radio">
                                <el-radio label="垃圾广告"></el-radio>
                                <el-radio label="引战"></el-radio>
                                <el-radio label="色情"></el-radio>
                                <el-radio label="人身攻击"></el-radio>
                                <el-radio label="违法信息"></el-radio>
                                <el-radio label="其他"></el-radio>
                              </el-radio-group>
                            </el-form-item>
                            <el-form-item label="为帮助审核人员更快处理，请补充问题类型和出现位置等详细信息。">
                              <el-input type="textarea" placeholder="举报内容" v-model="form.textarea" maxlength="60" resize="none" rows="4" show-word-limit></el-input>
                            </el-form-item>
                          </el-form>
                          <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitBan(trend._id)">确 定</el-button>
                          </div>
                        </el-dialog>
                    </el-col>
                    </el-row>
                    <el-row>
                    <router-link :to="`/trendinfo/${trend._id}`">
                        <p class="tc" v-html="trend.content"></p>
                    </router-link>
                    </el-row>
                    <el-row>
                      <router-link :to="`/trendinfo/${trend._id}`">
                        <p>点击查看更多</p>
                      </router-link> 
                    </el-row>
                    <el-row type="flex" class="sl">
                        <el-col :span="2"><i class="el-icon-thumb"></i>赞 {{ trend.zanList.length }}</el-col>
                        <el-col :span="2"><i class="el-icon-chat-round"></i>评论 {{ trend.zanList.length }}</el-col>
                        <el-col :span="2" :offset="1"><i class="el-icon-position"></i><span @click="zhuanfa(trend._id,trend.author.nick,trend.content)">转发</span></el-col>
                    </el-row>
                    </div>
                    
                  <!-- <div class="trendList" v-show="trendList.length" v-for="trend in trendList" :key="trend._id">
                    <el-row type="flex" align="middle">
                    <el-col :span="1">
                        <el-avatar icon="el-icon-user-solid" :size="64" :src="user.headUrl | urlFormat"></el-avatar>
                    </el-col>
                    <el-col :span="18" :offset="1">
                        <b class="nick">{{ user.nick }}</b>
                        <p class="sign">{{ trend.date | dateFormat }}</p>
                    </el-col>
                    <el-col :span="3" :offset="1">
                        <i class="el-icon-more"></i>
                    </el-col>
                    </el-row>
                    <el-row>
                    <router-link target="_blank" :to="`/trendinfo/${trend._id}`">
                        <p class="tc">{{trend.content}}</p>
                    </router-link> 
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="2"><i class="el-icon-thumb"></i>赞 {{ trend.zanList.length }}</el-col>
                        <el-col :span="2"><i class="el-icon-chat-round"></i>评论 {{ trend.zanList.length }}</el-col>
                    </el-row>
                    </div> -->
                </div>
          </div>
          <div class="right">
              <div>
                  公告栏
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserById, getAttentionUser } from '../../api/user'
import { getTrendPage, sendTrend } from '../../api/trend'
import { addBan } from '../../api/ban'
import {quillEditor, Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
// import { ImageResize } from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
Quill.register('modules/ImageExtend', ImageExtend);
// Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import mixin from '@/utils/mixin'
export default {
  data() {
    return {
      user: {},
      attentions: [],
      trendList:[],
      attrendList:[],
      trendListLength:0,
      content:'',
      editorOption: {  
          modules: {
            // ImageResize: {
            //   modules: [ 'Resize', 'DisplaySize', 'Toolbar' ],
            // },
            imageDrop: true,
            ImageExtend: {
              loading: true,
              name: 'img',
              size:2,
              action: this.$apiServer+'/upload/avatar',
              response: (res) => {
                return this.$apiServer+res.data
              }
            },
            toolbar: {
              container: container,
              handlers: {
                'image': function () {
                  QuillWatch.emit(this.quill.id)
                }
              }
            }
          }
        },
      dialogFormVisible: false,
      form: {
        radio: '',
        textarea: '',
      }
    }
  },
  mixins: [mixin],
  components: {
    quillEditor,
  },
  computed: {
    ...mapState(['userId'])
  },
  updated(){
    let DomList=document.getElementsByClassName('tc')
    for(let i of DomList){
      let DomListImg = i.querySelectorAll('img')
      for(let i in DomListImg){
        if( DomListImg[i].style){
          DomListImg[i].style.width='100px';
          DomListImg[i].style.height='100px';
          DomListImg[i].style.float='left';
        }
      }
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.content = html
    },
    async submitBan(id){
      await addBan({ trendid:id ,radio:this.form.radio, textarea: this.form.textarea, submitid:this.userId })
      this.$message.success("举报成功")
      this.dialogFormVisible = false
    },
    async zhuanfa(id,nick,content){
      if(confirm("确认转发吗")){
      content = "转发自@"+nick+content
      await sendTrend({ author:this.userId , content: content })
      this.$message.success("转发成功")
      this.$router.push('/mine/trend')
      }
    },
    async send(){
      if (!this.content.trim()) {
      this.content = ''
      return this.$message.warning('请输入内容')
      }
      let result = await sendTrend({ author:this.userId , content: this.content })
      this.$message.success(result.msg)
      this.$router.push('/mine/trend')
    },
    async init() {
      if (!this.userId) {
        this.$message.warning('请先登录')
        return await this.$router.push('/login')
      }
      let result1 = await getUserById(this.userId)
      this.user = result1.data

      let result2 = await getAttentionUser(this.userId)
      this.attentions = result2.data

      let result3 = await getTrendPage(this.userId)
      this.trendList = result3.data.trend

      this.attentions.forEach(async (item) =>{
        let result4 = await getTrendPage(item._id)
        this.attrendList.push(...result4.data.trend)
      })
    }
  },
  created() {
    this.init()
  },
  mounted(){
    this.$bus.$on('globalEvent',async (val)=>{
        this.attentions.forEach(async (item) =>{
          let result5 = await getTrendPage(item._id,val)
          this.attrendList.push(...result5.data.trend)
        })
      })
  }
}
</script>

<style lang="scss" scoped>
.total{
    margin-top: 1rem;
    display: flex;
    .left{
        margin-right: 1rem;
        flex: 1;
        border: 1px solid rgb(215,218,226);
        border-radius: 1rem;
        height: 100%;
        .el-avatar{
        position: relative;
        top: -20px;
        }
    }
    .middle{
        height: 100%;
        flex: 3;
        //border: 1px solid grey;
        .srk{
            margin: 1rem;
            font-size: 16px;
        }
        .dtlb{
            margin-left: 7rem;
        }
        .fbdt{
            margin: 1rem 0 0 7rem;
            width: 700px;
            border: 1px solid rgb(215,218,226);
            border-radius: 1rem;
            padding: 2rem;
            .el-input{
              margin-right: 5rem;
            }
        }
    }
    .right{
        margin-left: 1rem;
        height: 100%;
        flex: 1;
        border: 1px solid rgb(215,218,226);
        border-radius: 1rem;
    }
}
.trendList {
  width: 70rem;
  margin: 3rem 0 0;
  border-radius: 0.5rem;
  border: 1px solid #d7dae2;
  .sl{
    cursor:pointer
  }
  .tc{
    max-height:12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
  .el-row {
    padding: 2rem;
    margin-bottom: 1rem;
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
    .color-true {
    color: #00a1d6;
    }
    .color-false {
      color: #333;
    }
  }
}
</style>