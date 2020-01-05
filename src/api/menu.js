import request from '@/utils/request'

export function menuList(data) {
  return request({
    url: '/menu/menuList',
    method: 'post',
    data
  })
}

export function saveOrUpdateMenu(data) {
  return request({
    url: '/menu/saveOrUpdateMenu',
    method: 'post',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: '/menu/deleteMenu',
    method: 'post',
    data
  })
}
