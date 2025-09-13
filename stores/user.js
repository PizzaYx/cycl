// stores/user.js
import { defineStore } from 'pinia'
import { apiGetInfo } from '@/api/apis.js'

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null,
        isLoggedIn: false,
    }),

    getters: {
        // 用户昵称
        nickName: (state) => state.userInfo?.nickName || '',

        // 用户名
        userName: (state) => state.userInfo?.userName || '',

        // 用户ID
        userId: (state) => state.userInfo?.userId || null,

        //merchant 商户信息
        merchant: (state) => state.userInfo?.merchant || null,

        //收运端--师傅信息
        sfmerchant: (state) => state.userInfo?.driver || null,

        // 商户头像（使用昵称第一个字）
        userAvatar: (state) => {
            const name = state.userInfo?.name
            // 如果有昵称，取第一个字；如果没有，显示默认头像文字
            return name ? name.charAt(0) : '商'
        },

        //收运端--师傅头像
        userSFAvatar: (state) => {
            const name = state.userInfo?.nickName
            // 如果有昵称，取第一个字；如果没有，显示默认头像文字
            return name ? name.charAt(0) : '收'
        },

        // 是否已认证（merchant不为null且status为1表示已认证）
        isVerified: (state) => state.userInfo?.merchant !== null && state.userInfo?.merchant?.status === 1,

        // 认证状态：0=未审核/待审核，1=认证成功，2=审核不通过
        merchantStatus: (state) => {
            if (!state.userInfo?.merchant) {
                return null // 未提交认证
            }
            return state.userInfo.merchant.status
        },

        // 认证状态文字
        merchantStatusText: (state) => {
            const status = state.userInfo?.merchant?.status
            switch (status) {
                case 0:
                    return '待审核'
                case 1:
                    return '认证成功'
                case 2:
                    return '审核不通过'
                default:
                    return '未认证'
            }
        },

        // 用户类型（1=商户，2=收运）
        userType: (state) => state.userInfo?.type || '1',

        // 用户类型文字
        userTypeText: (state) => {
            const type = state.userInfo?.type
            return type === '1' ? '商户端' : type === '2' ? '收运端' : '未知'
        },

    },

    actions: {
        // 设置用户信息（仅存储在内存中）
        setUserInfo(userInfo) {
            this.userInfo = userInfo
            this.isLoggedIn = true
        },

        // 从服务器获取用户信息
        async fetchUserInfo() {
            try {
                const res = await apiGetInfo()
                console.log('fetchUserInfo收到响应:', res)

                // 检查响应是否存在
                if (!res) {
                    console.log('响应为空，可能是401跳转情况')
                    return null
                }

                // 处理响应结构：可能是 {code: 200, ...} 或 {data: {code: 401, ...}}
                const responseData = res.data || res
                const code = responseData.code

                if (code === 200) {
                    this.setUserInfo(res.user || responseData.user)
                    console.log('用户信息获取成功:', res.user || responseData.user)
                    return res.user || responseData.user
                } else if (code === 401) {
                    // 401错误已被request.js处理（跳转登录），这里不需要抛出异常
                    console.log('用户未登录，已跳转到登录页')
                    return null
                } else {
                    console.log('获取用户信息失败，code:', code, 'msg:', responseData.msg)
                    // 不抛出异常，而是返回null
                    return null
                }
            } catch (error) {
                console.log('获取用户信息异常:', error.message || error)
                // 不重新抛出异常，而是返回null
                return null
            }
        },

        // 更新用户信息（仅内存更新）
        updateUserInfo(updates) {
            if (this.userInfo) {
                this.userInfo = { ...this.userInfo, ...updates }
                console.log('用户信息已更新:', this.userInfo)
            }
        },

        // 检查是否有用户信息，没有则自动获取
        async ensureUserInfo() {
            // 如果已有用户信息，直接返回
            if (this.userInfo) {
                return this.userInfo
            }

            // 尝试获取用户信息（request.js会自动处理token验证）
            const result = await this.fetchUserInfo()
            if (result === null) {
                // 获取失败（可能是401、网络错误等），返回null而不抛出异常
                console.log('用户信息获取失败，可能未登录或网络异常')
                return null
            }
            return this.userInfo
        },

        // 清除用户信息
        clearUserInfo() {
            this.userInfo = null
            this.isLoggedIn = false
            console.log('用户信息已清除')
        },

        // 退出登录
        logout() {
            // 清除用户信息
            this.clearUserInfo()

            // 清除token
            uni.removeStorageSync('access_token')
            uni.removeStorageSync('access_expire_time')
            uni.removeStorageSync('refresh_token')
            uni.removeStorageSync('refresh_expire_time')

            console.log('用户已退出登录')

            // 跳转到登录页
            uni.redirectTo({
                url: '/pages/index/index'
            })
        }
    }
})
