import request from '@/utils/request'

import { param } from '@/utils'

export function userList(data) {
  return request({
    url: '/user/userList',
    method: 'post',
    data
  })
}

export function saveOrUpdateUser(data) {
  return request({
    url: '/user/saveOrUpdateUser',
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
