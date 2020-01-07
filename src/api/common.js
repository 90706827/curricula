import request from '@/utils/request'

export function selectMenu() {
  return request({
    url: '/common/selectMenu',
    method: 'post'
  })
}

export function selectAction() {
  return request({
    url: '/common/selectAction',
    method: 'post'
  })
}
