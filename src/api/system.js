import request from '@/utils/request'

import { param } from '@/utils'

export function saveErrorLog(data) {
  return request({
    url: '/system/saveErrorLog',
    method: 'post',
    data
  })
}

export function userList(data) {
  return request({
    url: '/system/userList',
    method: 'post',
    data
  })
}

export function menuList(data) {
  return request({
    url: '/system/menuList',
    method: 'post',
    data
  })
}

export function menuChildList(data) {
  return request({
    url: '/system/menuChildList',
    method: 'post',
    data
  })
}

export function menuSave(data) {
  return request({
    url: '/admin/menu/save',
    method: 'post',
    data
  })
}

export function menuUpdate(data) {
  return request({
    url: '/admin/menu/update',
    method: 'post',
    data
  })
}

export function menuRemove(query) {
  const data = param(query)
  return request({
    url: '/admin/menu/delete',
    method: 'post',
    data
  })
}

export function roleList(data) {
  return request({
    url: '/system/roleList',
    method: 'post',
    data
  })
}

export function roleSave(data) {
  return request({
    url: '/admin/role/save',
    method: 'post',
    data
  })
}

export function roleUpdate(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data
  })
}

export function roleRemove(query) {
  const data = param(query)
  return request({
    url: '/admin/role/delete',
    method: 'post',
    data
  })
}

export function getMenuAllTree() {
  return request({
    url: '/admin/role/getMenuAllTree',
    method: 'post'
  })
}

export function getRoleMenuList(query) {
  const data = param(query)
  return request({
    url: '/admin/role/getRoleMenuList',
    method: 'post',
    data
  })
}

