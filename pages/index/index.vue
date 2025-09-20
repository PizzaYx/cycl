<template>
    <!-- 主登录 -->
    <view class="loginLayout">
        <view class="headImage">
            <image src="/static/headTopBg.png" mode="aspectFill"></image>
        </view>
        <view class="loginInfo">
            <view class="logo">
                <image src="/static/logo.png" mode="aspectFill"></image>
            </view>
            <view class="title"> 厨余处理小程序 </view>
            <view class="subtitle"> 智能收运·绿色环保 </view>
            <view class="chooseRow">
                <view class="tab-item" :class="{ active: activeTab === 0 }" @click="activeTab = 0">
                    商户端
                    <view class="indicator" v-if="activeTab === 0"></view>
                </view>
                <view class="tab-item" :class="{ active: activeTab === 1 }" @click="activeTab = 1">
                    收运端
                    <view class="indicator" v-if="activeTab === 1"></view>
                </view>
            </view>
            <view class="inputInfo">
                <view class="zh">账号</view>
                <input class="account" placeholder="请输入账号" type="text" placeholder-class="input-placeholder"
                    v-model="formData.account" />
                <view class="zh mm">密码</view>
                <view class="password-input-container">
                    <input class="account password" placeholder="请输入密码" :password="!passwordVisible" type="text"
                        placeholder-class="input-placeholder" v-model="formData.password" />
                    <uni-icons :type="passwordVisible ? 'eye' : 'eye-filled'" size="20" color="rgba(61, 61, 61, 0.5)"
                        class="password-toggle" @tap="togglePasswordVisibility">
                    </uni-icons>
                </view>
                <!-- <text class="forgot-password" @click="handleForgotPassword" v-if="activeTab === 0">忘记密码？</text> -->
            </view>
            <view class="loginBtn">
                <button type="button" @click="handleLogin">登录</button>
            </view>
            <view class="registerBtn" v-if="activeTab === 0">
                <button type="button" @click="handleRegister">注册</button>
            </view>
        </view>
        <view class=" footer">
            <uni-icons :type="agreed ? 'circle-filled' : 'circle'" size="22"
                :color="agreed ? 'rgba(7, 193, 96, 1)' : 'rgba(19, 19, 19, 0.5)'" @click="toggleAgreement">
            </uni-icons>
            <view class="agreement-text">
                <text class="normal-text">我已阅读并同意</text>
                <text class="link-text" @click="openAgreement('user')">《用户协议》</text>
                <text class="normal-text">和</text>
                <text class="link-text" @click="openAgreement('privacy')">《隐私服务》</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import {
    reactive,
    ref,
    onMounted
} from 'vue'

import {
    apiPostLogin,
    apiGetInfo
} from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'

//商户端/收运端
const activeTab = ref(0)

//是否同意
const agreed = ref(false)

// 使用用户 store
const userStore = useUserStore()

//页面加载时检查缓存
onMounted(async () => {
    await checkLoginStatus()
})

//检查登录状态
const checkLoginStatus = async () => {
    try {
        // 检查是否有access_token
        const token = uni.getStorageSync('access_token')
        if (!token) {
            console.log('没有access_token，需要登录')
            return
        }

        console.log('检测到token，获取用户信息...')

        // 获取用户信息
        const userInfo = await userStore.fetchUserInfo()
        if (!userInfo) {
            console.log('获取用户信息失败，需要重新登录')
            return
        }

        // 根据用户类型跳转
        const userType = userInfo.type
        console.log('用户类型:', userType)

        if (userType === '1') {
            // 商户端
            console.log('跳转到商户端')
            uni.reLaunch({
                url: '/pages/merchant/merchant'
            })
        } else if (userType === '2') {
            // 收运端
            console.log('跳转到收运端')
            uni.reLaunch({
                url: '/pages/collection/collection'
            })
        } else {
            console.log('未知用户类型，需要重新登录')
        }
    } catch (error) {
        console.error('检查登录状态失败:', error)
    }
}

const toggleAgreement = () => {
    agreed.value = !agreed.value
}

// 打开协议页面
const openAgreement = (type) => {
    // 这里可以添加跳转到协议页面的逻辑
    console.log('打开协议:', type)
    if (type === 'user') {
        uni.navigateTo({
            url: '/pages/user/agreement'
        })
    }
    else {
        uni.navigateTo({
            url: '/pages/user/privacyPolicy'
        })
    }

}

// 表单数据
const formData = reactive({
    account: '',
    password: '',
})

