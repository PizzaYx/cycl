<!-- 收运记录-->
<template>
    <view class="container">
        <PageHeader title="收运记录" @back="back" />
        <view class="menu">
            <view class="search-container">
                <view class="search-box">
                    <uni-icons type="search" size="24" color="#999" class="search-icon"></uni-icons>
                    <input class="search-input" placeholder="搜索店铺/商铺关键词" v-model="searchKeyword" @confirm="onSearch" />
                    <uni-icons v-if="searchKeyword" type="clear" size="20" color="#999" class="clear-icon"
                        @click="clearSearch"></uni-icons>
                </view>
            </view>
            <view class="tab-bar">
                <view v-for="(tab, index) in tabs" :key="index" class="tab-item"
                    :class="{ active: currentTab === index }" @click="handleTabClick(index)">
                    {{ tab.value }}
                    <!-- 为预约中tab添加uni-badge -->
                    <uni-badge v-if="tab.value === '待处理' && bookingBadgeText !== 0" class="uni-badge" type="error"
                        :text="bookingBadgeText" :is-dot="false" absolute="rightTop" :offset="[-5, -12]"></uni-badge>

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
                                <DriverStatusTag :status="item.status" />
                            </view>
                        </view>
                        <view class="order-content">
                            <InfoDisplay :fields="getInfoFields(item)" />
                        </view>
                        <DriverOrderActions :status="item.status" :order-data="item" @refresh="handleRefresh"
                            @abnormalReport="handleAbnormalReport" />
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

        <!-- 异常上报弹窗 -->
        <AbnormalReportModal :show="showAbnormalModal" :order-data="currentOrderData" @close="closeAbnormalModal"
            @success="handleAbnormalSuccess" />
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
    apiGetDriverPlanPage, apiGetnoNeedCollect, apiGetdriverConfirmPlan, apiGetDriverNotConfirmNum
} from '@/api/apis.js';

import { onShow } from '@dcloudio/uni-app' // 导入onShow生命周期
import DriverStatusTag from '@/components/DriverStatusTag/DriverStatusTag.vue'
import InfoDisplay from '@/components/InfoDisplay/InfoDisplay.vue'
import DriverOrderActions from '@/components/DriverOrderActions/DriverOrderActions.vue'
import AbnormalReportModal from '@/components/AbnormalReportModal/AbnormalReportModal.vue'
import PageHeader from '@/components/PageHeader/PageHeader.vue'
import { formatWeight, formatNum } from '@/utils/orderUtils'
import { useUserStore } from '@/stores/user.js'


const tabs = [{ key: "3", value: "历史记录" }, { key: "0", value: "待处理" }, { key: "1", value: "已完成" }];
//下标
const currentTab = ref(1);

// 当前选中tab的status值（转换为整数）
const currentStatusKey = computed(() => parseInt(tabs[currentTab.value].key));

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

// 页面显示时刷新数据
onShow(async () => {
    console.log('页面显示时刷新数据')
    getDriverNotConfirmNum();
    getNetwork();
})

// 处理异常上报后的刷新
const handleRefresh = async () => {
    try {
        // 重置页码并重新获取数据
        allOrderList.value = [];
        pageNum.value = 1;
        await getNetwork();
        await getDriverNotConfirmNum();
    } catch (error) {
        console.error('刷新数据失败:', error)
    }
}

// 异常上报相关变量
const showAbnormalModal = ref(false)
const currentOrderData = ref(null)

// 处理异常上报事件
const handleAbnormalReport = (orderData) => {
    console.log('异常上报事件', orderData)
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



// 按钮点击事件处理函数已封装到 DriverOrderActions 组件中

// 添加badgeText的ref变量
const bookingBadgeText = ref(0);

const getDriverNotConfirmNum = async () => {
    const res = await apiGetDriverNotConfirmNum({
        driverId: userStore.currentDriver?.id
    });
    if (res.code === 200) {
        bookingBadgeText.value = res.data ?? 0;
    }
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
            driverId: userStore.currentDriver?.id,
            status: currentStatusKey.value // 使用当前选中tab对应的整数类型
        };

        // 添加搜索关键词
        if (searchKeyword.value) {
            params.title = searchKeyword.value;
        }

        const res = await apiGetDriverPlanPage(params);


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

// 搜索方法
const onSearch = () => {

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
    getDriverNotConfirmNum()
})

// 组件挂载时初始化数据
onMounted(() => {
    pageNum.value = 1;
    getNetwork();
    getDriverNotConfirmNum()
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

        .tab-bar {
            display: flex;
            height: 68rpx;
            margin-top: 20rpx;

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
                    bottom: -20rpx;
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
}
</style>
