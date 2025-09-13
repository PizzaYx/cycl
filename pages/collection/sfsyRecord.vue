<!-- 收运记录-->
<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运记录"
            @clickLeft="back" />
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
                    <uni-badge v-if="tab.value === '待处理' && bookingBadgeText !== 0 "
                        class="uni-badge" type="error" :text="bookingBadgeText" :is-dot="false" absolute="rightTop"
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
                                <text class="shop-name">{{ item.merchantName}}</text>
                                <text class="status-tag" :class="getStatusClass(item.status)">
                                    {{ getStatusText(item.status) }}
                                </text>
                            </view>
                        </view>
                        <view class="order-content">
                            <view class="info-item">
                                <text class="label">预估时间:</text>
                                <text class="value">{{ item.appointmentTime ??'暂无' }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">收运时间:</text>
                                <text class="value">{{ item.arrivalTime ??'暂无'}}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">预估重量:</text>
                                <text class="value">{{ (item.estimateWeight +'kg') ??'暂无' }}</text>
                            </view>
                            <view class="info-item">
                                <text class="label">收运重量:</text>
                                <text class="value">{{ item.weight ? (item.weight + 'kg') :'暂无' }}</text>
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
                                <uni-button size="mini" type="default" class="btn-cancel" @tap="handleCancel(item)">
                                    取消
                                </uni-button>
                                <uni-button size="mini" type="primary" class="btn-confirm"
                                    @tap="handleConfirmTransport(item)">
                                    收运
                                </uni-button>
                            </template>
                            <template v-else>
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
    apiGetDriverPlanPage, apiGetnoNeedCollect, apiGetdriverConfirmPlan, apiGetDriverNotConfirmNum
} from '@/api/apis.js';

import { useUserStore } from '@/stores/user.js'


const tabs = [{ key: "3", value: "历史记录" }, { key: "0", value: "待处理" }, { key: "1", value: "已完成" }];
//下标
const currentTab = ref(0);

// 当前选中tab的status值（转换为整数）
const currentStatusKey = computed(() => parseInt(tabs[currentTab.value].key));

// 筛选相关状态
const searchKeyword = ref(''); // 搜索关键词

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
                    driverId: userStore.merchant?.id || 5
                }).then((res) => {
                    if (res.code === 200) {
                        uni.showToast({
                            title: res.message || '操作成功',
                            icon: 'success'
                        });
                        // 刷新任务列表
                        clearSearch();
                    } else {
                        uni.showToast({
                            title: res.message || '操作失败',
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
    console.log('收运:', task.id);
    //先判断task.weight是否大于0 he task.bucketNum是否大于0
    if (task.weight > 0 && task.bucketNum > 0) {
        //确认收运完成
        uni.showModal({
            title: '确认收运完成',
            content: '是否确认收运完成？',
            success: async (res) => {
                if (res.confirm) {
                    await apiGetdriverConfirmPlan({
                        id: task.id,
                        driverId: userStore.sfmerchant?.id || 5,
                    }).then((res) => {
                        if (res.code === 200) {
                            uni.showToast({
                                title: res.message || '操作成功',
                                icon: 'success'
                            });
                            // 刷新任务列表
                            clearSearch();
                        } else {
                            uni.showToast({
                                title: res.message || '操作失败',
                                icon: 'error'
                            });
                        }
                    })
                }
            }
        })

    }
    else {
        uni.showToast({
            title: '请先进行 收运上报 操作',
            icon: 'none'
        });
        return;
    }
};

// 添加badgeText的ref变量
const bookingBadgeText = ref(0);

const getDriverNotConfirmNum = async () => {
    const res = await apiGetDriverNotConfirmNum({
        driverId: userStore.merchant?.id || 5
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
            driverId: userStore.merchant?.id || 5,
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

                            .status-tag {
                                font-size: 12px;
                                width: 100rpx;
                                height: 40rpx;
                                border-radius: 8rpx;
                                display: flex;
                                align-items: center;
                                justify-content: center;

                                &.processing {
                                    color: rgba(0, 170, 255, 1);
                                    background: rgba(0, 170, 255, 0.10);
                                }

                                &.completed {
                                    color: rgba(255, 161, 0, 1);
                                    background: rgba(255, 161, 0, 0.10);
                                }

                                &.cancelled {
                                    color: rgba(61, 61, 61, 0.50);
                                    background: rgba(153, 153, 153, 0.1);
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
    }
</style>
