<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <!-- logo图标 -->
        <img src="../assets/imgs/logo.jpg" alt="" srcset="" />
        <span>电商管理系統</span>
      </div>
      <!-- 退出按钮 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">{{isCollapse?'&gt;&gt;&gt;':'&lt;&lt;&lt;'}}</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router :default-active='activePath'>
          <!-- 一级菜单 -->
          <el-submenu :index="String(item.id)" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+String(subItem.path)" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+String(subItem.path))">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span> {{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 不折叠菜单
      isCollapse: false,
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      // 被激活的状态路径
      activePath: '',
    }
  },

  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;

    },
    // 点击按钮切换左边的按钮隐藏与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 将点击链接的状态保存到sessionstorage
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  },
  // 获取左侧菜单数据


}
</script>
<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #333744;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #ffffff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.el-header div img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: none;
}
.el-main {
  background-color: #e9edf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  color: #ffffff;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>

