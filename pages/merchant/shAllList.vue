<!-- 收运总记录-->
<template>
    <view class="container">
        <PageHeader title="收运记录" @back="back" />

        <view class="menu">

            <view class="filter-container">
                <!-- 状态选择器组件 -->
                <StatusPicker v-model="selectedStatus" :options="statusOptions" @change="onStatusChange" />


                <!-- 时间范围选择器组件 -->
                <TimeRangePicker v-model="selectedTimeRange" @change="onTimeChange" />
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
                            <uni-button v-if="item.status != 0" size="mini" type="default" class="btn-confirm"
                                @tap="handleViewDetails(item)">
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
    apiGetPlanAllPage
} from '@/api/apis.js';

import { useUserStore } from '@/stores/user.js'
import TimeRangePicker from '@/components/TimeRangePicker/TimeRangePicker.vue'
import StatusPicker from '@/components/StatusPicker/StatusPicker.vue'
import StatusTag from '@/components/StatusTag/StatusTag.vue'
import InfoDisplay from '@/components/InfoDisplay/InfoDisplay.vue'
import PageHeader from '@/components/PageHeader/PageHeader.vue'
const userStore = useUserStore();

// 筛选相关状态
const selectedStatus = ref(''); // 选中的状态
const selectedTimeRange = ref([]); // 选中的时间范围

// 状态选项配置 (0 待确认 1 已完成 2 无需收运)
const statusOptions = ref([
    { value: 0, text: '待确认' },
    { value: 1, text: '已完成' },
    { value: 2, text: '无需收运' }
]);

//返回上一页
const back = () => {
    uni.navigateBack()
}

// 添加页码和加载状态变量
const pageNum = ref(1);
const loadingStatus = ref('more'); // more-加载前/loading-加载中/nomore-没有更多数据

// 数据列表
const allOrderList = ref([]);


const handleViewDetails = (item) => {
    console.log('查看详情按钮被点击', item);
    uni.navigateTo({
        url: `/pages/merchant/shsyDetail?id=${item.id}&merchantId=${item.merchantId}`
    });
};

// 生成信息字段配置
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
                key: 'registrationNumber',
                label: '车辆信息',
                value: item.registrationNumber
            },
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
                key: 'registrationNumber',
                label: '车辆信息',
                value: item.registrationNumber
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
            key: 'registrationNumber',
            label: '车辆信息',
            value: item.registrationNumber
        }
    ];
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
            merchantId: userStore.currentMerchant?.id,
        };

        // 添加筛选条件
        if (selectedStatus.value !== null) {
            params.status = selectedStatus.value;
        }

        if (selectedTimeRange.value && selectedTimeRange.value.length === 2) {
            params.startTime = selectedTimeRange.value[0];
            params.endTime = selectedTimeRange.value[1];
        }

        const res = await apiGetPlanAllPage(params);


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

// 引用选择器组件
const datetimePicker = ref(null);

// 筛选相关方法

const onStatusChange = (value) => {
    selectedStatus.value = value;
    // 重置页面并重新加载数据
    resetPageAndReload();
};


const onTimeChange = (value) => {
    selectedTimeRange.value = value;
    // 重置页面并重新加载数据
    resetPageAndReload();
};


const resetPageAndReload = () => {
    allOrderList.value = [];
    pageNum.value = 1;
    getNetwork();
};


// 获取当前日期时间（包含时分秒）
const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};


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

            .filter-select {

                // 自定义 uni-datetime-picker 样式 - 彻底移除所有背景
                :deep(.uni-datetime-picker) {
                    // 移除组件本身的所有样式
                    background: transparent !important;
                    border: none !important;

                    .uni-datetime-picker--btn {
                        border: none !important;
                        background: transparent !important;
                        background-color: transparent !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        outline: none !important;

                        // 强制移除所有可能的背景状态
                        &:before,
                        &:after {
                            display: none !important;
                        }

                        &:active,
                        &:focus,
                        &:hover,
                        &:visited,
                        &:target {
                            background: transparent !important;
                            background-color: transparent !important;
                            box-shadow: none !important;
                            outline: none !important;
                        }

                        .uni-datetime-picker-text {
                            font-size: 26rpx !important;
                            color: #333 !important;
                            background: transparent !important;
                        }
                    }

                    // 移除可能存在的其他子元素背景
                    view,
                    text,
                    input {
                        background: transparent !important;
                        background-color: transparent !important;
                    }
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
            padding: 30rpx; // 上下左右30rpx

            .order-item {
                margin-bottom: 30rpx;
                padding: 30rpx;
                background-color: #fff;
                border-radius: 12rpx;

                &:last-child {
                    margin-bottom: 0;
                }


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
