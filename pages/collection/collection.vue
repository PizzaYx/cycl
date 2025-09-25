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
                    <view class="avatar-text">{{ userStore.userSFAvatar }}</view>
                </view>
                <view class="info">
                    <view class="name">{{ userStore.nickName || '未登录' }}</view>
                    <view class="sub-name">{{ userStore.sfmerchant?.registrationNumber || '未设置车牌' }}</view>
                    <view class="auth-tag">工作中</view>
                </view>
                <uni-icons type="right" size="30rpx"></uni-icons>
            </view>


            <!-- 数据统计 -->
            <view class="statistics">
                <view class="stat-item">
                    <view class="number">{{ syNum }} 个</view>
                    <view class="label">未收运商家</view>
                </view>
                <view class="stat-item">
                    <view class="number green">{{ yyNum }}kg</view>
                    <view class="label">已收运总量</view>
                </view>
                <view class="stat-item">
                    <view class="number">{{ dqNum }} 个</view>
                    <view class="label">已收运商家</view>
                </view>
                <!-- 上半圆弧形进度条 -->
                <view class="progress-arc">
                    <canvas canvas-id="progressArc" class="arc-canvas"></canvas>
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
                <text class="title">收运明细</text>
                <view class="more" @tap="goToSydAllList">
                    <text>更多</text>
                    <uni-icons type="right" size="16" color="rgba(19, 19, 19, 0.50)"></uni-icons>
                </view>

            </view>
            <view class="records">
                <view class="order-list" v-if="allOrderList.length > 0">
                    <view class="order-item" v-for="(item, index) in allOrderList" :key="index">
                        <view class="order-header">
                            <view class="shop-info">
                                <text class="shop-name">{{ item.merchantName }}</text>
                                <DriverStatusTag :status="item.status" />
                            </view>
                        </view>
                        <view class="order-content">
                            <InfoDisplay :fields="getInfoFields(item)" />
                        </view>
                        <DriverOrderActions :status="item.status" :order-data="item" @refresh="handleRefresh"
                            @abnormalReport="handleAbnormalReport" />
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 异常上报弹窗 -->
        <AbnormalReportModal :show="showAbnormalModal" :order-data="currentOrderData" @close="closeAbnormalModal"
            @success="handleAbnormalSuccess" />
    </view>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { apiGetDriverTodayStatistics, apiGetDriverPlanPage, apiGetdriverConfirmPlan, apiGetnoNeedCollect } from '@/api/apis.js'
import { onShow } from '@dcloudio/uni-app' // 导入onShow生命周期
import InfoDisplay from '@/components/InfoDisplay/InfoDisplay.vue'
import DriverStatusTag from '@/components/DriverStatusTag/DriverStatusTag.vue'
import DriverOrderActions from '@/components/DriverOrderActions/DriverOrderActions.vue'
import AbnormalReportModal from '@/components/AbnormalReportModal/AbnormalReportModal.vue'


// 使用用户 store
const userStore = useUserStore()

const yyNum = ref(0) // 已收运总量
const syNum = ref(0) // 未收运
const dqNum = ref(0) // 已收运

// 计算进度百分比
const progressPercentage = computed(() => {

    const total = dqNum.value + syNum.value
    if (total === 0) return 0
    return Math.round((dqNum.value / total) * 100)
})

const allOrderList = ref([]); // 收运明细列表

// 下拉刷新状态
const refreshing = ref(false)

// 异常上报相关变量
const showAbnormalModal = ref(false)
const currentOrderData = ref(null)

// 监听进度百分比变化，自动重绘canvas
watch(progressPercentage, () => {
    nextTick(() => {
        drawProgressArc()
    })
}, { immediate: false })


onShow(async () => {
    console.log('页面显示时刷新数据')
    await getMerchantStatistics()
    await getMerchantSydList()
    // 数据加载完成后再绘制canvas，增加延迟确保DOM渲染完成
    setTimeout(() => {
        drawProgressArc()
    }, 300)
})

