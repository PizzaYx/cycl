<!-- 商户端首页 -->
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
                    <view class="name">{{ userStore.nickName || '昵称未设置' }}</view>
                    <!-- <view class="sub-name">{{ userStore.userName || '账号未设置' }}</view> -->
                    <view class="auth-tag" :class="getAuthTagClass()">{{ getAuthStatusText() }}</view>
                </view>
                <uni-icons type="right" size="35rpx"></uni-icons>
            </view>

            <!-- 数据统计 -->
            <view class="statistics">
                <view class="stat-item">
                    <view class="number">{{ yyNum }}</view>
                    <view class="label">预约中</view>
                </view>
                <view class="stat-item">
                    <view class="number">{{ syNum }}</view>
                    <view class="label">收运中</view>
                </view>
                <view class="stat-item">
                    <view class="number">{{ wcNum }}</view>
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
                <view class="more" @tap="goToSydAllList">
                    <text>更多</text>
                    <uni-icons type="right" size="16" color="rgba(19, 19, 19, 0.50)"></uni-icons>
                </view>
            </view>
            <view class="records">
                <view class="record-list">
                    <view v-for="(item, index) in records" :key="item.id" class="record-item" @tap="showDetail(item)">
                        <view class="record-main">
                            <view class="shop-name">{{ item.merchantName }}</view>
                            <view class="record-time">{{ item.status === 1 ? item.arrivalTime : item.appointmentTime }}
                            </view>
                        </view>
                        <view class="record-right">
                            <StatusTag :status="item.status" />
                            <view class="weight">{{ formatWeight(item.weight) }}</view>
                        </view>
                    </view>
                    <view v-if="records.length === 0" class="no-records">暂无收运记录</view>
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
import { apiGetMerchantStatistics, apiGetPlanAllPage, apiGetMerchantNotConfirmNum } from '@/api/apis.js'
import { onShow } from '@dcloudio/uni-app' // 导入onShow生命周期
import StatusTag from '@/components/StatusTag/StatusTag.vue'
import { formatWeight, formatNum } from '@/utils/orderUtils'

// 使用用户 store
const userStore = useUserStore()

const yyNum = ref(0) // 预约中
const syNum = ref(0) // 收运中
const wcNum = ref(0) // 已完成

// 待确认数量（用于badge显示）
// const processingBadgeText = ref(0)

// 下拉刷新状态
const refreshing = ref(false)

// 认证弹窗状态
const showAuthModal = ref(false)

// 页面加载时确保用户信息存在
// onMounted(async () => {
//     try {
//         const userInfo = await userStore.ensureUserInfo()
//         if (userInfo === null) {
//             // 用户未登录，已跳转到登录页，不需要继续执行
//             console.log('用户未登录，已跳转到登录页')
//             return
//         }

//         // 检查认证状态，只有未认证（status为null或2）才显示弹窗
//         checkUserAuthStatus()
//     } catch (error) {
//         // 其他非401错误的处理
//         console.error('页面初始化失败:', error)
//     }
// })

onShow(async () => {
    // 确保用户信息已加载完成
    const userInfo = await userStore.ensureUserInfo()
    if (userInfo === null) {
        console.log('用户未登录，已跳转到登录页')
        return
    }
    if (checkUserAuthStatus()) {
        // getMerchantNotConfirmNum();
        getMerchantStatistics();
        getMerchantSydList();
    }
})

const showDetail = (item) => {
    console.log('查看详情按钮被点击', item);
    uni.navigateTo({
        url: `/pages/merchant/shsyDetail?id=${item.id}&merchantId =${item.merchantId}`
    });
}

//获取商户首页数据统计
const getMerchantStatistics = async () => {
    console.log('获取商户首页数据统计')
    const res = await apiGetMerchantStatistics({
        merchantId: userStore.merchant?.id
    })
    if (res.code === 200) {
        wcNum.value = res.data.accomplishNum;
        yyNum.value = res.data.reservationNum;
        syNum.value = res.data.underwayNum;
    }
}


//获取商户首页收运记录显示前5条
const getMerchantSydList = async () => {
    const res = await apiGetPlanAllPage({
        pageNum: 1,
        pageSize: 5,
        merchantId: userStore.merchant?.id
    })
    if (res.code === 200) {
        records.value = res.data.list;
        //0 待确认 1 已完成 2无需收运
    } else {
        console.error('商户首页收运记录失败', res.message)
    }
}

