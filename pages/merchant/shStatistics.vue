<!-- 收运统计-->
<template>
    <view class="container">
        <PageHeader title="商户收运统计" @back="back" />

        <view class="menu">

            <view class="filter-container">
                <!-- 状态选择器组件 -->
                <StatusPicker v-model="selectedStatus" :options="statusOptions" @change="onStatusChange" />

                <!-- 时间范围选择器组件 -->
                <TimeRangePicker v-model="selectedTimeRange" @change="onTimeChange" />
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
                                <StatusTag :status="item.status" />
                            </view>

                        </view>
                        <view class="order-content">
                            <InfoDisplay :fields="getInfoFields(item)" />
                        </view>
                        <view class="order-footer">

                            <uni-button size="mini" class="btn-confirm" @tap="handleViewDetails(item)">
                                查看详情
                            </uni-button>
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
    apiGetPlanStatisticsPage, apiGetPlanStatistics
} from '@/api/apis.js';

import { useUserStore } from '@/stores/user.js'
import TimeRangePicker from '@/components/TimeRangePicker/TimeRangePicker.vue'
import StatusPicker from '@/components/StatusPicker/StatusPicker.vue'
import StatusTag from '@/components/StatusTag/StatusTag.vue'
import InfoDisplay from '@/components/InfoDisplay/InfoDisplay.vue'
import PageHeader from '@/components/PageHeader/PageHeader.vue'


const userStore = useUserStore();

// 分别定义统计数据
const bucketCount = ref(0);
const totalWeight = ref(0);



// 统计配置（固定不变）
const statisticsConfig = [
    {
        image: '/static/shd/tjleft.png',
        number: () => bucketCount.value + ' 个',
        title: '垃圾桶数'
    },
    {
        image: '/static/shd/tjright.png',
        number: () => totalWeight.value + ' kg',
        title: '总重量'
    }
];



const handleViewDetails = (item) => {
    console.log('查看详情按钮被点击', item);
    uni.navigateTo({
        url: `/pages/merchant/shsyDetail?id=${item.id}&merchantId =${item.merchantId}`
    });
};

// 生成信息字段配置
const getInfoFields = (item) => {
    return [
        { key: 'appointmentTime', label: '预估时间', value: item.appointmentTime },
        { key: 'arrivalTime', label: '收运时间', value: item.arrivalTime },
        { key: 'estimateWeight', label: '预估重量', value: item.estimateWeight },
        { key: 'weight', label: '收运重量', value: item.weight },
        { key: 'estimateBucketNum', label: '预估桶数', value: item.estimateBucketNum },
        { key: 'bucketNum', label: '收运桶数', value: item.bucketNum }
    ];
};


//搜索统计数据
const getToStatistics = async () => {
    const params = {
        merchantId: userStore.merchant?.id,
    };

    // 添加筛选条件
    if (selectedStatus.value !== null) {
        params.status = selectedStatus.value;
    }

    if (selectedTimeRange.value && selectedTimeRange.value.length === 2 && selectedTimeRange.value[0] && selectedTimeRange.value[1]) {
        params.startTime = selectedTimeRange.value[0];
        params.endTime = selectedTimeRange.value[1];
    }
    // 添加搜索关键词
    const res = await apiGetPlanStatistics(params);

    if (res.code === 200) {
        bucketCount.value = res.data.bucketNum ?? 0;
        totalWeight.value = res.data.weight ?? 0;

    }
};


// 筛选相关状态
const selectedStatus = ref(null); // 选中的状态
const selectedTimeRange = ref([]); // 选中的时间范围

// 状态选项配置 (0 待收运 1 已完成 2 无需收运)
const statusOptions = ref([
    { value: 0, text: '待收运' },
    { value: 1, text: '已完成' },
    { value: 2, text: '无需收运' }
]);

// 返回上一页方法
const back = () => {
    uni.navigateBack();
};

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

        // 构建请求参数
        const params = {
            pageNum: pageNum.value,
            merchantId: userStore.merchant?.id,
        };

        // 添加筛选条件
        if (selectedStatus.value !== null) {
            params.status = selectedStatus.value;
        }

        if (selectedTimeRange.value && selectedTimeRange.value.length === 2 && selectedTimeRange.value[0] && selectedTimeRange.value[1]) {
            params.startTime = selectedTimeRange.value[0];
            params.endTime = selectedTimeRange.value[1];
        }

        const res = await apiGetPlanStatisticsPage(params);


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
    getToStatistics();
})

// 筛选相关方法

const onStatusChange = (value) => {
    selectedStatus.value = value;
    // 重置页面并重新加载数据
    resetPageAndReload();
};


const onTimeChange = (value) => {
    console.log('时间变化:', value);
    selectedTimeRange.value = value;
    // 重置页面并重新加载数据
    resetPageAndReload();
};


const resetPageAndReload = () => {
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
        padding: 0 30rpx;

        .filter-container {
            display: flex;
            align-items: center; // 垂直居中
            justify-content: space-around; // 水平平分空间
            height: 88rpx;

            .filter-item {
                display: flex;
                align-items: center;
                gap: 10rpx; // 文字和箭头紧挨着
                min-height: 60rpx;

                text {
                    font-size: 28rpx;
                    color: #333;
                }
            }

        }
    }

    .tjxx {
        display: flex;
        justify-content: space-between;
        height: 132rpx;

        margin: 30rpx;
        gap: 20rpx;

        .tj-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-around;
            background: #fff;
            border-radius: 20rpx;

            image {
                width: 88rpx;
                height: 88rpx;
            }

            .ljts {
                .number {
                    font-size: 30rpx;
                    font-weight: bold;
                    color: #3D3D3D;
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

                .order-content {
                    // 样式已移到 InfoDisplay 组件中
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
                        color: rgba(7, 193, 96, 1);
                        // background-color: rgba(7, 193, 96, 1);
                        border: 1rpx solid rgba(7, 193, 96, 1);
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

}
</style>