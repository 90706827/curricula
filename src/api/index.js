import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'post'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/exit',
    method: 'post'
  })
}

export function verCode() {
  return request({
    url: '/getVerCode',
    method: 'post'
  })
}

export function sendTelCode(data) {
  return request({
    url: '/sendTelCode',
    method: 'post',
    data
  })
}

export function forget(data) {
  return request({
    url: '/forget',
    method: 'post',
    data
  })
}
