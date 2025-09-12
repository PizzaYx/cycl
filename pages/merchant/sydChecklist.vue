<!-- 收运清单 -->
<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运清单"
            @clickLeft="back" />
        <view class="menu">
            <view class="tab-bar">
                <view v-for="(tab, index) in tabs" :key="index" class="tab-item"
                    :class="{ active: currentTab === index }" @click="handleTabClick(index)">
                    {{ tab.value }}
                    <!-- 为预约中tab添加uni-badge -->
                    <uni-badge v-if="tab.value === '预约中' && bookingBadgeText !== '0' && bookingBadgeText !== ''"
                        class="uni-badge" type="error" :text="bookingBadgeText" :is-dot="false" absolute="rightTop"
                        :offset="[-5, -12]"></uni-badge>
                    <!-- 为进行中tab添加uni-badge -->
                    <uni-badge v-if="tab.value === '进行中' && processingBadgeText !== '0' && processingBadgeText !== ''"
                        class="uni-badge" type="error" :text="processingBadgeText" :is-dot="false" absolute="rightTop"
                        :offset="[-5, -12]"></uni-badge>
                    <view class="tab-line" v-if="currentTab === index"></view>
                </view>
            </view>
        </view>

        <!-- 内容区域 -->
        <view class="content-wrapper">
            <scroll-view class="content" scroll-y>
                <!-- 数据列表 -->
                <view class="order-list" v-if="allOrderList.length > 0">
                    <view class="order-item" v-for="(item, index) in allOrderList" :key="index">
                        <view class="order-header">
                            <view class="shop-info">
                                <text class="shop-name">{{ item.merchantName }}</text>
                                <text v-if="currentTab == 0" :class="['status-tag', getStatusClass(item.status)]">
                                    {{ getStatusText(item.status) }}
                                </text>
                            </view>

                        </view>
                        <view class="order-content">
                            <view class="info-item">
                                <text class="label">预估收运：</text>
                                <text class="value">{{ item.estimateWeight }} 桶</text>
                            </view>
                            <view class="info-item">
                                <text class="label">今日收运：</text>
                                <text class="value">{{ item.estimateBucketNum ?? 0 }} 桶</text>
                            </view>
                            <view class="info-item">
                                <text class="label">预估总量：</text>
                                <text class="value">{{ item.estimateWeight ?? 0 }} kg</text>
                            </view>
                            <view class="info-item">
                                <text class="label">收运总量：</text>
                                <text class="value">{{ item.weight ?? '暂无' }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">车辆信息：</text>
                                <text class="value">{{ item.registrationNumber ?? '暂无' }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">收运时间：</text>
                                <text class="value">{{ item.arrivalTime ?? '暂无' }}</text>
                            </view>
                        </view>
                        <view class="order-footer">
                            <!-- currentTab == 0: 显示取消和查看详情按钮 -->
                            <template v-if="currentTab == 0">
                                <uni-button size="mini" type="default" class="btn-cancel" @tap="handleCancel(item)">
                                    取消
                                </uni-button>
                                <uni-button size="mini" type="primary" class="btn-confirm"
                                    @tap="handleViewDetails(item)">
                                    查看详情
                                </uni-button>
                            </template>

                            <!-- currentTab == 1: 显示确认收运按钮 -->
                            <template v-else-if="currentTab == 1">
                                <uni-button size="mini" type="primary" class="btn-confirm"
                                    @tap="handleConfirmTransport(item)">
                                    确认收运
                                </uni-button>
                            </template>

                            <!-- currentTab == 2: 只显示查看详情按钮 -->
                            <template v-else-if="currentTab == 2">
                                <uni-button size="mini" type="default" class="btn-confirm"
                                    @tap="handleViewDetails(item)">
                                    查看详情
                                </uni-button>
                            </template>
                        </view>
                    </view>

                    <!-- 加载更多组件 - 只在有数据时显示 -->
                    <view class="loadMore">
                        <uni-load-more :status="loadingStatus" :content-text="{
                            contentdown: '上拉显示更多',
                            contentrefresh: '正在加载...',
                            contentnomore: '没有更多数据了'
                        }"></uni-load-more>
                    </view>
                </view>

                <!-- 暂无数据状态 -->
                <view class="empty-state" v-else-if="loadingStatus !== 'loading'">
                    <view class="empty-icon">📋</view>
                    <text class="empty-text">暂无数据</text>
                    <text class="empty-desc">当前分类下暂时没有相关信息</text>
                </view>
            </scroll-view>
        </view>
    </view>
</template>
<script setup>
import {
    ref,
    computed,
    onMounted
} from 'vue';
import {
    onPullDownRefresh,
    onReachBottom
} from '@dcloudio/uni-app';

import {
    apiGetPlanPage, apiGetconfirmPlanById
} from '@/api/apis.js';

import { useUserStore } from '@/stores/user.js'

//3 预约中 0 待收运 1 已完成
const tabs = [{ key: "3", value: "预约中" }, { key: "0", value: "进行中" }, { key: "1", value: "已完成" }];
//下标
const currentTab = ref(0);

const userStore = useUserStore();

//返回上一页
const back = () => {
    uni.navigateBack()
}

//点击菜单
function handleTabClick(index) {
    currentTab.value = index;
    allOrderList.value = [];
    pageNum.value = 1; // 重置页码为1
    getNetwork();
}

// 状态转换函数
const getStatusText = (status) => {
    if (currentTab.value == 0) {
        // 审核状态
        switch (status) {
            case 0:
            case '0':
                return '待审核';
            case 1:
            case '1':
                return '审核通过';
            case 2:
            case '2':
                return '审核不通过';
            default:
                return '未知状态';
        }
    }
    return '';
};

// 获取状态样式类名
const getStatusClass = (status) => {
    if (currentTab.value == 0) {
        switch (status) {
            case 0:
            case '0':
                return 'booking'; // 待审核 - 蓝色
            case 1:
            case '1':
                return 'processing'; // 审核通过 - 绿色
            case 2:
            case '2':
                return 'completed'; // 审核不通过 - 灰色
            default:
                return 'completed';
        }
    }
    return '';
};

// 按钮点击事件处理函数
const handleCancel = (item) => {
    console.log('取消按钮被点击', item);

};

const handleViewDetails = (item) => {
    console.log('查看详情按钮被点击', item);


};

const handleConfirmTransport = async (item) => {
    console.log('确认收运按钮被点击', item);
    if (item.merchantConfirm == null) {
        uni.showToast({
            title: '请等待师傅确认收运完成!',
            icon: 'none',
            dduration: 2500
        });
        return;
    }
    try {
        uni.showLoading({
            title: '确认中...'
        });

        const params = {
            merchantId: userStore.merchant?.id,
            id: item.id
        };

        const res = await apiGetconfirmPlanById(params);

        uni.hideLoading();

        if (res.code === 200 || res.success) {
            uni.showToast({
                title: '确认收运成功',
                icon: 'success'
            });

            // 刷新当前页面数据，保持在当前标签页
            allOrderList.value = [];
            pageNum.value = 1;
            getNetwork();
        } else {
            uni.showToast({
                title: res.message || '确认收运失败',
                icon: 'none'
            });
        }
    } catch (error) {
        console.error('确认收运失败:', error);
        uni.hideLoading();
        uni.showToast({
            title: '网络错误，请重试',
            icon: 'none'
        });
    }
};

// 添加badgeText的ref变量
const bookingBadgeText = ref('0');
const processingBadgeText = ref('0');

// 添加页码和加载状态变量
const pageNum = ref(1);
const loadingStatus = ref('more'); // more-加载前/loading-加载中/nomore-没有更多数据

// 数据列表
const allOrderList = ref([]);

//后获取数据
const getNetwork = async () => {
    try {
        // 如果不是第一页，设置加载状态为加载中
        if (pageNum.value > 1) {
            loadingStatus.value = 'loading';
        }


        const res = await apiGetPlanPage({
            pageNum: pageNum.value,
            merchantId: 448,
            // merchantId: userStore.merchant?.id,
            status: tabs[currentTab.value].key // 使用tabs中的key值
        });


        // 处理下拉刷新
        if (pageNum.value === 1) {
            allOrderList.value = res.data.list || [];
            uni.stopPullDownRefresh();
        } else {
            // 处理上拉加载更多
            allOrderList.value = [...allOrderList.value, ...(res.data.list || [])];
        }

        // 判断是否还有更多数据
        if (res.data.list && res.data.list.length < 10) {
            // 如果返回的数据少于每页数量，说明没有更多数据了
            loadingStatus.value = 'nomore';
        } else {
            // 否则还有更多数据
            loadingStatus.value = 'more';
        }
    } catch (error) {
        console.error('获取数据失败:', error);

        // 停止下拉刷新
        uni.stopPullDownRefresh();

        // 重置加载状态
        loadingStatus.value = 'more';

        // 如果是第一页加载失败，确保显示暂无数据状态
        if (pageNum.value === 1) {
            allOrderList.value = [];
        }

        uni.showToast({
            title: '数据加载失败，请重试',
            icon: 'none',
            duration: 2000
        });
    }
};


// 上拉加载更多方法
const onLoadMore = () => {
    if (loadingStatus.value === 'nomore') return;
    // 页码增加
    pageNum.value++;
    getNetwork();
};


// 触底加载更多
onReachBottom(() => {
    onLoadMore();
});

//下拉刷新
onPullDownRefresh(() => {
    allOrderList.value = [];
    pageNum.value = 1; // 重置页码为1
    getNetwork();
})

// 组件挂载时初始化数据
onMounted(() => {
    pageNum.value = 1;
    getNetwork();
});
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $bg-theme-color;

    .menu {
        position: relative;
        margin-top: 2rpx;
        background-color: #ffffff;
        height: 88rpx;

        .tab-bar {
            display: flex;
            height: 100%;

            .tab-item {
                flex: 1;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28rpx;
                color: rgba(61, 61, 61, 1);
                position: relative;

                &.active {
                    color: rgba(7, 193, 96, 1);
                    font-weight: 500;
                }

                .tab-line {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 56rpx;
                    height: 4rpx;
                    background-color: rgba(7, 193, 96, 1);
                    border-radius: 2rpx;
                }
            }
        }
    }

    .content-wrapper {
        flex: 1;
        margin-top: 30rpx;

        .content {
            height: 100%;

        }

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
                            border-radius: 8rpx;
                            font-size: 24rpx;
                            width: 100rpx;
                            height: 40rpx;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            &.booking {
                                color: rgba(255, 161, 0, 1);
                                background-color: rgba(255, 161, 0, 0.10);
                            }

                            &.processing {
                                color: rgba(7, 193, 96, 1);
                                background-color: rgba(7, 193, 96, 0.10);
                            }

                            &.completed {
                                color: rgba(61, 61, 61, 0.50);
                                background-color: rgba(61, 61, 61, 0.10);
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
                            font-size: 26rpx;
                            color: rgba(61, 61, 61, 1);
                        }
                    }
                }

                .order-footer {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 20rpx;

                    .btn-cancel {
                        margin-right: 20rpx;
                        color: rgba(61, 61, 61, 1);
                        background-color: #fff;
                        border: 1px solid rgba(196, 196, 196, 1);
                        font-size: 26rpx;
                        width: 144rpx;
                        height: 48rpx;
                        border-radius: 20rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-sizing: border-box; // 使用border-box盒模型

                    }

                    .btn-confirm {
                        color: rgba(255, 255, 255, 1);
                        background-color: rgba(7, 193, 96, 1);
                        font-size: 26rpx;
                        width: 144rpx;
                        height: 48rpx;
                        border-radius: 20rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-sizing: border-box; // 使用border-box盒模型
                    }
                }
            }
        }
    }

    .loadMore {
        padding-bottom: calc(env(safe-area-inset-bottom) + 50);
    }

    // 暂无数据状态
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 200rpx); // 确保占满剩余屏幕高度
        padding: 120rpx 60rpx;
        text-align: center;
        background-color: #ffffff;

        .empty-icon {
            font-size: 120rpx;
            margin-bottom: 30rpx;
            opacity: 0.3;
        }

        .empty-text {
            font-size: 32rpx;
            color: rgba(61, 61, 61, 0.6);
            margin-bottom: 16rpx;
            font-weight: 500;
        }

        .empty-desc {
            font-size: 26rpx;
            color: rgba(61, 61, 61, 0.4);
            line-height: 1.5;
        }
    }

    // 自定义导航栏字体大小为34rpx
    :deep(.uni-navbar__content-title) {
        font-size: 34rpx !important;
    }

    :deep(.uni-nav-bar-text) {
        font-size: 34rpx !important;
    }
}
</style>

