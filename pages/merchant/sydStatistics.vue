<!-- 收运统计-->
<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运统计"
            @clickLeft="back" />

        <view class="menu">

            <view class="filter-container">
                <!-- 状态选择器 - 改回底部弹出 -->
                <view class="filter-item" @click="showStatusPicker">
                    <text>状态</text>
                    <uni-icons type="bottom" size="12" color="#666"></uni-icons>
                </view>


                <!-- 时间范围选择器 - 还原正常样式 -->
                <view class="filter-item">
                    <uni-datetime-picker ref="datetimePicker" type="datetimerange" v-model="selectedTimeRange"
                        rangeSeparator="至" start="2020-01-01 00:00:00" :end="getCurrentDateTime()"
                        @change="onTimeChange" :border="false" class="filter-select time-select">
                        <template v-slot:default>
                            <text>时间</text>
                        </template>
                    </uni-datetime-picker>
                    <uni-icons type="bottom" size="12" color="#666"></uni-icons>
                </view>
            </view>
        </view>
        <!-- 统计信息 -->
        <view class="tjxx">
            <view class="tj-item" v-for="(item, index) in statisticsConfig" :key="index">
                <image :src="item.image" mode="aspectFill"></image>
                <view class="ljts">
                    <view class="number">{{ item.number }}</view>
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

//下标
const currentTab = ref(0);

const userStore = useUserStore();

// 分别定义统计数据
const bucketCount = ref(13);
const totalWeight = ref(414);

// 统计配置（固定不变）
const statisticsConfig = [
    {
        image: '/static/shd/tjleft.png',
        number: bucketCount,
        title: '垃圾桶数'
    },
    {
        image: '/static/shd/tjright.png',
        number: totalWeight,
        title: '总重量'
    }
];


// 筛选相关状态
const selectedStatus = ref(''); // 选中的状态
const selectedTimeRange = ref([]); // 选中的时间范围

// 状态选项配置 (0 待收运 1 已完成 2 无需收运)
const statusOptions = ref([
    { value: '0', text: '待收运' },
    { value: '1', text: '已完成' },
    { value: '2', text: '无需收运' }
]);

// 返回上一页方法
const back = () => {
    uni.navigateBack({
        delta: 1
    });
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
            status: tabs[currentTab.value].key // 使用tabs中的key值
        };

        // 添加筛选条件
        if (selectedStatus.value !== '') {
            params.filterStatus = selectedStatus.value;
        }

        if (selectedTimeRange.value && selectedTimeRange.value.length === 2) {
            params.startTime = selectedTimeRange.value[0];
            params.endTime = selectedTimeRange.value[1];
        }

        const res = await apiGetMerchantStatistics(params);


        // 处理下拉刷新
        if (pageNum.value === 1) {
            allOrderList.value = res.data.records || [];
            uni.stopPullDownRefresh();
        } else {
            // 处理上拉加载更多
            allOrderList.value = [...allOrderList.value, ...(res.data.records || [])];
        }

        // 判断是否还有更多数据
        if (res.data.records && res.data.records.length < 10) {
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
    currentTab.value = 0;
    pageNum.value = 1; // 重置页码为1
    getNetwork();
})

// 引用选择器组件
const datetimePicker = ref(null);

// 筛选相关方法
const showStatusPicker = () => {
    uni.showActionSheet({
        itemList: statusOptions.value.map(item => item.text),
        success: (res) => {
            const selectedOption = statusOptions.value[res.tapIndex];
            onStatusChange(selectedOption.value);
        }
    });
};

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
    height: 100%;
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
                cursor: pointer;
                // 增加点击范围
                padding: 20rpx 30rpx;
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
            background-color: #ffffff;
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
