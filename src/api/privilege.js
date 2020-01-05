import request from '@/utils/request'
import { param } from '@/utils'

export function findPrivilegeMenu(query) {
  const data = param(query)
  return request({
    url: '/privilege/findPrivilegeMenu',
    method: 'post',
    data
  })
}

export function findPrivilegeAction(query) {
  const data = param(query)
  return request({
    url: '/privilege/findPrivilegeAction',
    method: 'post',
    data
  })
}
