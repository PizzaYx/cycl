// 公共配置文件
export const uploadUrl = 'http://192.168.0.118:8089/api/merchantapi/webupload'

import { computed } from 'vue'

export const createUploadHeaders = () => {
  return computed(() => {
    const accessToken = uni.getStorageSync('access_token')
    return {
      'authorization': accessToken ? `Bearer ${accessToken}` : ''
    }
  })
}