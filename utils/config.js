// 公共配置文件上传

export const uploadUrl = 'https://demo.vps4cloud.com/api/merchantapi/webupload'
//export const uploadUrl = 'http://192.168.0.118:8080/api/merchantapi/webupload'
// 天地图API配置
export const TIANDITU_CONFIG = {
    // 天地图API密钥
    API_KEY: '1fea78f710be3a88282ab14019dd34c7',
    // 天地图路径规划API地址
    ROUTE_API_URL: 'https://api.tianditu.gov.cn/v2/route',
    // 请求超时时间（毫秒）
    TIMEOUT: 10000
}

import { computed } from 'vue'

export const createUploadHeaders = () => {
    return computed(() => {
        const accessToken = uni.getStorageSync('access_token')
        return {
            'authorization': accessToken ? `Bearer ${accessToken}` : ''
        }
    })
}