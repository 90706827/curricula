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

export function getRoleAllList() {
  return request({
    url: '/user/getRoleAllList',
    method: 'post'
  })
}

export function getUserRoleList(query) {
  const data = param(query)
  return request({
    url: '/admin/user/getUserRoleList',
    method: 'post',
    data
  })
}
