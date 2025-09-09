<!-- 收运清单 -->
<template>
    <view class="container">
        <!-- 不再固定在顶部的tab -->
        <view class="tab-bar">
            <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
                @click="handleTabClick(index)">
                {{ tab }}
                <!-- 为预约中tab添加uni-badge -->
                <uni-badge v-if="tab === '预约中'" class="uni-badge" type="error" :text="bookingBadgeText" :dot="false"
                    :absolute="'rightTop'" :offset="[-5, -12]"></uni-badge>
                <!-- 为进行中tab添加uni-badge -->
                <uni-badge v-if="tab === '进行中'" class="uni-badge" type="error" :text="processingBadgeText" :dot="true"
                    :absolute="'rightTop'" :offset="[-5, -12]"></uni-badge>
                <view class="tab-line" v-if="currentTab === index"></view>
            </view>
        </view>

        <!-- 内容区域 -->
        <view class="content-wrapper">
            <scroll-view class="content" scroll-y>
                <view class="order-list">
                    <view class="order-item" v-for="(item, index) in orderList" :key="index">
                        <view class="order-header">
                            <view class="shop-info">
                                <text class="shop-name">{{ item.shopName }}</text>
                                <text
                                    :class="['status-tag', item.status === '预约中' ? 'booking' : (item.status === '进行中' ? 'processing' : 'completed')]">
                                    {{ item.status }}
                                </text>
                            </view>

                        </view>
                        <view class="order-content">
                            <view class="info-item">
                                <text class="label">今日收运：</text>
                                <text class="value">{{ item.deliveryCount }}桶</text>
                            </view>

                            <view class="info-item">
                                <text class="label">收运重量：</text>
                                <text class="value">{{ item.weight }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">车辆信息：</text>
                                <text class="value">{{ item.carInfo }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">收运时间：</text>
                                <text class="value">{{ item.time }}</text>
                            </view>
                        </view>
                        <view class="order-footer">
                            <uni-button size="mini" class="btn-cancel" v-if="item.status !== '已完成'">取消</uni-button>
                            <uni-button size="mini" :type="item.status === '预约中' ? 'primary' : 'default'"
                                class="btn-confirm">
                                {{ item.status === '预约中' ? '确认收运' : (item.status === '进行中' ? '完成收运' : '查看详情') }}
                            </uni-button>
                        </view>
                    </view>
                </view>

                <view class="loadMore">
                    <uni-load-more :status="loadingStatus" :content-text="{
                        contentdown: '上拉显示更多',
                        contentrefresh: '正在加载...',
                        contentnomore: '没有更多数据了'
                    }"></uni-load-more>
                </view>
            </scroll-view>
        </view>
    </view>
</template>
<script setup>
import {
    ref,
    computed
} from 'vue';
import {
    onPullDownRefresh,
    onReachBottom
} from '@dcloudio/uni-app';

const tabs = ['预约中', '进行中', '已完成'];
const currentTab = ref(0);
// 添加badgeText的ref变量
const bookingBadgeText = ref('11');
const processingBadgeText = ref('123');

// 数据列表
const allOrderList = ref([
    // 预约中数据
    {
        id: 1,
        shopName: '川味小厨(总店)',
        status: '预约中',
        deliveryCount: '5',
        weight: '451kg',
        carInfo: '川A3D47M',
        time: '2025-08-20 14:30-15:30'
    },
    {
        id: 2,
        shopName: '老北京烤鸭店',
        status: '预约中',
        deliveryCount: '3',
        weight: '210kg',
        carInfo: '川B5H29N',
        time: '2025-08-21 10:00-11:00'
    },
    {
        id: 3,
        shopName: '兰州拉面',
        status: '预约中',
        deliveryCount: '4',
        weight: '320kg',
        carInfo: '川C1D2E3',
        time: '2025-08-21 14:00-15:00'
    },
    {
        id: 4,
        shopName: '黄焖鸡米饭',
        status: '预约中',
        deliveryCount: '2',
        weight: '180kg',
        carInfo: '川D4F5G6',
        time: '2025-08-21 16:00-17:00'
    },
    // 进行中数据
    {
        id: 5,
        shopName: '湘菜馆',
        status: '进行中',
        deliveryCount: '7',
        weight: '625kg',
        carInfo: '川C8K45P',
        time: '2025-08-20 09:15-10:15'
    },
    {
        id: 6,
        shopName: '粤式茶餐厅',
        status: '进行中',
        deliveryCount: '4',
        weight: '312kg',
        carInfo: '川D1M67Q',
        time: '2025-08-20 13:45-14:45'
    },
    {
        id: 7,
        shopName: '日式料理',
        status: '进行中',
        deliveryCount: '6',
        weight: '480kg',
        carInfo: '川E2N3O4',
        time: '2025-08-21 11:30-12:30'
    },
    // 已完成数据
    {
        id: 8,
        shopName: '东北饺子王',
        status: '已完成',
        deliveryCount: '6',
        weight: '523kg',
        carInfo: '川E3R89S',
        time: '2025-08-19 16:30-17:30'
    },
    {
        id: 9,
        shopName: '重庆小面',
        status: '已完成',
        deliveryCount: '2',
        weight: '156kg',
        carInfo: '川F6T23U',
        time: '2025-08-19 11:20-12:20'
    },
    {
        id: 10,
        shopName: '新疆羊肉串',
        status: '已完成',
        deliveryCount: '8',
        weight: '742kg',
        carInfo: '川G9Y56V',
        time: '2025-08-18 15:40-16:40'
    },
    {
        id: 11,
        shopName: '韩式烤肉',
        status: '已完成',
        deliveryCount: '5',
        weight: '420kg',
        carInfo: '川H7U8I9',
        time: '2025-08-18 12:00-13:00'
    },
    {
        id: 12,
        shopName: '意大利餐厅',
        status: '已完成',
        deliveryCount: '3',
        weight: '280kg',
        carInfo: '川J1K2L3',
        time: '2025-08-17 18:30-19:30'
    }
]);

// 根据当前tab过滤数据
const orderList = computed(() => {
    if (currentTab.value === 0) { // 预约中
        return allOrderList.value.filter(item => item.status === '预约中');
    } else if (currentTab.value === 1) { // 进行中
        return allOrderList.value.filter(item => item.status === '进行中');
    } else { // 已完成
        return allOrderList.value.filter(item => item.status === '已完成');
    }
});

const handleTabClick = (index) => {
    currentTab.value = index;
};

// 上拉加载更多相关
const loadingStatus = ref('more'); // more-加载前/loading-加载中/nomore-没有更多数据

// 上拉加载更多方法
const onLoadMore = () => {
    if (loadingStatus.value === 'nomore') return;

    loadingStatus.value = 'loading';
    // 模拟加载更多数据
    setTimeout(() => {
        // 这里可以请求更多数据并添加到列表中
        loadingStatus.value = 'more';
        // 如果没有更多数据了，设置为 'nomore'
        // loadingStatus.value = 'nomore';
    }, 1500);
};


// 触底加载更多
onReachBottom(() => {
    onLoadMore();
});
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: $bg-theme-color;

    .tab-bar {
        display: flex;
        align-items: center;
        height: 88rpx;
        background-color: rgba(255, 255, 255, 1);
        padding: 0 30rpx;
        position: relative;
        margin-top: 2rpx; // 距离导航栏2rpx

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

    .content-wrapper {
        flex: 1;
         margin-top: 30rpx; // 为固定tab留出空间

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
}
</style>