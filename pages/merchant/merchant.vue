<!-- 收运端首页 -->
<template>
    <view class="layout">
        <scroll-view scroll-y refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onRefresh"
            class="scroll-view">
            <view class="headImage">
                <image src="/static/headTopBg.png" mode="aspectFill"></image>
            </view>

            <view class="header" @tap="getUserInfo">
                <view class="avatar">
                    <view class="avatar-text">{{ userStore.userAvatar }}</view>
                </view>
                <view class="info">
                    <view class="name">{{ userStore.nickName || '未登录' }}</view>
                    <view class="sub-name">{{ userStore.userName || '未设置用户名' }}</view>
                    <view class="auth-tag" :class="getAuthTagClass()">{{ getAuthStatusText() }}</view>
                </view>
                <uni-icons type="right" size="30rpx"></uni-icons>

            </view>



            <!-- 数据统计 -->
            <view class="statistics">
                <view class="stat-item">
                    <view class="number">4</view>
                    <view class="label">预约中</view>
                </view>
                <view class="stat-item">
                    <view class="number">45</view>
                    <view class="label">收运中</view>
                </view>
                <view class="stat-item">
                    <view class="number">6</view>
                    <view class="label">待确认</view>
                </view>
                <view class="stat-item">
                    <view class="number">451</view>
                    <view class="label">已完成</view>
                </view>
            </view>

            <!-- 快捷操作 -->
            <view class="section-title">快捷操作</view>
            <view class="quick-actions">
                <view v-for="(action, index) in quickActions" :key="action.id" class="action-item"
                    @tap="handleQuickAction(action)">
                    <image :src="action.icon" mode="aspectFill"></image>
                    <text>{{ action.name }}</text>
                </view>
            </view>

            <!-- 收运记录 -->
            <view class="records-header">
                <text class="title">收运记录</text>
                <text class="more" @tap="goToSydAllList">更多 》 </text>
            </view>
            <view class="records">
                <view class="record-list">
                    <view v-for="(item, index) in records" :key="index" class="record-item">
                        <view class="record-main">
                            <view class="shop-name">{{ item.name }}</view>
                            <view class="record-time">{{ item.time }}</view>
                        </view>
                        <view class="record-right">
                            <view class="status">{{ item.status }}</view>
                            <view class="weight">{{ item.weight }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 认证弹窗 -->
        <view v-if="showAuthModal" class="auth-modal" @tap="closeModal">
            <view class="auth-modal-content" @tap.stop>
                <view class="auth-modal-bg">
                    <image src="/static/shd/rzbg.png" mode="aspectFill"></image>
                </view>
                <view class="auth-modal-body">
                    <view class="auth-icon">
                        <image src="/static/shd/rz1.png" mode="aspectFit"></image>
                    </view>
                    <view class="auth-title">请完成商户认证</view>
                    <view class="auth-desc">请上传资料，完成商户认证</view>
                    <view class="auth-button" @tap="handleAuth">立即认证</view>
                </view>
                <view class="close-btn" @tap="closeModal">
                    <text class="close-icon">×</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'

// 使用用户 store
const userStore = useUserStore()

// 下拉刷新状态
const refreshing = ref(false)

// 认证弹窗状态
const showAuthModal = ref(false)

// 页面加载时确保用户信息存在
onMounted(async () => {
    try {
        await userStore.ensureUserInfo()
        console.log('用户信息加载完成')

        // 检查认证状态，只有未认证（status为null或2）才显示弹窗
        checkAndShowAuthModal()
    } catch (error) {
        // request.js已经处理了401跳转，这里只需要记录错误
        console.error('页面初始化失败:', error)
    }
})

/**
 * 检查用户认证状态并显示相应提示
 * @returns {boolean} true表示已认证，false表示未认证或审核不通过
 */
const checkUserAuthStatus = () => {
    const merchantStatus = userStore.merchantStatus
    // 未认证或审核不通过，显示认证弹窗
    if (merchantStatus === null || merchantStatus === 2) {
        showAuthModal.value = true
        return false
    }
    // 审核中状态，显示提示
    else if (merchantStatus === 0) {
        uni.showToast({
            title: '认证审核中，请耐心等待',
            icon: 'none'
        })
        return false
    }
    // 已认证
    else {
        return true
    }
}

/**
 * 检查认证状态并在需要时显示认证弹窗
 * 用于页面加载时检查
 */
const checkAndShowAuthModal = () => {
    const merchantStatus = userStore.merchantStatus
    if (merchantStatus === null || merchantStatus === 2) {
        showAuthModal.value = true
    }
}

const getUserInfo = () => {
    // 检查用户认证状态并执行相应操作
    if (checkUserAuthStatus()) {
        // 已认证，跳转到用户页面
        uni.navigateTo({
            url: '/pages/user/user'
        })
    }
}

// 下拉刷新处理
const onRefresh = async () => {
    refreshing.value = true
    try {
        // 重新获取用户信息
        await userStore.fetchUserInfo()
        console.log('刷新完成')

        // 检查认证状态，只有未认证（status为null或2）才显示弹窗
        checkAndShowAuthModal()
    } catch (error) {
        console.error('刷新失败:', error)
        uni.showToast({
            title: '刷新失败',
            icon: 'none'
        })
    } finally {
        refreshing.value = false
    }
}

// 关闭认证弹窗
const closeModal = () => {
    showAuthModal.value = false
}

// 立即认证处理
const handleAuth = () => {
    showAuthModal.value = false

    uni.navigateTo({
        url: '/pages/merchant/certification'
    })
}

// 快捷操作配置
const quickActions = ref([
    {
        id: 'appointment',
        name: '临时预约',
        icon: '/static/shd/lsyy.png',
        url: '/pages/merchant/sydReservation' // 临时预约页面
    },
    {
        id: 'records',
        name: '收运清单',
        icon: '/static/shd/syjl.png',
        url: '/pages/merchant/sydChecklist' // 收运清单页面
    },
    {
        id: 'statistics',
        name: '数据统计',
        icon: '/static/shd/sjtj.png',
        url: '/pages/merchant/sydStatistics' // 数据统计页面
    },
    {
        id: 'certification',
        name: '商户认证',
        icon: '/static/shd/shrz.png',
        url: '/pages/merchant/certification' // 商户认证页面
    }
])

// 统一的快捷操作跳转处理
const handleQuickAction = (action) => {
    console.log('快捷操作点击:', action.name)
    // 检查用户认证状态
    if (!checkUserAuthStatus()) {
        // 未通过认证检查，不继续执行
        return
    }
    // 检查页面是否存在（可以根据实际情况调整）
    if (action.url) {
        uni.navigateTo({
            url: action.url,
            fail: (err) => {
                console.error('页面跳转失败:', err)
                uni.showToast({
                    title: '页面暂未开放',
                    icon: 'none'
                })
            }
        })
    } else {
        uni.showToast({
            title: '功能开发中',
            icon: 'none'
        })
    }
}

// 获取认证状态文本
const getAuthStatusText = () => {
    const status = userStore.merchantStatus
    switch (status) {
        case 0:
            return '认证中'
        case 1:
            return '已认证'
        case 2:
            return '未认证'
        default:
            return '未认证'
    }
}

// 获取认证状态样式类
const getAuthTagClass = () => {
    const status = userStore.merchantStatus
    switch (status) {
        case 0:
            return 'auth-pending'
        case 1:
            return 'auth-approved'
        case 2:
            return 'auth-rejected'
        default:
            return 'auth-none'
    }
}

const records = ref([
    {
        name: '川味小厨（总店）',
        time: '2023-08-20 14:05:30',
        weight: '1.56kg',
        status: '待确定',
    },
    {
        name: '川味小厨（总店）',
        time: '2023-08-20 14:05:30',
        weight: '1.56kg',
        status: '已完成',
    },
    {
        name: '川味小厨（总店）',
        time: '2023-08-20 14:05:30',
        weight: '1.56kg',
        status: '已完成',
    },
    {
        name: '川味小厨（总店）',
        time: '2023-08-20 14:05:30',
        weight: '1.56kg',
        status: '已完成',
    },
    {
        name: '川味小厨（总店）',
        time: '2023-08-20 14:05:30',
        weight: '1.56kg',
        status: '已完成',
    },
    {
        name: '川味小厨（总店）',
        time: '2023-08-20 14:05:30',
        weight: '1.56kg',
        status: '已完成',
    },
    {
        name: '川味小厨（总店）',
        time: '2023-08-20 14:05:30',
        weight: '1.56kg',
        status: '已完成',
    },
])

// 跳转到收运总列表页面
const goToSydAllList = () => {
    // 检查用户认证状态
    if (!checkUserAuthStatus()) {
        // 未通过认证检查，不继续执行
        return
    }
    
    uni.navigateTo({
        url: '/pages/merchant/sydAllList'
    })
}
</script>

<style lang="scss" scoped>
.layout {
    position: relative;
    min-height: 100vh;
    background-color: $bg-theme-color;

    .scroll-view {
        height: 100vh;
    }

    .headImage {
        position: absolute;
        /* 绝对定位 */
        top: 0;
        left: 0;
        z-index: 0;
        /* 置于其他元素下方 */
        width: 100%;
        height: 442rpx;
        overflow: hidden;

        /* 防止内容溢出 */
        image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .header {
        position: relative;
        padding: 214rpx 30rpx 26rpx;
        width: 100%;
        display: flex;

        .avatar {
            width: 120rpx;
            height: 120rpx;
            margin-right: 24rpx;
            background-color: rgba(7, 193, 96, 1);
            border-radius: 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            .avatar-text {
                font-size: 48rpx;
                font-weight: 500;
                color: #fff;
            }

            image {
                width: 100%;
                height: 100%;
                border-radius: 60rpx;
            }
        }

        .info {
            flex: 1;
            /* 占满剩余宽度 */
            height: 120rpx;
            /* 或 min-height: 120rpx; 与头像同高 */
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .name {
                font-weight: 600;
                font-size: 32rpx;
                color: black;
                line-height: 32rpx;
            }

            .sub-name {
                font-weight: 400;
                font-size: 24rpx;
                color: #131313;
            }

            .auth-tag {
                width: 120rpx;
                height: 40rpx;
                color: #fff;
                font-size: 22rpx;
                border-radius: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;

                // 不同认证状态的样式
                &.auth-approved {
                    background-color: rgba(7, 193, 96, 1); // 绿色 - 已认证
                }

                &.auth-pending {
                    background-color: rgba(255, 149, 0, 1); // 橙色 - 认证中
                }

                &.auth-rejected,
                &.auth-none {
                    background-color: rgba(255, 68, 68, 1); // 红色 - 未认证
                }
            }
        }
    }

    .statistics {
        position: relative;
        height: 128rpx;
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        border-radius: 20rpx;
        margin: 0 30rpx 30rpx;
        align-items: center;
        padding: 0 28rpx;

        .stat-item {
            position: relative;
            /* 关键：为伪元素提供定位上下文 */
            height: 100%;
            /* 关键：子项高度等于父容器高度 128rpx */
            flex: 1;
            /* 等宽（可选） */
            display: flex;
            /* 让内部内容垂直居中 */
            flex-direction: column;
            justify-content: center;
            /* 垂直居中内容 */
            text-align: center;
            padding: 0 20rpx;

            .number {
                font-size: 32rpx;
                font-weight: 500;
                color: rgba(61, 61, 61, 1);
                margin-bottom: 8rpx;
            }

            .label {
                font-size: 24rpx;
                color: rgba(61, 61, 61, 1);
            }

            &:not(:first-child)::before {
                content: '';
                position: absolute;
                left: 0;
                top: 30rpx;
                bottom: 30rpx;
                width: 2rpx;
                background: rgba(216, 216, 216, 1);
                transform: scaleX(0.5);
                transform-origin: left center;
            }
        }
    }

    .section-title {
        padding: 10rpx 30rpx;
        font-size: 28rpx;
        font-weight: 400;
        margin-bottom: 10rpx;
    }

    .quick-actions {
        position: relative;
        background-color: #fff;
        border-radius: 16rpx;
        height: 168rpx;
        padding: 18rpx 20rpx;
        margin: 0 30rpx 30rpx 30rpx;
        display: flex;
        // justify-content: space-around;
        align-items: center;

        .action-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16rpx;

            image {
                width: 96rpx;
                height: 96rpx;
                border-radius: 16rpx;
            }

            text {
                font-size: 26rpx;
                color: rgba(61, 61, 61, 1);
                text-align: center;
            }
        }
    }

    .records-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10rpx 30rpx;
        margin-bottom: 10rpx;

        .title {
            font-size: 28rpx;
            font-weight: 400;
            color: rgba(19, 19, 19, 1);
        }

        .more {
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(19, 19, 19, 0.50);
        }
    }

    .records {
        position: relative;
        z-index: 1;
        background-color: $bg-theme-color;
        border-radius: 16rpx;
        margin: 0 30rpx 30rpx 30rpx;

        .record-list {
            .record-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 138rpx;
                margin-bottom: 22rpx;
                background-color: #fff;
                border-radius: 16rpx;
                padding: 0 30rpx 0 30rpx;


                .record-main {
                    .shop-name {
                        font-size: 26rpx;
                        color: rgba(19, 19, 19, 1);
                        margin-bottom: 8rpx;
                    }

                    .record-time {
                        font-size: 24rpx;
                        color: rgba(61, 61, 61, 0.50);
                    }
                }

                .record-right {
                    text-align: right;

                    .weight {
                        font-size: 32rpx;
                        font-weight: 400;
                        color: rgba(61, 61, 61, 1);
                        margin-bottom: 8rpx;
                    }

                    .status {
                        font-size: 24rpx;
                        border-radius: 8rpx;
                        width: 96rpx;
                        height: 40rpx;
                    }

                    .status-pending {
                        color: #ff9900;
                        background-color: rgba(255, 153, 0, 0.1);
                    }

                    .status-completed {
                        color: #4cd964;
                        background-color: rgba(76, 217, 100, 0.1);
                    }

                    .status-default {
                        color: #666;
                        background-color: rgba(102, 102, 102, 0.1);
                    }
                }
            }

            .no-records {
                text-align: center;
                color: #999;
                padding: 40rpx 0;
            }
        }
    }

    // 认证弹窗样式
    .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;

        .auth-modal-content {
            position: relative;
            width: 600rpx;
            height: 700rpx;
            border-radius: 24rpx;
            overflow: hidden;

            .auth-modal-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 634rpx;
                height: 608rpx;
                z-index: 1;

                image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .auth-modal-body {
                position: relative;
                z-index: 2;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: start;

                .auth-icon {
                    width: 296rpx;
                    height: 298rpx;
                    margin: 25rpx 0;

                    image {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }

                .auth-title {
                    font-size: 34rpx;
                    font-weight: 500;
                    color: rgba(61, 61, 61, 1);
                    margin-bottom: 25rpx;
                    text-align: center;
                }

                .auth-desc {
                    font-size: 28rpx;
                    color: rgba(61, 61, 61, 0.50);
                    text-align: center;
                    margin-bottom: 35rpx;
                }

                .auth-button {
                    width: 322rpx;
                    height: 80rpx;
                    background: linear-gradient(135deg, #07C160 0%, #05A64F 100%);
                    border-radius: 40rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 32rpx;
                    box-shadow: 0 8rpx 20rpx rgba(7, 193, 96, 0.3);

                    &:active {
                        transform: scale(0.95);
                        transition: transform 0.1s;
                    }
                }
            }

            .close-btn {
                position: absolute;
                bottom: 0rpx;
                left: 50%;
                transform: translateX(-50%);
                width: 60rpx;
                height: 60rpx;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 30rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3;

                .close-icon {
                    font-size: 40rpx;
                    color: #999;
                    line-height: 1;
                }

                &:active {
                    background-color: rgba(255, 255, 255, 0.7);
                }
            }
        }
    }
}
</style>