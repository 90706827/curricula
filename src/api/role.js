import request from '@/utils/request'
import { param } from '@/utils'

export function findRolePrivilege(query) {
  const data = param(query)
  return request({
    url: '/role/findRolePrivilege',
    method: 'post',
    data
  })
}

export function roleList(data) {
  return request({
    url: '/role/roleList',
    method: 'post',
    data
  })
}

export function saveOrUpdateRole(data) {
  return request({
    url: '/role/saveOrUpdateRole',
    method: 'post',
    data
  })
}
