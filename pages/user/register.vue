<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="注册"
            @clickLeft="back" />

        <view class="register-form">
            <view class="inputInfo">
                <view class="input-group">
                    <view class="zh">账号(手机号):</view>
                    <input class="account" placeholder="请输入11位手机号" type="number" placeholder-class="input-placeholder"
                        v-model="formData.username" maxlength="11" />
                </view>

                <view class="input-group">
                    <view class="zh">昵称:</view>
                    <input class="account" placeholder="请输入昵称" type="text" placeholder-class="input-placeholder"
                        v-model="formData.nickname" />
                </view>

                <view class="input-group">
                    <view class="zh mm">密码:</view>
                    <input class="account password" placeholder="请输入密码(至少6位)" type="safe-password"
                        placeholder-class="input-placeholder" v-model="formData.password" />
                </view>

                <view class="input-group">
                    <view class="zh mm">确认密码:</view>
                    <input class="account password" placeholder="请再次输入密码" type="safe-password"
                        placeholder-class="input-placeholder" v-model="formData.confirmPassword" />
                </view>
            </view>

            <view class="register-button">
                <button class="register-btn" @click="handleRegister">注册</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import {
    apiPostRegister
} from '@/api/apis.js'

// 表单数据
const formData = ref({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: ''
})



// 返回上一页
const back = () => {
    uni.navigateBack()
}

// 验证手机号格式
const validatePhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
}

// 处理注册
const handleRegister = () => {
    if (!formData.value.username) {
        uni.showToast({
            title: '请输入账号',
            icon: 'none'
        })
        return
    }

    // 验证手机号格式
    if (!validatePhone(formData.value.username)) {
        uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none'
        })
        return
    }

    if (!formData.value.nickname) {
        uni.showToast({
            title: '请输入昵称',
            icon: 'none'
        })
        return
    }

    if (!formData.value.password) {
        uni.showToast({
            title: '请输入密码',
            icon: 'none'
        })
        return
    }

    // 验证密码长度
    if (formData.value.password.length < 6) {
        uni.showToast({
            title: '密码至少需要6位',
            icon: 'none'
        })
        return
    }

    if (formData.value.password !== formData.value.confirmPassword) {
        uni.showToast({
            title: '两次输入的密码不一致',
            icon: 'none'
        })
        return
    }


    uni.showLoading({
        title: '注册中...',
        mask: true
    })

    console.log('注册参数', formData.value);

    apiPostRegister(formData.value).then(res => {
        // 这里可以添加实际的注册逻辑
        if (res.code === 200) {
            uni.showToast({
                title: '注册成功',
                icon: 'success'
            })
            uni.navigateBack()
        }
        else {
            uni.showToast({
                title: res.msg || '注册失败',
                icon: 'none'
            })

        }

    }).catch(err => {
        console.error('注册失败:', err);
    })



}
</script>

<style lang="scss" scoped>
.container {
    background-color: #fff;
    min-height: 100vh;
}

.register-form {

    .inputInfo {
        padding-top: 65rpx;
        margin: 0 30rpx;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40rpx; // 组之间的间距

        .input-group {
            width: 100%;
            display: flex;
            flex-direction: column;

            .zh {

                text-align: left; // 文本左对齐
                font-size: 30rpx;
                font-weight: 500;
                color: rgba(61, 61, 61, 1);
                margin-bottom: 15rpx; // 减小view和input之间的间距

                &.mm {
                    margin-top: 0rpx; // 移除mm类的上边距
                }
            }

            .account {
                height: 80rpx;
                width: 690rpx;
                box-sizing: border-box;
                font-size: 28rpx;
                margin-bottom: 0rpx;
                border: none;
                border-bottom: 2rpx solid #e0e0e0;
                background-color: transparent;

                &:last-child {
                    margin-bottom: 0;
                }

                &.password {
                    margin-bottom: 0;
                }
            }
        }

    }

    .register-button {
        padding-top: 30rpx;
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 70rpx; // 增加按钮与表单的间距

        .register-btn {
            width: 690rpx;
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
</style>