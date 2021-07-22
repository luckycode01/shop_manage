import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

// 配置路由守卫，未登录，或没有token强制跳转到登录页
/**
 * to 将要访问的路径
 * from 代表从那个路径跳转来
 * next 放行
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (!window.sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router