// 控制密码是否可见
const passwordVisible = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value
}

//注册处理
const handleRegister = () => {
    uni.navigateTo({
        url: '/pages/user/register',
    })
}
// 忘记密码处理
const handleForgotPassword = () => {
    uni.showToast({
        title: '忘记密码功能待实现',
        icon: 'none',
    })
    // 这里可以添加跳转到忘记密码页面的逻辑
    // 例如: uni.navigateTo({ url: '/pages/forgotPassword/forgotPassword' })
}

// 登录处理
const handleLogin = () => {
    // 表单验证
    if (!formData.account) {
        uni.showToast({
            title: '请输入账号',
            icon: 'none',
        })
        return
    }

    // if (formData.account.length !== 11) {
    // 	uni.showToast({
    // 		title: '手机号码格式不正确',
    // 		icon: 'none'
    // 	});
    // 	return;
    // }

    // if (!formData.password) {
    // 	uni.showToast({
    // 		title: '请输入密码',
    // 		icon: 'none'
    // 	});
    // 	return;
    // }

    if (formData.password.length < 6) {
        uni.showToast({
            title: '密码长度不能少于6位',
            icon: 'none',
        })
        return
    }

    if (!agreed.value) {
        uni.showToast({
            title: '请先同意用户协议和隐私服务',
            icon: 'none',
        })
        return
    }

    // 调用登录接口
    loginRequest()
}

// 登录请求
const loginRequest = async () => {
    uni.showLoading({
        title: '登录中...',
    })

    try {
        // 使用封装好的API方法
        const res = await apiPostLogin({
            username: formData.account,
            password: formData.password,
        })

        if (res.code === 200) {
            // 先获取用户信息并验证类型
            const userInfo = await fetchUserInfo()

            // 如果用户类型不匹配，fetchUserInfo会显示提示并返回null
            if (!userInfo) {
                uni.hideLoading()
                return // 直接返回，不继续执行登录成功逻辑
            }

            uni.hideLoading() // 隐藏loading
            uni.showToast({
                title: '登录成功',
                icon: 'success',
            })

            // 延迟跳转确保toast显示
            setTimeout(() => {
                uni.reLaunch({
                    url: activeTab.value ? '/pages/collection/collection' :
                        '/pages/merchant/merchant',
                })
            }, 100)
        } else {
            uni.hideLoading() // 隐藏loading
            uni.showToast({
                title: res.msg || '登录失败',
                icon: 'none',
            })
        }
    } catch (err) {
        uni.hideLoading() // 隐藏loading
        uni.showToast({
            title: '网络请求失败',
            icon: 'none',
        })
        console.error('登录请求失败:', err)
    } finally {

    }
}

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const result = await userStore.fetchUserInfo(true) // 传入true获取用户类型
        if (!result) {
            throw new Error('获取用户信息失败')
        }
        const { userInfo, userType } = result
        // 验证用户类型是否匹配选择的入口
        const expectedType = activeTab.value === 0 ? '1' : '2' // 0=商户端(type=1), 1=收运端(type=2)
        if (userType !== expectedType) {
            const currentTypeText = activeTab.value === 0 ? '商户端' : '收运端'
            const actualTypeText = userType === '1' ? '商户端' : '收运端'
            // 使用Promise来处理异步弹窗
            return new Promise((resolve) => {
                uni.showModal({
                    title: '用户类型不匹配',
                    content: `您当前选择的是${currentTypeText}，但该账号是${actualTypeText}用户，请重新选择正确的入口`,
                    showCancel: false,
                    confirmText: '重新选择',
                    success: () => {
                        // 自动切换到正确的入口
                        activeTab.value = userType === '1' ? 0 : 1
                        console.log('切换后的activeTab:', activeTab.value)

                        // 不自动登录，返回null让用户重新点击登录
                        console.log('已切换到正确入口，请重新点击登录')
                        resolve(null)
                    }
                })
            })
        }
        return userInfo
    } catch (error) {
        // 如果是用户类型不匹配的错误，不显示通用错误提示
        if (error.message === '用户类型不匹配') {
            return null
        }
        return null
    }
}

</script>