// 获取待确认数量（用于badge显示）
// const getMerchantNotConfirmNum = async () => {
//     const res = await apiGetMerchantNotConfirmNum({
//         merchantId: userStore.merchant?.id
//     });
//     if (res.code === 200) {
//         processingBadgeText.value = res.data ?? 0;
//     }
// };

/**
 * 检查用户认证状态并显示相应提示
 * @returns {boolean} true表示已认证，false表示未认证或审核不通过
 */
const checkUserAuthStatus = () => {
    const merchantStatus = userStore.merchantStatus;

    // 未认证或审核不通过，显示认证弹窗
    if (merchantStatus === null || merchantStatus === 2) {
        userStore.fetchUserInfo();
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
        showAuthModal.value = false;
        getMerchantStatistics();
        getMerchantSydList();
        return true
    }
}

const getUserInfo = () => {
    // 已认证，跳转到用户页面
    uni.navigateTo({
        url: '/pages/user/user'
    })
}

// 下拉刷新处理
const onRefresh = async () => {
    refreshing.value = true
    try {
        // 重新获取用户信息
        await userStore.fetchUserInfo()

        // 检查认证状态，只有未认证（status为null或2）才显示弹窗
        if (checkUserAuthStatus()) {
            // getMerchantNotConfirmNum();
            getMerchantStatistics();
            getMerchantSydList();
        }
    } catch (error) {
        console.error('刷新失败:', error)
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
        url: '/pages/merchant/shCertification'
    })
}

// 快捷操作配置
const quickActions = ref([
    {
        id: 'appointment',
        name: '临时预约',
        icon: '/static/shd/lsyy.png',
        url: '/pages/merchant/shReservation' // 临时预约页面
    },
    {
        id: 'records',
        name: '收运清单',
        icon: '/static/shd/syjl.png',
        url: '/pages/merchant/shChecklist' // 收运清单页面
    },
    {
        id: 'statistics',
        name: '数据统计',
        icon: '/static/shd/sjtj.png',
        url: '/pages/merchant/shStatistics' // 数据统计页面
    },
    {
        id: 'certification',
        name: '商户认证',
        icon: '/static/shd/shrz.png',
        url: '/pages/merchant/shCertification' // 商户认证页面
    },
    {
        id: 'certification',
        name: '合同续签',
        icon: '/static/shd/htxq.png',
        url: '/pages/syContract/syContract' // 商户认证页面
    }
])

// 统一的快捷操作跳转处理
const handleQuickAction = (action) => {
    console.log('快捷操作点击:', action)

    // 如果是商户认证操作，直接跳转无需检查认证状态
    if (action.name === '商户认证') {
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
        }
        return
    }

    // 检查用户认证状态
    if (!(checkUserAuthStatus())) {
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



const records = ref([]); // 收运记录列表


// 跳转到收运总列表页面
const goToSydAllList = () => {
    // 检查用户认证状态
    if (!(checkUserAuthStatus())) {
        // 未通过认证检查，不继续执行
        return
    }

    uni.navigateTo({
        url: '/pages/merchant/shAllList'
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
        align-items: center;

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
                line-height: 40rpx;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                line-clamp: 2;
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
            gap: 2rpx;

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
            font-size: 26rpx;
            font-weight: 400;
            color: rgba(19, 19, 19, 0.50);
            display: flex;
            align-items: center;
            gap: 8rpx;

            text {
                line-height: 1.2;
                display: flex;
                align-items: center;
            }


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
                align-items: stretch;
                height: 138rpx;
                margin-bottom: 22rpx;
                background-color: #fff;
                border-radius: 16rpx;
                padding: 20rpx 30rpx;


                .record-main {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .shop-name {
                        font-size: 26rpx;
                        color: rgba(19, 19, 19, 1);
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .record-time {
                        font-size: 24rpx;
                        color: rgba(61, 61, 61, 0.50);
                    }
                }

                .record-right {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    text-align: center;

                    .weight {
                        font-size: 32rpx;
                        font-weight: 400;
                        color: rgba(61, 61, 61, 1);
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