// stores/user.js
import { defineStore } from 'pinia'
import { apiGetInfo } from '@/api/apis.js'

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null,
        isLoggedIn: false,
        currentMerchantIndex: 0, // 当前选中的商户索引
        currentDriverIndex: 0, // 当前选中的司机索引
    }),

    getters: {
        // 用户昵称
        nickName: (state) => state.userInfo?.nickName || '',

        // 用户名
        userName: (state) => state.userInfo?.userName || '',

        // 用户ID
        userId: (state) => state.userInfo?.userId || null,

        // 所有商户列表
        merchants: (state) => {
            const merchant = state.userInfo?.merchant
            if (Array.isArray(merchant)) {
                return merchant
            } else if (merchant) {
                // 兼容旧结构（如果后端返回单个对象）
                return [merchant]
            }
            return []
        },

        // 当前选中的商户信息（单个对象）
        currentMerchant: (state) => {
            const list = state.userInfo?.merchant
            // 处理数组情况
            if (Array.isArray(list)) {
                if (list.length > 0 && state.currentMerchantIndex < list.length) {
                    return list[state.currentMerchantIndex]
                }
                return null
            }
            // 处理单个对象情况（兼容旧逻辑）
            return list || null
        },

        // 兼容旧代码：merchant 指向 currentMerchant
        merchant: (state) => {
            // 复用 currentMerchant 的逻辑
            const list = state.userInfo?.merchant
            if (Array.isArray(list)) {
                if (list.length > 0 && state.currentMerchantIndex < list.length) {
                    return list[state.currentMerchantIndex]
                }
                return null
            }
            return list || null
        },

        // 所有司机列表
        drivers: (state) => {
            const driver = state.userInfo?.driver
            if (Array.isArray(driver)) {
                return driver
            } else if (driver) {
                // 兼容旧结构
                return [driver]
            }
            return []
        },

        // 当前选中的司机信息
        currentDriver: (state) => {
            const list = state.userInfo?.driver
            // 处理数组情况
            if (Array.isArray(list)) {
                if (list.length > 0 && state.currentDriverIndex < list.length) {
                    return list[state.currentDriverIndex]
                }
                return null
            }
            // 处理单个对象情况
            return list || null
        },

        //收运端--师傅信息 (兼容旧代码)
        sfmerchant: (state) => {
            const list = state.userInfo?.driver
            // 处理数组情况
            if (Array.isArray(list)) {
                if (list.length > 0 && state.currentDriverIndex < list.length) {
                    return list[state.currentDriverIndex]
                }
                return null
            }
            return list || null
        },

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
        isVerified(state) {
            return this.currentMerchant !== null && this.currentMerchant?.status === 1
        },

        // 认证状态：0=未审核/待审核，1=认证成功，2=审核不通过
        merchantStatus(state) {
            if (!this.currentMerchant) {
                return null // 未提交认证
            }
            return this.currentMerchant.status
        },

        // 认证状态文字
        merchantStatusText(state) {
            const status = this.currentMerchant?.status
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
        // 切换当前商户
        switchMerchant(index) {
            if (this.userInfo?.merchant && Array.isArray(this.userInfo.merchant)) {
                if (index >= 0 && index < this.userInfo.merchant.length) {
                    this.currentMerchantIndex = index
                    console.log('已切换商户索引为:', index)
                    return true
                }
            }
            return false
        },

        // 切换当前司机
        switchDriver(index) {
            if (this.userInfo?.driver && Array.isArray(this.userInfo.driver)) {
                if (index >= 0 && index < this.userInfo.driver.length) {
                    this.currentDriverIndex = index
                    console.log('已切换司机索引为:', index)
                    return true
                }
            }
            return false
        },

        // 设置用户信息（仅存储在内存中）
        setUserInfo(userInfo) {
            this.userInfo = userInfo
            this.isLoggedIn = true
        },

        // 从服务器获取用户信息
        async fetchUserInfo(returnUserType = false) {
            try {
                const res = await apiGetInfo()
                // 检查响应是否存在
                if (!res) {
                    console.log('响应为空，可能是401跳转情况')
                    return null
                }
                const responseData = res.data || res
                const code = responseData.code

                if (code === 200) {
                    const userInfo = res.user || responseData.user
                    this.setUserInfo(userInfo)

                    // 如果需要返回用户类型，则返回包含用户类型的对象
                    if (returnUserType) {
                        return {
                            userInfo: userInfo,
                            userType: userInfo?.type
                        }
                    }

                    return userInfo
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

        // 更新当前商户信息
        updateCurrentMerchant(merchantData) {
            if (this.userInfo?.merchant && Array.isArray(this.userInfo.merchant)) {
                if (this.currentMerchantIndex >= 0 && this.currentMerchantIndex < this.userInfo.merchant.length) {
                    // 使用 Vue 的响应式更新方式（虽然 Pinia 自动处理，但为了安全直接替换对象）
                    this.userInfo.merchant[this.currentMerchantIndex] = merchantData
                    console.log('当前商户信息已更新')
                }
            } else if (this.userInfo?.merchant) {
                // 兼容非数组情况
                this.userInfo.merchant = merchantData
            }
        },

        // 添加新商户
        addMerchant(merchantData) {
            if (!this.userInfo) return

            if (!this.userInfo.merchant) {
                this.userInfo.merchant = [merchantData]
            } else if (Array.isArray(this.userInfo.merchant)) {
                this.userInfo.merchant.push(merchantData)
            } else {
                // 如果原来是单对象，转为数组
                this.userInfo.merchant = [this.userInfo.merchant, merchantData]
            }

            // 切换到新添加的商户
            if (Array.isArray(this.userInfo.merchant)) {
                this.currentMerchantIndex = this.userInfo.merchant.length - 1
            }
        },

        // 检查是否有用户信息，没有则自动获取
        async ensureUserInfo() {
            // 每次都重新获取用户信息，确保数据是最新的
            // 因为用户信息随时会改变，不应该依赖缓存
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