<style lang="scss" scoped>
.loginLayout {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .headImage {
        position: absolute;
        /* 绝对定位 */
        top: 0;
        left: 0;
        z-index: -1;
        /* 置于其他元素下方 */
        width: 100%;
        height: 442rpx;
        overflow: hidden;

        /* 防止内容溢出 */
        image {
            width: 100%;
            height: 100%;
        }
    }

    .loginInfo {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        padding-top: 284rpx;
        width: 100%;
        flex: 1;

        .logo {
            width: 200rpx;
            height: 200rpx;

            image {
                width: 100%;
                height: 100%;
            }
        }

        .title {
            font-size: 48rpx;
            font-weight: 600;
            color: #131313;
            padding-top: 55rpx;
        }

        .subtitle {
            font-size: 28rpx;
            color: #4b4b4b;
            padding-top: 32rpx;
        }

        .chooseRow {
            display: flex;
            padding-top: 52rpx;

            .tab-item {
                color: rgba(19, 19, 19, 0.5); // 未选中灰色
                font-size: 28rpx;
                position: relative;
                padding: 0 30rpx;

                &.active {
                    color: rgba(19, 19, 19, 1); // 选中黑色
                }

                .indicator {
                    width: 68rpx;
                    height: 16rpx;
                    background: rgba(7, 193, 96, 0.2);
                    border-radius: 100rpx;
                    position: absolute;
                    bottom: -5rpx;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }

            .tab-item:first-child {
                margin-right: 108rpx; // 一半间距
            }

            .tab-item:last-child {
                margin-left: 108rpx; // 一半间距
            }
        }

        .inputInfo {
            padding-top: 65rpx;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .zh {
                width: 608rpx; // 与input宽度一致
                text-align: left; // 文本左对齐
                font-size: 28rpx;
                color: rgba(61, 61, 61, 1);
                margin-bottom: 22rpx; // 与下方input保持间距
                padding-left: 30rpx; // 与input的padding-left对齐

                &.mm {
                    margin-top: 22rpx;
                }
            }


            .account {
                width: 608rpx;
                height: 80rpx;
                background: #f4f4f4;
                border-radius: 40rpx;
                padding: 0 30rpx;
                box-sizing: border-box;
                font-size: 28rpx;
                margin-bottom: 00rpx;

                &:last-child {
                    margin-bottom: 0;
                }

                &.password {
                    margin-bottom: 0;
                    padding-right: 70rpx; // 为眼睛图标留出空间，避免点击冲突
                }
            }

            .password-input-container {
                position: relative;
                width: 608rpx;

                .password-toggle {
                    position: absolute;
                    right: 25rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    padding: 10rpx; // 增加点击区域
                    cursor: pointer;
                }
            }

            .forgot-password {
                width: 608rpx; // 与input宽度一致
                text-align: right; // 右对齐
                font-size: 24rpx;
                color: rgba(61, 61, 61, 0.30);
                margin-top: 10rpx; // 与上方元素保持间距
                padding-right: 30rpx; // 与input的padding-right对齐
            }


            .input-placeholder {
                // font-family: PingFang SC Regular, PingFang SC Regular;
                font-weight: 400;
                font-size: 24rpx;
                color: rgba(61, 61, 61, 0.3);
                line-height: 24rpx;
                text-align: left;
                font-style: normal;
                text-transform: none;
            }
        }

        .loginBtn {
            padding-top: 66rpx;
            width: 100%;
            display: flex;
            justify-content: center;

            button {
                width: 608rpx;
                height: 80rpx;
                background: #07c160;
                border-radius: 40rpx;
                border: none;
                color: white;
                font-size: 32rpx;
                font-weight: 400;

                &::after {
                    border: none; // 去除button默认边框
                }
            }
        }

        .registerBtn {
            padding-top: 30rpx;
            width: 100%;
            display: flex;
            justify-content: center;

            button {
                width: 608rpx;
                height: 80rpx;
                background: rgba(7, 193, 96, 0.1); // 浅绿色背景
                border-radius: 40rpx;
                color: #07c160; // 绿色文字
                font-size: 32rpx;
                font-weight: 400;

                &::after {
                    border: none; // 去除button默认边框
                }
            }
        }
    }

    .footer {
        flex-shrink: 0;
        padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        .agreement-text {
            display: flex;
            align-items: center;
            margin-left: 10rpx;

            .normal-text {
                font-size: 24rpx;
                color: rgba(61, 61, 61, 0.5);
                line-height: 36rpx;
            }

            .link-text {
                font-size: 24rpx;
                color: rgba(7, 193, 96, 1);
                line-height: 36rpx;

            }
        }

        ::v-deep .uni-icons {
            flex-shrink: 0;
        }
    }

}
</style>