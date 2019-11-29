import request from '@/utils/request'

import { param } from '@/utils'

export function userList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

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

export function roleList(data) {
  return request({
    url: '/admin/role/list',
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

export function menuList(query) {
  const data = param(query)
  return request({
    url: '/admin/menu/list',
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