//获取商户首页数据统计
const getMerchantStatistics = async () => {
    const res = await apiGetDriverTodayStatistics({
        driverId: userStore.sfmerchant?.id
    })

    if (res.code === 200) {
        dqNum.value = res.data.confirmNum;
        yyNum.value = res.data.weightNum;
        syNum.value = res.data.notConfirmNum;
    }
}


// 根据状态获取信息字段
const getInfoFields = (item) => {
    const status = item.status;

    // 状态为 0（进行中）或 2（无法收运）时显示预估信息
    if (status === 0 || status === '0' || status === 2 || status === '2') {
        return [
            {
                key: 'appointmentTime',
                label: '预估时间',
                value: item.appointmentTime
            },
            {
                key: 'estimateWeight',
                label: '预估重量',
                value: item.estimateWeight
            },
            {
                key: 'estimateBucketNum',
                label: '预估桶数',
                value: item.estimateBucketNum
            }
        ];
    }

    // 状态为 1（已完成）时显示收运信息
    if (status === 1 || status === '1') {
        return [
            {
                key: 'arrivalTime',
                label: '收运时间',
                value: item.arrivalTime
            },
            {
                key: 'weight',
                label: '收运重量',
                value: item.weight
            },
            {
                key: 'bucketNum',
                label: '收运桶数',
                value: item.bucketNum
            }
        ];
    }

    // 默认返回预估信息
    return [
        {
            key: 'appointmentTime',
            label: '预估时间',
            value: item.appointmentTime
        },
        {
            key: 'estimateWeight',
            label: '预估重量',
            value: item.estimateWeight
        },
        {
            key: 'estimateBucketNum',
            label: '预估桶数',
            value: item.estimateBucketNum
        }
    ];
};


//获取收运端首页收运记录显示前5条
const getMerchantSydList = async () => {
    const res = await apiGetDriverPlanPage({
        pageNum: 1,
        pageSize: 5,
        driverId: userStore.sfmerchant?.id,
    })
    if (res.code === 200) {
        allOrderList.value = res.data.list;

    } else {
        console.error('收运端首页收运明细失败', res.msg)
    }
}

const getUserInfo = () => {
    // 检查用户认证状态并执行相应操作
    // 已认证，跳转到用户页面
    uni.navigateTo({
        url: '/pages/user/user'
    })

}


// 按钮点击事件处理函数已封装到 DriverOrderActions 组件中


// 快捷操作配置
const quickActions = ref([
    {
        id: 'appointment',
        name: '今日收运',
        icon: '/static/ssd/syleft.png',
        url: '/pages/collection/sfDetails' // 今日详情
    },
    {
        id: 'records',
        name: '工单统计',
        icon: '/static/ssd/sydright.png',
        url: '/pages/collection/syStatistics' // 统计页面
    },
])

