import request from '@/utils/request'

export function actionList(data) {
  return request({
    url: '/action/actionList',
    method: 'post',
    data
  })
}

export function actionChildList(data) {
  return request({
    url: '/action/actionChildList',
    method: 'post',
    data
  })
}

export function saveOrUpdateAction(data) {
  return request({
    url: '/action/saveOrUpdateAction',
    method: 'post',
    data
  })
}

export function deleteAction(data) {
  return request({
    url: '/action/deleteAction',
    method: 'post',
    data
  })
}
