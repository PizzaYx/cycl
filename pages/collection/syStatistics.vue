<!-- 收运端统计-->
<template>
    <view class="container">
        <PageHeader title="收运端统计" @back="back" />

        <view class="menu">
            <view class="search-container">
                <view class="search-box">
                    <uni-icons type="search" size="24" color="#999" class="search-icon"></uni-icons>
                    <input class="search-input" placeholder="搜索店铺/商铺关键词" v-model="searchKeyword" @confirm="onSearch" />
                    <uni-icons v-if="searchKeyword" type="clear" size="20" color="#999" class="clear-icon"
                        @click="clearSearch"></uni-icons>
                </view>
            </view>
        </view>
        <!-- 统计信息 -->
        <view class="tjxx">
            <view class="tj-item" v-for="(item, index) in statisticsConfig" :key="index">
                <image :src="item.image" mode="aspectFill"></image>
                <view class="ljts">
                    <view class="number">{{ item.number() }}</view>
                    <view class="title">{{ item.title }}</view>
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
                                <DriverStatusTag :status="item.status" />
                            </view>

                        </view>
                        <view class="order-content">
                            <InfoDisplay :fields="getInfoFields(item)" />
                        </view>
                        <DriverOrderActions :status="item.status" :order-data="item" :view-only="true" />
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
    onMounted
} from 'vue';
import {
    onPullDownRefresh,
    onReachBottom
} from '@dcloudio/uni-app';

import {
    apiGetDriverPlanStatisticsPage, apiGetDriverPlanStatistics
} from '@/api/apis.js';

import { useUserStore } from '@/stores/user.js'
import DriverStatusTag from '@/components/DriverStatusTag/DriverStatusTag.vue'
import DriverOrderActions from '@/components/DriverOrderActions/DriverOrderActions.vue'
import InfoDisplay from '@/components/InfoDisplay/InfoDisplay.vue'
import PageHeader from '@/components/PageHeader/PageHeader.vue'
import { formatWeight, formatNum } from '@/utils/orderUtils'


const userStore = useUserStore();

// 分别定义统计数据
const merchantCount = ref(0); // 商家数量
const totalWeight = ref(0);// 总重量
const syount = ref(0);//已收运
const nosyount = ref(0);///未收运
// 统计配置（固定不变）
const statisticsConfig = [
    {
        image: '/static/ssd/sytj2.png',
        number: () => merchantCount.value + ' 个',
        title: '商家数量'
    },
    {
        image: '/static/shd/tjright.png',
        number: () => totalWeight.value + ' kg',
        title: '总重量'
    },
    {
        image: '/static/ssd/sytj1.png',
        number: () => syount.value + ' 个',
        title: '已收运'
    },
    {
        image: '/static/shd/tjleft.png',
        number: () => nosyount.value + ' 个',
        title: '未收运'
    }
];



// 筛选相关状态
const searchKeyword = ref(''); // 搜索关键词

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
            },
            {
                key: 'address',
                label: '地址',
                value: item.address
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
            },
            {
                key: 'address',
                label: '地址',
                value: item.address
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
        },
        {
            key: 'address',
            label: '地址',
            value: item.address
        }
    ];
};


// 返回上一页方法
const back = () => {
    uni.navigateBack();
};

// 添加页码和加载状态变量
const pageNum = ref(1);
const loadingStatus = ref('more'); // more-加载前/loading-加载中/nomore-没有更多数据

// 数据列表
const allOrderList = ref([]);

//搜索统计数据
const getToStatistics = async () => {
    // 添加搜索关键词
    const res = await apiGetDriverPlanStatistics({
        title: searchKeyword.value ?? '',
        driverId: userStore.currentDriver?.id,
    });

    if (res.code === 200) {
        merchantCount.value = res.data.merchantNum ?? 0;
        totalWeight.value = res.data.weightNum ?? 0;
        syount.value = res.data.confirmNum ?? 0;
        nosyount.value = res.data.notConfirmNum ?? 0;
    }
};

//后获取数据
const getNetwork = async () => {
    try {
        // 如果不是第一页，设置加载状态为加载中
        if (pageNum.value > 1) {
            loadingStatus.value = 'loading';
        }

        // 构建请求参数
        const params = {
            pageNum: pageNum.value,
            driverId: userStore.currentDriver?.id,
        };


        // 添加搜索关键词
        if (searchKeyword.value) {
            params.title = searchKeyword.value;
        }

        const res = await apiGetDriverPlanStatisticsPage(params);


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


// 搜索方法
const onSearch = () => {
    getToStatistics();
    resetPageAndReload();
};

// 清空搜索关键词
const clearSearch = () => {
    searchKeyword.value = '';
    resetPageAndReload();
};

const resetPageAndReload = () => {
    console.log('重置页码和重新加载数据');
    allOrderList.value = [];
    pageNum.value = 1;
    getNetwork();
    getToStatistics();
};





// 组件挂载时初始化数据
onMounted(() => {
    pageNum.value = 1;
    getToStatistics();
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
        padding: 20rpx 30rpx;
        /* 调整padding以适应搜索框 */

        .search-container {
            .search-box {
                display: flex;
                align-items: center;
                background-color: #f5f5f5;
                border-radius: 45rpx;
                height: 64rpx;
                padding: 0 20rpx;

                .search-icon {
                    margin-right: 10rpx;
                    width: 48rpx;
                    height: 48rpx;
                }

                .search-input {
                    flex: 1;
                    font-size: 28rpx;
                    background-color: transparent;
                    border: none;
                    outline: none;
                }

                .clear-icon {
                    margin-left: 10rpx;
                }
            }
        }
    }

    .tjxx {
        display: flex;
        flex-wrap: wrap;
        margin: 30rpx;
        justify-content: space-between;

        .tj-item {
            width: 48%;
            display: flex;
            align-items: center;
            background: #fff;
            border-radius: 20rpx;
            padding: 20rpx;
            margin-bottom: 20rpx;

            image {
                width: 88rpx;
                height: 88rpx;
                margin-right: 20rpx;
            }

            .ljts {
                display: flex;
                flex-direction: column;

                .number {
                    font-size: 30rpx;
                    font-weight: bold;
                    color: #3D3D3D;
                    margin-bottom: 10rpx;
                }

                .title {
                    font-size: 24rpx;
                    color: #3D3D3D;
                }
            }
        }
    }

    .content-wrapper {
        flex: 1;

        .content {
            height: 100%;

        }

        .order-list {
            padding: 0 30rpx; // 左右30rpx

            .order-item {
                margin-bottom: 30rpx;
                padding: 30rpx;
                background-color: #fff;
                border-radius: 12rpx;
                min-height: 400rpx;
                box-sizing: border-box;

                .order-header {
                    margin-bottom: 20rpx;

                    .shop-info {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 16rpx;

                        .shop-name {
                            font-size: 26rpx;
                            color: rgba(61, 61, 61, 1);
                        }

                    }


                }


                .order-footer {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 20rpx;

                    .view-btn {
                        color: #07C160;
                        background-color: transparent;
                        border: 1rpx solid #07C160;
                        font-size: 24rpx;
                        width: 120rpx;
                        height: 48rpx;
                        border-radius: 100rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-sizing: border-box;
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
        min-height: calc(100vh - 600rpx); // 确保占满剩余屏幕高度
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

}
</style>