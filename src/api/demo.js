import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/search/user',
    method: 'post',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/transactionList',
    method: 'post',
    params: query
  })
}

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'post'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'post'
  })
}
export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'post'
  })
}

export function fetchList(query) {
  return request({
    url: '/articleList',
    method: 'post',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/articleDetail',
    method: 'post',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'post',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
