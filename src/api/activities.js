import request from '@/utils/request'

// 创建活动
export function addActive(data) {
  return request({
    url: '/manager/active/add',
    method: 'post',
    data
  })
}
// 获取活动详情
export function getActive(id) {
  return request({
    url: `/manager/active/get/${id}`,
    method: 'get'
  })
}
//
// 分页获取活动列表
export function getActivePages(params) {
  return request({
    url: `/manager/active/pages`,
    method: 'get',
    params
  })
}
// 修改活动
export function updateActive(data) {
  return request({
    url: '/manager/active/update',
    method: 'post',
    data
  })
}
// 创建活动日志
export function addActiveLog(data) {
  return request({
    url: '/manager/active/log/add',
    method: 'post',
    data
  })
}
// 获取活动日志详情
export function getActiveLogDetail(id) {
  return request({
    url: `/manager/active/log/list/${id}`,
    method: 'get'
  })
}
// 创建活动关联记录
export function createActiveLink(data) {
  return request({
    url: `/manager/active/link/user/add`,
    method: 'post',
    data
  })
}
// 创建活动关联记录详情
export function getActiveLink(id) {
  return request({
    url: `/manager/active/link/user/get/${id}`,
    method: 'get'
  })
}
// 分页获取活动关联用户列
export function getActiveLinkUser(params) {
  return request({
    url: `/manager/active/link/user/pages`,
    method: 'get',
    params
  })
}
// 活动链接用户活动修改 ？
export function updateActiveLinkUser(data) {
  return request({
    url: `/manager/active/link/user/update`,
    method: 'post',
    data
  })
}
