<template>
  <el-container class="home-containter">
  <el-header>
    <div style="text-align: center">
      <img src="@/assets/logo.png" alt="" width="40px" height="40px">
      <span style="text-align:center">后台管理</span>
    </div>
    <el-button @click="logout">退出</el-button>
  </el-header>
  <el-container class="contentContainer">
    <el-aside width="200px">
      <el-menu text-color="#303133" active-text-color="#409EFF" unique-opened router
      :default-active="activePath">
      <el-menu-item index="1">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/employee" @click="saveNavState('/employee')">
        <i class="el-icon-user"></i>
        <span slot="title">用户中心</span>
      </el-menu-item>
      <el-menu-item index="/expend" @click="saveNavState('/expend')">
        <i class="el-icon-document"></i>
        <span slot="title">支出管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">系统配置</span>
        </template>
        <el-menu-item index="/data/dictionary/index" @click="saveNavState('/data/dictionary/index')">
        <!-- <el-menu-item index="/data/dictionary/index"> -->
          <template slot="title">
          <i class="el-icon-menu"></i>
          <span>字典管理</span>
          </template>
        </el-menu-item>
      </el-submenu>
      </el-menu>
    </el-aside>
    <el-main style="height:100%">
      <router-view />
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      activePath: ''
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      localStorage.removeItem('Bearer_token')
      this.$router.push('/login')
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
  .home-containter{
    height: 100%;
  }
 .el-header {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #333;
    font-size: 20px;
  }
  .contentContainer{
    height: 100%;
  }

  .el-aside {
    height: 100%;
  }
  .el-main {
    background-color: #ffffff;
  }
  .el-menu {
    height: 100%;
    border-right: 10px;
  }
  </style>
