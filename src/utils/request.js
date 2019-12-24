import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.token = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const resp = response.data
    console.log('resp', resp)
    // code 为自定义，200不报错！
    if (resp.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 401: Token expired;
      if (resp.code === 401) {
        Message({
          message: '登录失效，请重新登录！',
          type: 'warning',
          duration: 5 * 1000
        })
        setTimeout(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }, 2000)
      } else if (resp.code >= 700 && resp.code <= 750) {
        // 有页面自行处理错误
        console.log('放行返回码：', resp.code, resp.message)
      } else {
        Message({
          message: resp.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return resp
    } else {
      return resp
    }
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.message === 'Network Error') {
      Message({
        message: '网络或服务异常!',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
