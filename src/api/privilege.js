import request from '@/utils/request'
import { param } from '@/utils'

export function findPrivilegeMenuAndAction(query) {
  const data = param(query)
  return request({
    url: '/privilege/findPrivilegeMenuAndAction',
    method: 'post',
    data
  })
}

export function privilegeList(data) {
  return request({
    url: '/privilege/privilegeList',
    method: 'post',
    data
  })
}

export function saveOrUpdatePrivilege(data) {
  return request({
    url: '/privilege/saveOrUpdatePrivilege',
    method: 'post',
    data
  })
}

export function deletePrivilege(data) {
  return request({
    url: '/privilege/deletePrivilege',
    method: 'post',
    data
  })
}
