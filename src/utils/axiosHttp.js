import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
// import qs from 'qs'
import router from '../router'
// import router from '@/router'

// 创建axiox实例
const http = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request拦截器
http.interceptors.request.use(config => {
  if (!config.params) {
    config.params = {}
  }
  const token = localStorage.getItem('Bearer_token')
  if (token) {
    // config.headers['Authorization'] = token
    config.headers.authorization = token
  }
  if (config.method === 'post') {
    // config.data = qs.stringify(config.data)
    // config.headers['Content-Type'] = 'applicant/x-www-form-urlencoded'
  }
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  const res = response.data
  if (res.code !== '00') {
    Message({
      message: res.message || 'Error',
      type: 'error',
      duration: 1000
    })

    if (res && response.data.code === '401') {
      // router.push({name: 'login'})
      console.log('401 error')
      MessageBox.confirm('You have been logged out, please login in again', 'confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        router.push('/')
      })
    }
    // return Promise.reject(res)
    return res
  } else {
    return res
  }
}, error => {
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default http
