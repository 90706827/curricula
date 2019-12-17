import request from '@/utils/request'

export function selectMenu() {
  return request({
    url: '/common/selectMenu',
    method: 'post'
  })
}
