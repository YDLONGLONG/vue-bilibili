<template>
<div class="total">
  <div class="left">
  <el-row class="tac">
    <el-col :span="3">
      <el-menu
        class="el-menu-vertical-demo">
        <router-link :to="`/creation/upload`">
        <el-menu-item align="center">
          <i class="el-icon-upload2"></i>
          <span slot="title">上传</span>
        </el-menu-item>
        </router-link>
        <el-submenu index="">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item-group>
            <router-link :to="`/creation/video`"><el-menu-item>稿件管理</el-menu-item></router-link>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
  </div>
  <div>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.total{
  margin-top: 3rem;
  .left{
    width: 100%;
    position: absolute;
    left: 0;
    .tac{
      .router-link-active {
        .el-menu-item{
          color: #00a1d6;
        }
      }
    }
  }
}
</style>