import request from '@/utils/request'

// import { param } from '@/utils'

export function saveErrorLog(data) {
  return request({
    url: '/system/saveErrorLog',
    method: 'post',
    data
  })
}
