<template>
  <div class="box">
    <el-container class="home-container">
      <!-- 左侧栏 -->
      <el-container>
        <el-aside :width="isCollapse ? '9rem' : '300px'">
          <!-- 折叠按钮 -->
          <el-button
            class="zedie"
            type="primary"
            :icon="isCollapse ? 'el-icon-caret-right' : 'el-icon-caret-left'"
            circle
            @click="zhedie()"
          ></el-button>
          <!-- 用户头像 -->
          <div v-if="avatar" class="tou">
            <img :src="avatar" alt="" />
          </div>
          <div v-else class="tou">
            <img src="../assets/user.png" alt="" />
          </div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            :unique-opened="true"
            :router="true"
            :default-active="$route.path"
            :collapse="isCollapse"
            :collapse-transition="false"
          >
            <!-- 一级菜单 登陆后 -->
            <el-submenu v-if="name" index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{ name }}</span>
              </template>
              <!-- 二级菜单 -->

              <el-menu-item index="/release">
                <template slot="title">
                  <i class="el-icon-edit-outline"></i>
                  <!-- 文本 -->
                  <span>发布帖子</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/myblog">
                <template slot="title">
                  <i class="el-icon-document-copy"></i>
                  <!-- 文本 -->
                  <span>我的帖子</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/myset">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <!-- 文本 -->
                  <span>设置</span>
                </template>
              </el-menu-item>
              <el-menu-item @click="logout">
                <template slot="title">
                  <i class="el-icon-monitor"></i>
                  <!-- 文本 -->
                  <span>退出</span>
                </template>
              </el-menu-item>
            </el-submenu>

            <!-- 一级菜单 登录前 -->
            <el-menu-item v-else index="/login">
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span slot="title">登录</span>
            </el-menu-item>
            <!-- 一级菜单 -->
            <el-menu-item index="/welcome">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- 一级菜单 -->
            <el-menu-item index="/photo">
              <i class="el-icon-camera-solid"></i>
              <span slot="title">相册</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-button
            class="btn"
            type="danger"
            :icon="drawer ? 'el-icon-caret-top' : 'el-icon-arrow-down'"
            circle
            @click="open()"
          ></el-button>
          <transition mode="out-in">
            <!-- 路由占位符 -->
            <router-view class="center"></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
    <!-- 抽屉栏 -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="30%"
      :with-header="false"
    >
      <div class="box-card">
        <el-row type="flex" justify="center">
          <!-- 用户头像 -->
          <div v-if="avatar" class="tou">
            <img :src="avatar" alt="" />
          </div>
          <div v-else class="tou">
            <img src="../assets/user.png" alt="" />
          </div>
        </el-row>
        <el-row type="flex" justify="center">
          <h4 v-if="jianjie" v-text="jianjie"></h4>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 侧边栏的折叠与展开
      isCollapse: false,
      name: localStorage.getItem("name"),
      avatar: localStorage.getItem("avatar"),
      // 侧边栏
      drawer: false,
      // 侧边栏的展开方向
      direction: "ttb",
      jianjie: localStorage.getItem("jianjie"),
      userimg: "../assets/user.png",
    };
  },
  methods: {
    async logout() {
      const { data: res } = await this.$http.post("logout");
      if (res.status !== 200) {
        return this.$message.error(res.message);
      }
      // 清空sessionStorage中保存的数据 其中包括了token
      localStorage.clear();
      // 重定向到登录页
      this.$router.push("/login");
      this.$message.success(res.message);
    },
    // 关闭侧边栏
    handleClose() {
      this.drawer = false;
    },
    // 打开侧边栏
    open() {
      this.drawer = !this.drawer;
    },
    // 折叠侧边栏
    zhedie() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
// align-items:     y轴上的对齐方式
// justify-content: x轴上的对齐方式
.home-container {
  height: 100%;
}
.blog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
}
.btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1.333333rem;
}
// 路由过渡效果
.v-enter {
  opacity: 0;
}
.v-enter-active {
  transition: 0.5s;
}
.v-enter-to {
  opacity: 1;
}
.v-leave {
  opacity: 1;
}
.v-leave-to {
  opacity: 0;
}
.v-leave-active {
  transition: 0.5s;
}
// 侧边栏的card
.box-card {
  width: 100%;
  height: 100%;
  background: url("../assets/gradient_spots.jpg");
}
// 左侧栏
.el-aside {
  position: relative;
  background-color: #333744;
  height: 100%;
  .el-menu {
    border-right: none;
  }
}
.box {
  height: 100%;
}
.zedie {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
}
// 用户头像
.tou {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  border: 0.266667rem solid #fff;
  overflow: hidden;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>