// 统一的快捷操作跳转处理
const handleQuickAction = (action) => {
    console
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

// 下拉刷新处理
const onRefresh = async () => {
    refreshing.value = true
    try {
        // 重新获取用户信息
        await userStore.fetchUserInfo()
        await getMerchantStatistics()
        await getMerchantSydList()
        // 数据加载完成后再绘制canvas，增加延迟确保DOM渲染完成
        setTimeout(() => {
            drawProgressArc()
        }, 300)

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

// 处理异常上报后的刷新
const handleRefresh = async () => {
    try {
        // 重新获取统计数据
        await getMerchantStatistics()
        // 重新获取收运列表
        await getMerchantSydList()
        // 数据更新后重新绘制canvas
        setTimeout(() => {
            drawProgressArc()
        }, 300)
    } catch (error) {
        console.error('刷新数据失败:', error)
    }
}

// 处理异常上报事件
const handleAbnormalReport = (orderData) => {
    currentOrderData.value = orderData
    showAbnormalModal.value = true
}

// 关闭异常上报弹窗
const closeAbnormalModal = () => {
    showAbnormalModal.value = false
    currentOrderData.value = null
}

// 异常上报成功回调
const handleAbnormalSuccess = async () => {
    // 刷新数据
    await handleRefresh()
}


// 跳转到收运明细页面
const goToSydAllList = () => {
    uni.navigateTo({
        url: '/pages/collection/sfsyRecord'
    })
}

// 绘制进度弧形 - 微信小程序专用
const drawProgressArc = () => {


    const ctx = uni.createCanvasContext('progressArc')

    // 获取canvas尺寸
    const query = uni.createSelectorQuery()
    query.select('.arc-canvas').boundingClientRect((rect) => {

        if (rect) {
            const width = rect.width
            const height = rect.height

            const centerX = width / 2  // 圆心在中央
            const centerY = height * 0.75 // 圆心在canvas上方
            const radius = width / 4.8  // 半径调整，让弧形更合适

            // 绘制底色弧形（完整弧形）
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
            ctx.setStrokeStyle('rgba(7, 193, 96, 0.10)')
            ctx.setLineWidth(10)
            ctx.setLineCap('round')
            ctx.stroke()

            // 绘制进度弧形（根据百分比）
            const progressAngle = Math.PI * (progressPercentage.value / 100)


            if (progressPercentage.value > 0) {
                ctx.beginPath()
                ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + progressAngle, false)
                ctx.setStrokeStyle('rgba(7, 193, 96, 1)')
                ctx.setLineWidth(10)
                ctx.setLineCap('round')
                ctx.stroke()

                // 绘制进度弧形终点圆点
                const endAngle = Math.PI + progressAngle
                const endX = centerX + radius * Math.cos(endAngle)
                const endY = centerY + radius * Math.sin(endAngle)
                ctx.beginPath()
                ctx.arc(endX, endY, 10, 0, 2 * Math.PI, false)
                ctx.setFillStyle('rgba(7, 193, 96, 1)')
                ctx.fill()
            }

            ctx.draw()

        } else {
            console.error('无法获取Canvas尺寸')
        }
    }).exec()
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

                font-size: 22rpx;
                border-radius: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(7, 193, 96, 1); // 绿色 
                color: #fff;

            }
        }
    }

    .statistics {
        position: relative;
        height: 300rpx;
        display: flex;
        justify-content: space-around;
        background-color: #fff;
        border-radius: 20rpx;
        margin: 0 30rpx 30rpx;
        align-items: center;
        padding: 0 28rpx;
        gap: 80rpx;
        z-index: 1;

        .stat-item {
            position: relative;
            height: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            text-align: center;
            padding: 0 0rpx 65rpx;

            .number {
                font-size: 32rpx;
                font-weight: 500;
                color: rgba(61, 61, 61, 1);
                margin-bottom: 8rpx;

                &.green {
                    color: #07C160;
                }
            }

            .label {
                font-size: 24rpx;
                color: rgba(61, 61, 61, 1);
            }
        }

        .progress-arc {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 300rpx;
            pointer-events: none;
            z-index: 10;
            overflow: hidden;

            .arc-canvas {
                width: 100%;
                height: 100%;
                display: block;
                background: transparent;
            }
        }
    }

    .section-title {
        padding: 10rpx 30rpx;
        font-size: 28rpx;
        font-weight: 400;
        margin-bottom: 10rpx;
        color: rgba(19, 19, 19, 1);
    }

    .quick-actions {
        position: relative;
        height: 120rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 20rpx;

        .action-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            border-radius: 20rpx;

            width: 336rpx;
            height: 120rpx;
            background-color: #fff;

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
        margin-top: 10rpx;

        .title {
            font-size: 28rpx;
            font-weight: 400;
            color: rgba(19, 19, 19, 1);
        }

        .more {
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(19, 19, 19, 0.50);
            display: flex;
            align-items: center;

            text {
                line-height: 1;
            }


        }
    }

    .records {
        position: relative;
        z-index: 1;
        background-color: $bg-theme-color;
        border-radius: 16rpx;
        margin: 0 0 30rpx;

        .order-list {
            padding: 0 30rpx; // 左右30rpx

            .order-item {
                margin-bottom: 20rpx;
                padding: 30rpx;
                background-color: #ffffff;
                border-radius: 12rpx;

                .order-header {
                    margin-bottom: 20rpx;

                    .shop-info {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 16rpx;

                        .shop-name {
                            font-size: 28rpx;
                            font-weight: 400;
                            color: rgba(61, 61, 61, 1);
                        }

                    }
                }

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