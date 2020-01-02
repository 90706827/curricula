import request from '@/utils/request'

import { param } from '@/utils'

export function userSave(data) {
  return request({
    url: '/admin/user/save',
    method: 'post',
    data
  })
}

export function userUpdate(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data
  })
}

export function userRemove(query) {
  const data = param(query)
  return request({
    url: '/admin/user/delete',
    method: 'post',
    data
  })
}

export function findUserRole(query) {
  const data = param(query)
  return request({
    url: '/user/findUserRole',
    method: 'post',
    data
  })
}
