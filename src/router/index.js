import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/Login'
import Home from '@/views/public/home'
import Welcome from '@/views/public/welcome'
import Employee from '@/views/employee/employee'
import Expend from '@/views/finance/expend'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/employee',
          component: Employee
        },
        {
          path: '/expend',
          component: Expend
        }
      ]
    }
  ]
})
