<template>
  <div id="app">
    <!-- 在app.vue加载粒子效果 -->
    <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <!-- 路由占位符 -->
    <transition mode="out-in">
      <router-view v-if="isRouterAlive" class="center"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  created() {
    setTimeout(() => {
      window.L2Dwidget.init({
        pluginRootPath: "static/live2dw/",
        pluginJsPath: "lib/",

        pluginModelPath: "live2d-widget-model-haru_2/assets/",
        tagMode: false,
        debug: false,
        model: {
          jsonPath:
            "static/live2dw/live2d-widget-model-wanko/assets/wanko.model.json",
        },
        display: { position: "right", width: 350, height: 450 },
        mobile: { show: true },
        log: false,
      });
    }, 1000);
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
  },
};
</script>

<style>
/* 粒子效果样式在 #particles-js 这个id设置 这是粒子效果js文件的默认样式 一定要加上绝对定位 position: absolute;  */
#particles-js {
  width: 100%;
  height: 100%;
  position: absolute;
}
.el-table__body tr.current-row > td {
  background-color: #bbbbbb;
}
/* 路由过渡效果 */
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
</style>
