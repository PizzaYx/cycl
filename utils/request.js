// utils/request.js
const BASE_URL = 'http://192.168.0.200:8080'

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
        console.log('Access Token:', accessToken); // 调试输出
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
    // 处理401未授权
    if (res.statusCode === 401) {
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
          // 刷新失败，跳转登录
          logout()
          return Promise.reject(res)
        }
      } catch (error) {
        // 刷新失败，跳转登录
        logout()
        return Promise.reject(res)
      }
    } else if (res.data.code === 200) {
      // 特殊处理：如果是登录接口，自动保存token
      if (
        res.config &&
        res.config.url &&
        res.config.url.includes('/api/apiLogin') &&
        res.data.data &&
        res.data.data.access_token
      ) {
		  console.log("登录接口");
		  console.log(res.data.data);
        saveToken(res.data.data)
      }
      return res.data
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
    const refreshTokenStr = uni.getStorageSync('refresh_token')
    const refreshExpireTime = uni.getStorageSync('refresh_expire_time')

    if (!refreshTokenStr || !refreshExpireTime) {
      // refresh token不存在，直接跳转登录
      throw new Error('未登录')
    }

    // 检查refresh token是否过期
    const now = Date.now()
    if (now > refreshExpireTime) {
      // refresh token过期，跳转登录
      throw new Error('登录已过期')
    }

    // 刷新token
    refreshingPromise = refreshAccessToken(refreshTokenStr)

    await refreshingPromise
  } finally {
    // 清除刷新状态
    refreshingPromise = null
  }
}

/**
 * 刷新access token
 */
async function refreshAccessToken(refreshTokenStr) {
  const res = await post('/api/apiRefresh', {
    refresh_token: refreshTokenStr,
  })

  if (res.code === 200) {
    // 保存新的token信息
    saveToken(res.data)
    return res
  } else {
    // 刷新失败，清除本地存储
    clearToken()
    throw new Error(res.msg || '刷新token失败')
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

export default {
  request
}
