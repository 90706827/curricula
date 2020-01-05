import request from '@/utils/request'

export function saveErrorLog(data) {
  return request({
    url: '/system/saveErrorLog',
    method: 'post',
    data
  })
}

