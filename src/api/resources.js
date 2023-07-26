import request from '@/utils/request'
// 获取资源位配置列表
export function getResourcesSettingList(params) {
  return request({
    url: '/manager/resources/location/rule/list',
    method: 'get',
    params
  })
}

// 获取资源位类型列表
export function getResourcesTypeList() {
  return request({
    url: '/manager/resources/location/type/list',
    method: 'get'
  })
}
// 获取用户站点列表
export function getUserSiteList() {
  return request({
    url: '/manager/resources/location/site/list',
    method: 'get'
  })
}
//  添加资源位规则
export function addResourcesSetting(data) {
  return request({
    url: '/manager/resources/location/rule',
    method: 'post',
    data
  })
}
// 更新资源位规则
export function updateResourcesSetting(data) {
  return request({
    url: '/manager/resources/location/rule/' + data.id,
    method: 'post',
    data
  })
}

// 获取资源位列表
export function getResourcesList(params) {
  return request({
    url: '/manager/resources/location/list',
    method: 'get',
    params
  })
}
// 获取可用的资源规则
export function getAvailableResourcesRule() {
  return request({
    url: '/manager/resources/location/availableRule',
    method: 'get'
  })
}

// 上传资源位图片
export function uploadResourcesImg(data) {
  return request({
    url: '/manager/resources/file/upload',
    method: 'post',
    data
  })
}

// 添加资源位
export function addResources(data) {
  return request({
    url: '/manager/resources/location',
    method: 'post',
    data
  })
}
// 更新资源位
export function updateResources(data) {
  return request({
    url: '/manager/resources/location/' + data.id,
    method: 'post',
    data
  })
}
