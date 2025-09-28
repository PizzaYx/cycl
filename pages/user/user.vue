<template>
    <view class="container">
        <PageHeader title="个人信息" @back="back" />
        <view class="content">
            <view class="avatar-section">
                <view class="avatar-container" @tap="handleAvatarClick">
                    <image v-if="avatarUrl" class="avatar" :src="avatarUrl" mode="aspectFill" />
                    <view v-else class="avatar avatar-default">
                        <text class="avatar-text">{{ userStore.userType == 1 ? userStore.userAvatar :
                            userStore.userSFAvatar }}</text>
                    </view>
                    <!-- <view class="avatar-edit-overlay">
                        <uni-icons type="camera-filled" size="32rpx" color="#fff"></uni-icons>
                    </view> -->
                </view>
                <!-- <text class="change-avatar-text">更换头像</text> -->
            </view>

            <view class="info-section">
                <text class="section-title">基本信息</text>

                <view class="info-item">
                    <text class="label">昵称</text>
                    <text class="value">{{ userStore.nickName || '未设置' }}</text>
                </view>

                <view class="info-item">
                    <text class="label">用户名</text>
                    <text class="value">{{ userStore.userName || '未设置' }}</text>
                </view>

                <view class="info-item">
                    <text class="label">用户类型</text>
                    <text class="value">{{ userStore.userTypeText }}</text>
                </view>


            </view>
        </view>

        <!-- 退出登录按钮 -->
        <view class="footer">
            <button class="logout-btn" @tap="handleLogout">退出登录</button>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'
import PageHeader from '@/components/PageHeader/PageHeader.vue'


// 使用用户 store
const userStore = useUserStore()

// 头像URL
const avatarUrl = ref('')
const filePicker = ref(null)

onMounted(async () => {
    // 确保有用户信息
    await userStore.ensureUserInfo()
})

// 返回上一页
const back = () => {
    uni.navigateBack()
}

// 点击头像
const handleAvatarClick = () => {
    // 触发文件选择器
    if (filePicker.value) {
        filePicker.value.chooseFile()
    }
}

// 文件选择回调
const onFileSelect = (e) => {
    console.log('选择文件:', e)
}

// 上传成功回调
const onUploadSuccess = (e) => {
    console.log('上传成功:', e)
    if (e.tempFilePaths && e.tempFilePaths.length > 0) {
        avatarUrl.value = e.tempFilePaths[0]
    }
}

// 上传失败回调
const onUploadFail = (e) => {
    console.log('上传失败:', e)
    uni.showToast({
        title: '上传失败',
        icon: 'none'
    })
}

// 获取认证状态样式类
const getStatusClass = () => {
    const status = userStore.merchantStatus
    switch (status) {
        case 1:
            return 'status-success'
        case 0:
            return 'status-pending'
        case 2:
            return 'status-failed'
        default:
            return 'status-default'
    }
}

// 保存
const handleSave = () => {
    uni.showToast({
        title: '保存成功',
        icon: 'success'
    })
}

// 退出登录
const handleLogout = () => {
    uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        confirmText: '退出',
        cancelText: '取消',
        confirmColor: '#ff4444',
        success: (res) => {
            if (res.confirm) {
                // 用户确认退出
                userStore.logout()
            }
        }
    })
}
</script>

<style scoped lang="scss">
.container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
        flex-shrink: 0;
        background-color: #ffffff;

        .nav-bar {
            display: flex;
            align-items: center;
            padding: 0 32rpx;
            height: 88rpx;

            .back-icon {
                width: 44rpx;
                height: 44rpx;
            }

            .title {
                flex: 1;
                text-align: center;
                font-size: 17px;
                font-weight: 500;
                color: #333333;
            }

            .right-icons {
                display: flex;
                gap: 20rpx;

                .more-icon,
                .circle-icon {
                    width: 44rpx;
                    height: 44rpx;
                }
            }
        }
    }

    .content {
        flex: 1;
        overflow: auto;
        padding-bottom: 180rpx;
        /* 为固定的保存按钮留出空间 */

        .avatar-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40rpx 0;
            background-color: #ffffff;

            .avatar-container {
                position: relative;
                width: 160rpx;
                height: 160rpx;
                margin-bottom: 16rpx;

                .avatar {
                    width: 100%;
                    height: 100%;
                    border-radius: 80rpx;
                }

                .avatar-default {
                    background-color: rgba(7, 193, 96, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .avatar-text {
                        font-size: 48rpx;
                        font-weight: 500;
                        color: #fff;
                    }
                }

                .avatar-edit-overlay {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 48rpx;
                    height: 48rpx;
                    background-color: rgba(0, 0, 0, 0.6);
                    border-radius: 24rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 4rpx solid #fff;
                }
            }

            .change-avatar-text {
                font-size: 14px;
                color: #999999;
            }
        }

        .info-section {
            margin-top: 20rpx;
            background-color: #ffffff;
            padding: 0 32rpx;

            .section-title {
                font-size: 14px;
                color: #333333;
                padding: 24rpx 0;
                display: block;
            }

            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 32rpx 0;
                border-bottom: 1px solid #f5f5f5;

                &:last-child {
                    border-bottom: none;
                }

                .label {
                    font-size: 16px;
                    color: #333333;
                }

                .value-container {
                    display: flex;
                    align-items: center;
                    gap: 8rpx;

                    .value {
                        font-size: 16px;
                        color: #666666;
                    }

                    .arrow-right {
                        width: 32rpx;
                        height: 32rpx;
                    }
                }

                .value {
                    font-size: 16px;
                    color: #666666;

                    &.status-success {
                        color: #07c160;
                    }

                    &.status-pending {
                        color: #ff9500;
                    }

                    &.status-failed {
                        color: #ff4444;
                    }

                    &.status-default {
                        color: #666666;
                    }
                }
            }
        }
    }

    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        flex-shrink: 0;
        padding: 40rpx 32rpx 60rpx;
        background-color: #ffffff;
        box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
        z-index: 999;

        .logout-btn {
            width: 100%;
            height: 88rpx;
            line-height: 88rpx;
            background: linear-gradient(135deg, #ff4444 0%, #cc3333 100%);
            color: #ffffff;
            font-size: 16px;
            border-radius: 44rpx;
            box-shadow: 0 8rpx 20rpx rgba(255, 68, 68, 0.3);
            border: none;

            &::after {
                border: none;
            }

            &:active {
                transform: scale(0.98);
                transition: transform 0.1s;
            }
        }
    }
}
</style>