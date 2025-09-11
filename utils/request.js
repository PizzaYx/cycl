// utils/request.js
const BASE_URL = 'http://192.168.0.118:8089'

// 存储刷新token的Promise，避免并发请求时重复刷新
let refreshingPromise = null

// 请求拦截器
uni.addInterceptor('request', {
    invoke(args) {
        // 添加基础URL
        if (!args.url.startsWith('http')) {
            args.url = BASE_URL + args.url
        }

        // 添加access token到请求头
        const accessToken = uni.getStorageSync('access_token')
        console.log('Access Token:', accessToken) // 调试输出

        // 打印请求信息
        console.log('【Request】', args.url, args.method || 'GET', args.data || {})

        if (accessToken) {
            args.header = args.header || {}
            args.header['authorization'] = `Bearer ${accessToken}`
        }

        return args
    },
})

// 响应拦截器
uni.addInterceptor('request', {
    success: async (res) => {
        // 打印响应信息
        console.log('【Response】', res.config?.url, res.statusCode, res.data)

        if (res.statusCode === 200) {
            // 处理401未授权
            if (res.data.code === 401) {
                try {
                    await handleUnauthorized()
                    // 刷新token后重新发起请求
                    const newToken = uni.getStorageSync('access_token')
                    if (newToken) {
                        // 重新发起请求
                        const originalRequest = res.config || {}
                        originalRequest.header = originalRequest.header || {}
                        originalRequest.header['authorization'] = `Bearer ${newToken}`

                        return uni.request(originalRequest)
                    } else {
                        // 刷新失败，跳转登录，但不抛出异常
                        logout()
                        // 返回一个空的成功响应，避免错误日志
                        return Promise.resolve({ data: { code: 401, msg: '登录已过期' } })
                    }
                } catch (error) {
                    // 刷新失败，跳转登录，但不抛出异常
                    console.log('Token刷新失败:', error.message)
                    logout()
                    // 返回一个空的成功响应，避免错误日志
                    return Promise.resolve({ data: { code: 401, msg: '登录已过期' } })
                }
            }
            if (res.data.code === 200) {
                // 特殊处理：如果响应包含token信息，自动保存token（登录接口）
                if (res.data.data && res.data.data.access_token && res.data.data.refresh_token) {
                    saveToken(res.data.data)
                }
                return res.data
            } else {
                // 处理业务错误（如500等），仍然返回数据而不是undefined
                return res.data
            }
        } else {
            handleRequestError(res.data)
            return Promise.reject(res.data)
        }
    },
    fail: (err) => {
        return Promise.reject(err)
    },
})

// 简化的请求函数
export function request(config = {}) {
    const { url, data = {}, method = 'GET', header = {}, ...rest } = config

    return uni.request({
        url,
        data,
        method,
        header,
        ...rest,
    })
}

/**
 * 处理未授权情况
 */
async function handleUnauthorized() {
    // 如果正在刷新token，则等待刷新完成
    if (refreshingPromise) {
        return refreshingPromise
    }

    try {
        // 检查refresh token是否过期
        console.log('未授权，正在处理...')
        const refreshTokenStr = uni.getStorageSync('refresh_token')
        const refreshExpireTime = uni.getStorageSync('refresh_expire_time')
        console.log('检查refresh token:', refreshTokenStr ? '存在' : '不存在', refreshExpireTime)

        if (!refreshTokenStr || !refreshExpireTime) {
            // refresh token不存在，直接跳转登录
            console.log('refresh token不存在，跳转登录')
            logout()
            // 不抛出异常，而是返回失败状态
            return Promise.resolve(false)
        }

        // 检查refresh token是否过期
        const now = Date.now()
        if (now > refreshExpireTime) {
            // refresh token过期，跳转登录
            console.log('refresh token已过期，跳转登录')
            logout()
            // 不抛出异常，而是返回失败状态
            return Promise.resolve(false)
        }

        // 刷新token
        refreshingPromise = refreshAccessToken(refreshTokenStr)
        const result = await refreshingPromise
        return result
    } catch (error) {
        console.log('处理未授权异常:', error.message)
        logout()
        return Promise.resolve(false)
    } finally {
        // 清除刷新状态
        refreshingPromise = null
    }
}

/**
 * 刷新access token
 */
async function refreshAccessToken(refreshTokenStr) {
    try {
        const res = await post('/api/apiRefresh', {
            refresh_token: refreshTokenStr,
        })

        if (res.code === 200) {
            // 保存新的token信息
            saveToken(res.data)
            console.log('Token刷新成功')
            return true
        } else {
            // 刷新失败，清除本地存储
            console.log('Token刷新失败:', res.msg || '未知错误')
            clearToken()
            logout()
            return false
        }
    } catch (error) {
        // 网络错误等异常情况
        console.log('Token刷新网络异常:', error.message || '未知错误')
        clearToken()
        logout()
        return false
    }
}

/**
 * 保存token信息
 */
function saveToken(tokenData) {
    const now = Date.now()

    // 保存access token
    uni.setStorageSync('access_token', tokenData.access_token)
    uni.setStorageSync('access_expire_time', now + tokenData.access_expire_time * 1000)

    // 保存refresh token
    uni.setStorageSync('refresh_token', tokenData.refresh_token)
    uni.setStorageSync('refresh_expire_time', now + tokenData.refresh_expire_time * 1000)
}

/**
 * 清除token信息
 */
function clearToken() {
    uni.removeStorageSync('access_token')
    uni.removeStorageSync('access_expire_time')
    uni.removeStorageSync('refresh_token')
    uni.removeStorageSync('refresh_expire_time')
}

/**
 * 退出登录
 */
function logout() {
    clearToken()
    // 跳转到登录页面
    uni.redirectTo({
        url: '/pages/index/index',
    })
}

/**
 * 处理请求错误
 */
function handleRequestError(data) {
    if (data.msg) {
        uni.showToast({
            title: data.msg,
            icon: 'none',
        })
    }
}

// 基础HTTP方法
export function get(url, data = {}, config = {}) {
    return request({ url, data, method: 'GET', ...config })
}

export function post(url, data = {}, config = {}) {
    return request({ url, data, method: 'POST', ...config })
}

export function put(url, data = {}, config = {}) {
    return request({ url, data, method: 'PUT', ...config })
}

export function del(url, data = {}, config = {}) {
    return request({ url, data, method: 'DELETE', ...config })
}

export default {
    request,
    get,
    post,
    put,
    del,
}
