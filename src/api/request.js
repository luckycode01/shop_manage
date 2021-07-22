// 导入axios
import axios from 'axios'

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const service = axios.create({
  // 配置请求根路径
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 3000
})
// 请求拦截器
service.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  Nprogress.start()
  return config
})
// 响应拦截
service.interceptors.response.use(
  response => {
    Nprogress.done()
    return response.data
  },
  error => {
    Nprogress.done()
    alert('服务器异常')
    return new Promise(() => {})
  }
)

export default service
