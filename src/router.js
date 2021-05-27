import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from './components/Login.vue'
// 导入主页组件
import Home from './components/Home.vue'
// 导入首页组件
import Welcome from './components/Welcome.vue'
// 导入发布帖子组件
import Release from './components/my/Release.vue'
// 导入博客详情组件
import Blog from './components/my/Blog.vue'
// 导入我的博客组件
import MyBlog from './components/my/MyBlog'
// 导入我的设置组件
import Myset from './components/my/Myset'
// 导入相册组件
import Photo from './components/my/Photo'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 重定向
    redirect: '/welcome',
    // 子路由
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/release',
        component: Release
      },
      {
        path: '/blog/:id',
        component: Blog
      }, {
        path: '/myblog',
        component: MyBlog
      }, {
        path: '/myset',
        component: Myset
      }, {
        path: '/photo',
        component: Photo
      }
    ]
  }
]
// 创建路由实例对象
const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 判断用户是不是访问登录页 登录页不需要做权限控制 直接放行
  if (to.path === '/login') return next();
  if (to.path === '/home') return next();
  // // 获取token
  // const tokenStr = window.sessionStorage.getItem("name");
  // // token为空 跳转到登录页
  // if (!tokenStr) return next('/login');
  // // 存在token 直接放行

  next();
});
// 导出路由实例对象
export default router
