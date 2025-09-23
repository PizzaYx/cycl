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
                    <view class="number">{{ yyNum }}kg</view>
                    <view class="label">已收运总量</view>
                </view>
                <view class="stat-item">
                    <view class="number">{{ syNum }}</view>
                    <view class="label">未收运</view>
                </view>
                <view class="stat-item">
                    <view class="number">{{ dqNum }}</view>
                    <view class="label">已收运</view>
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
                <text class="more" @tap="goToSydAllList">更多 》</text>

            </view>
            <view class="records">
                <view class="order-list" v-if="allOrderList.length > 0">
                    <view class="order-item" v-for="(item, index) in allOrderList" :key="index">
                        <view class="order-header">
                            <view class="shop-info">
                                <text class="shop-name">{{ item.merchantName }}</text>
                                <text class="status-tag" :class="getStatusClass(item.status)">
                                    {{ getStatusText(item.status) }}
                                </text>
                            </view>
                        </view>
                        <view class="order-content">
                            <view class="info-item">
                                <text class="label">预估时间:</text>
                                <text class="value">{{ item.appointmentTime ?? '暂无' }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">收运时间:</text>
                                <text class="value">{{ item.arrivalTime ?? '暂无' }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">预估重量:</text>
                                <text class="value">{{ item.estimateWeight ? (item.estimateWeight + 'kg') : '暂无'
                                    }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">收运重量:</text>
                                <text class="value">{{ item.weight ? (item.weight + 'kg') : '暂无' }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">预估桶数:</text>
                                <text class="value">{{ item.estimateBucketNum ? (item.estimateBucketNum + '个') : '暂无'
                                    }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">收运桶数:</text>
                                <text class="value">{{ item.bucketNum ? (item.bucketNum + '个') : '暂无' }} </text>
                            </view>
                            <view class="info-item">
                                <text class="label">地址:</text>
                                <text class="value">{{ item.address ?? '暂无' }} </text>
                            </view>

                        </view>
                        <view class="order-footer">
                            <template v-if="item.status == 0 || item.status == '0'">
                                <uni-button size="mini" type="default" class="cancel-btn" @tap="handleCancel(item)">
                                    取消
                                </uni-button>
                                <uni-button size="mini" type="primary" class="report-btn"
                                    @tap="handleConfirmTransport(item)">
                                    收运上报
                                </uni-button>
                            </template>
                            <template v-else>
                                <uni-button size="mini" type="default" class="view-btn" @tap="handleViewDetails(item)">
                                    查看详情
                                </uni-button>
                            </template>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { apiGetDriverTodayStatistics, apiGetDriverPlanPage, apiGetdriverConfirmPlan, apiGetnoNeedCollect } from '@/api/apis.js'
import { onShow } from '@dcloudio/uni-app' // 导入onShow生命周期

// 使用用户 store
const userStore = useUserStore()

const yyNum = ref(0) // 已收运总量
const syNum = ref(0) // 未收运
const dqNum = ref(0) // 已收运

const allOrderList = ref([]); // 收运明细列表

// 下拉刷新状态
const refreshing = ref(false)

// 页面加载时确保用户信息存在
onMounted(async () => {
    try {
        const userInfo = await userStore.ensureUserInfo()

        if (userInfo === null) {
            // 用户未登录，已跳转到登录页，不需要继续执行
            console.log('用户未登录，已跳转到登录页')
            return
        }

        getMerchantStatistics()
        getMerchantSydList()
    } catch (error) {
        // 其他非401错误的处理
        console.error('页面初始化失败:', error)
    }
})

onShow(async () => {
    console.log('页面显示时刷新数据')
    getMerchantStatistics();
    getMerchantSydList();
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

// 状态转换函数
const getStatusText = (status) => {
    switch (status) {
        case 0:
        case '0':
            return '进行中';
        case 1:
        case '1':
            return '已完成';
        case 2:
        case '2':
            return '无法收运';
        default:
            return '无法收运';
    }
};

// 获取状态样式类名
const getStatusClass = (status) => {
    switch (status) {
        case 0: return 'processing';
        case 1: return 'completed';
        case 2: return 'cancelled';
    }
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


// 按钮点击事件处理函数
const handleCancel = (item) => {
    console.log('取消任务:', item);
    uni.showModal({
        title: '确认取消',
        content: '是否确认取消当前任务？',
        success: async (res) => {
            if (res.confirm) {
                await apiGetnoNeedCollect({
                    id: item.id,
                    driverId: userStore.sfmerchant?.id
                }).then((res) => {
                    if (res.code === 200) {
                        uni.showToast({
                            title: res.msg || '操作成功',
                            icon: 'success'
                        });
                        // 刷新任务列表
                        clearSearch();
                    } else {
                        uni.showToast({
                            title: res.msg || '操作失败',
                            icon: 'error'
                        });
                    }

                })
            }
        }
    })

};

const handleViewDetails = (item) => {
    console.log('查看详情按钮被点击', item);
    // 这里添加查看任务的逻辑
    uni.navigateTo({
        url: `/pages/collection/syCheckDetail?planId=${item.id}&driverId=${item.driverId}`
    });

};

const handleConfirmTransport = async (task) => {
    console.log('收运上报:', task);

    uni.navigateTo({
        url: `/pages/collection/syReport?carId=${task.carId}&driverId=${task.driverId}&merchantId=${task.merchantId}&planId=${task.id}&merchantName=${task.merchantName}`
    });
};


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






// 跳转到收运明细页面
const goToSydAllList = () => {
    uni.navigateTo({
        url: '/pages/collection/sfsyRecord'
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
        margin-top: 20rpx;
        ;

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
            gap: 4rpx;
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

                        .status-tag {
                            font-size: 24rpx;
                            width: 120rpx;
                            height: 40rpx;
                            border-radius: 8rpx;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            text-align: center;


                            &.processing {
                                //进行中 待完成
                                color: rgba(0, 170, 255, 1);
                                background: rgba(0, 170, 255, 0.10);
                            }

                            &.completed {
                                //已完成
                                color: rgba(61, 61, 61, 0.50);
                                background: rgba(153, 153, 153, 0.1);
                            }

                            &.cancelled {
                                //无法收运
                                color: rgba(255, 161, 0, 1);
                                background: rgba(255, 161, 0, 0.10);

                            }
                        }
                    }
                }

                .order-content {
                    padding: 20rpx 0;
                    border-top: 1px solid #f0f0f0;
                    border-bottom: 1px solid #f0f0f0;

                    .info-item {
                        display: flex;
                        margin-bottom: 16rpx;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        .label {
                            font-size: 26rpx;
                            color: rgba(61, 61, 61, 0.50);
                        }

                        .value {
                            margin-left: 30rpx;
                            font-size: 26rpx;
                            color: rgba(61, 61, 61, 1);
                        }
                    }
                }

                .order-footer {
                    margin-top: 30rpx;
                    display: flex;
                    justify-content: flex-end;
                    gap: 15rpx;
                    flex-wrap: wrap; // 允许换行以适应4个按钮

                    .cancel-btn,
                    .view-btn,
                    .report-btn {
                        width: 120rpx; // 减小按钮宽度以适应4个按钮
                        height: 48rpx;
                        color: #07C160;
                        border-radius: 100rpx;
                        border: 2rpx solid #07C160;
                        font-size: 24rpx; // 稍微减小字体
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }


                    .cancel-btn {
                        border: 1rpx solid rgba(196, 196, 196, 1);
                        color: rgba(61, 61, 61, 1);
                    }

                    .report-btn {
                        background-color: #FFA500;
                        border-color: #FFA500;
                        color: white;
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