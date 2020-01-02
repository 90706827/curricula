import request from '@/utils/request'

export function selectMenu() {
  return request({
    url: '/common/selectMenu',
    method: 'post'
  })
}

export function selectRole() {
  return request({
    url: '/common/selectRole',
    method: 'post'
  })
}
