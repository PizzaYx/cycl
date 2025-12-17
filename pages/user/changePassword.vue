<template>
    <view class="container">
        <PageHeader title="修改密码" @back="back" />

        <view class="register-form">
            <view class="inputInfo">
                <view class="input-group">
                    <view class="zh">旧密码:</view>
                    <input class="account password" placeholder="请输入旧密码" type="password"
                        placeholder-class="input-placeholder" v-model="formData.oldPassword" />
                </view>

                <view class="input-group">
                    <view class="zh mm">新密码:</view>
                    <input class="account password" placeholder="请输入新密码(至少6位)" type="password"
                        placeholder-class="input-placeholder" v-model="formData.newPassword" />
                </view>

                <view class="input-group">
                    <view class="zh mm">确认新密码:</view>
                    <input class="account password" placeholder="请再次输入新密码" type="password"
                        placeholder-class="input-placeholder" v-model="formData.confirmPassword" />
                </view>
            </view>

            <view class="register-button">
                <button class="register-btn" @click="handleSubmit">确认修改</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import {
    apiEditPassword
} from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'
import PageHeader from '@/components/PageHeader/PageHeader.vue'

const userStore = useUserStore()

// 表单数据
const formData = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// 返回上一页
const back = () => {
    uni.navigateBack()
}

// 处理修改密码
const handleSubmit = () => {
    if (!formData.value.oldPassword) {
        uni.showToast({
            title: '请输入旧密码',
            icon: 'none'
        })
        return
    }

    if (!formData.value.newPassword) {
        uni.showToast({
            title: '请输入新密码',
            icon: 'none'
        })
        return
    }

    // 验证密码长度
    if (formData.value.newPassword.length < 6) {
        uni.showToast({
            title: '新密码至少需要6位',
            icon: 'none'
        })
        return
    }

    if (formData.value.newPassword !== formData.value.confirmPassword) {
        uni.showToast({
            title: '两次输入的新密码不一致',
            icon: 'none'
        })
        return
    }

    if (!userStore.userName) {
        uni.showToast({
            title: '获取用户信息失败',
            icon: 'none'
        })
        return
    }

    uni.showLoading({
        title: '提交中...',
        mask: true
    })

    const params = {
        username: userStore.userName,
        oldPassword: formData.value.oldPassword,
        newPassword: formData.value.newPassword
    }

    console.log('修改密码参数', params);

    apiEditPassword(params).then(res => {
        if (res.code === 200) {
            uni.showToast({
                title: '修改成功',
                icon: 'success'
            })
            setTimeout(() => {
                uni.navigateBack()
            }, 1500)
        }
        else {
            uni.showToast({
                title: res.msg || '修改失败',
                icon: 'none'
            })
        }
    }).catch(err => {
        console.error('修改失败:', err);
        uni.showToast({
            title: '修改失败',
            icon: 'none'
        })
    }).finally(() => {
        uni.hideLoading()
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
            background: #07c160; // 浅绿色背景
            border-radius: 40rpx;
            color: #fff; // 绿色文字
            font-size: 32rpx;
            font-weight: 400;
            box-shadow: 0 8rpx 20rpx rgba(7, 193, 96, 0.3);

            &::after {
                border: none; // 去除button默认边框
            }
            
            &:active {
                transform: scale(0.98);
                transition: transform 0.1s;
            }
        }
    }
}
</style>
