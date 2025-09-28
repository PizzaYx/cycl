// 网络状态检测工具

/**
 * 检测网络状态
 * @returns {Promise<boolean>} 是否有网络连接
 */
export function checkNetworkStatus() {
    return new Promise((resolve) => {
        uni.getNetworkType({
            success: (res) => {
                console.log('网络类型:', res.networkType)
                // none: 无网络, wifi: wifi网络, 2g: 2g网络, 3g: 3g网络, 4g: 4g网络, 5g: 5g网络
                const hasNetwork = res.networkType !== 'none'
                resolve(hasNetwork)
            },
            fail: () => {
                console.log('获取网络状态失败')
                resolve(false)
            }
        })
    })
}

/**
 * 监听网络状态变化
 * @param {Function} callback 网络状态变化回调函数
 */
export function onNetworkStatusChange(callback) {
    uni.onNetworkStatusChange((res) => {
        console.log('网络状态变化:', res)
        callback(res.isConnected, res.networkType)
    })
}

/**
 * 显示网络错误提示
 * @param {string} message 错误信息
 */
export function showNetworkError(message = '网络连接失败，请检查网络设置') {
    uni.showModal({
        title: '网络错误',
        content: message,
        showCancel: true,
        cancelText: '取消',
        confirmText: '重试',
        success: (res) => {
            if (res.confirm) {
                // 用户点击重试，可以在这里添加重试逻辑
                console.log('用户选择重试')
            }
        }
    })
}

/**
 * 带重试的网络请求
 * @param {Function} requestFn 请求函数
 * @param {number} maxRetries 最大重试次数
 * @param {number} retryDelay 重试延迟时间(毫秒)
 * @returns {Promise} 请求结果
 */
export async function requestWithRetry(requestFn, maxRetries = 3, retryDelay = 1000) {
    let lastError = null

    for (let i = 0; i <= maxRetries; i++) {
        try {
            // 检查网络状态
            const hasNetwork = await checkNetworkStatus()
            if (!hasNetwork) {
                throw new Error('网络连接不可用')
            }

            const result = await requestFn()
            return result
        } catch (error) {
            lastError = error
            console.log(`请求失败，第${i + 1}次重试:`, error.message)

            // 如果不是最后一次重试，等待后重试
            if (i < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)))
            }
        }
    }

    // 所有重试都失败了
    throw lastError
}
