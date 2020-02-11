<template>
  <el-container class="homeContainer">
    <el-header>
      <div>
        <img src="../assets/images/home-header.png" alt />
        <span>xx电商管理后台</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse" @click="collapse">
          <i class="iconfont icon-menu"></i>
        </div>
        <el-menu background-color="#1E1E2D" text-color="#fff" active-text-color="#ffd04b"
        unique-opened :collapse="isCollapse" :collapse-transition="false"
        router :default-active="activePath">
        <!-- 启用vue-router模式会在激活导航时以 index 作为 path 进行路由跳转 -->
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children"
            :key="subItem.id" @click="saveActivePath('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user1',
        '103': 'iconfont icon-permission',
        '101': 'iconfont icon-shangpinguanli',
        '102': 'iconfont icon-dingdan',
        '145': 'iconfont icon-shuju'
      },
      // 侧边栏是否可折叠展开
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 获取左侧菜单 get返回的是promise，用await修饰一下
    async getMenuList(){
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.console.error('res.meta.msg')
      this.menulist = res.data
    },
    // 点击按钮切换折叠与展开
    collapse(){
      this.isCollapse = !this.isCollapse
    },
    saveActivePath(activePath){
      // 保存激活路径到sessionStorage中
      window.sessionStorage.setItem('activePath', activePath)
      // 重新赋值
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.homeContainer {
  height: 100%;
}
.el-header {
  background-color: #101018;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    > span {
      color: #fff;
      font-size: 20px;
      margin-left: 10px;
    }
    > img {
      width: 64px;
      height: 64px;
    }
  }
}
.el-aside {
  background-color: #1e1e2d;
  .el-menu{
    border: none;
  }
  .collapse{
    background-color: #F0D43A;
    color: #f2f3f8;
    text-align: center;
    cursor: pointer;
    line-height: 24px;
  }
}
.el-main {
  background-color: #f2f3f8;
}
.iconfont{
  margin-right: 10px;
}
</style>
