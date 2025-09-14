<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="注册"
            @clickLeft="back" />

        <view class="register-form">
            <view class="inputInfo">
                <view class="zh">账号</view>
                <input class="account" placeholder="请输入账号" type="text" placeholder-class="input-placeholder"
                    v-model="formData.account" />
                <view class="zh mm">密码</view>
                <input class="account password" placeholder="请输入密码" type="safe-password"
                    placeholder-class="input-placeholder" v-model="formData.password" />
                <view class="zh mm">确认密码</view>
                <input class="account password" placeholder="请再次输入密码" type="safe-password"
                    placeholder-class="input-placeholder" v-model="formData.confirmPassword" />
            </view>

            <view class="register-button">
                <button class="register-btn" @click="handleRegister">注册</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'

// 表单数据
const formData = ref({
    account: '',
    password: '',
    confirmPassword: ''
})



// 返回上一页
const back = () => {
    uni.navigateBack()
}

// 处理注册
const handleRegister = () => {
    if (!formData.value.account) {
        uni.showToast({
            title: '请输入账号',
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

    if (formData.value.password !== formData.value.confirmPassword) {
        uni.showToast({
            title: '两次输入的密码不一致',
            icon: 'none'
        })
        return
    }

    // 这里可以添加实际的注册逻辑
    uni.showToast({
        title: '注册成功',
        icon: 'success'
    })

    // 注册成功后返回登录页面
    setTimeout(() => {
        uni.navigateBack()
    }, 1500)
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #fff;
    min-height: 100vh;
}

.register-form {
    padding: 30rpx;

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

    .register-button {
        padding-top: 30rpx;
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 50rpx;

        .register-btn {
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
</style>