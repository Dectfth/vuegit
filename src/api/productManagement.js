import request from '@/utils/request'
// 获取倒计时数据返回
export function getPMList() {
  return request({
    url: '/fission/flashSale/config',
    method: 'get'
  })
}
// 修改倒计时信息
export function refreshPMInfo(data) {
  return request({
    url: '/manager/flashSale/config',
    method: 'post',
    data
  })
}
