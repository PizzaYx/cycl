<!-- 收运详情 -->
<template>
    <view class="container">
        <view class="headImage">
            <image src="/static/headTopBg.png" mode="aspectFill"></image>
        </view>
        <uni-nav-bar dark :fixed="true" :background-color="navBarBgColor" status-bar left-icon="left" color="#000"
            title="今日收运详情" @clickLeft="back" />
        <view class="header-progress-container">
            <view class="header">
                <view class="driver-info">
                    <view class="info-item">
                        <uni-text class="label">司机名称：</uni-text>
                        <uni-text class="value">{{ name }}</uni-text>
                    </view>
                    <view class="info-item">
                        <uni-text class="label">车牌号：</uni-text>
                        <uni-text class="value">{{ registrationNumber }}</uni-text>
                    </view>
                    <view class="info-item">
                        <uni-text class="label">日期：</uni-text>
                        <uni-text class="value">{{ currentDate }}</uni-text>
                    </view>
                    <view class="info-item">
                        <uni-text class="label">垃圾桶数：</uni-text>
                        <uni-text class="value">{{ bucketNum }}个</uni-text>
                    </view>
                </view>
            </view>
            <view class="divider"></view>
            <view class="progress-section">
                <view class="progress-title">收运完成率</view>
                <view class="progress-content">
                    <view class="progress-bar">
                        <view class="progress-fill" :style="{ width: progressPercentage + '%' }">
                            <view class="progress-bubble">
                                <image src="/static/ssd/bubble.png" mode="aspectFill"></image>
                                <view class="bubble-text">{{ progressPercentage }}%</view>
                            </view>
                        </view>
                    </view>
                    <view class="progress-stats">
                        <view class="stat-item">
                            <view class="label-with-color">
                                <view class="color-tag blue"></view>
                                <uni-text class="label">总重量</uni-text>
                            </view>
                            <uni-text class="value">{{ weightNum }} kg</uni-text>
                        </view>
                        <view class="stat-item">
                            <view class="label-with-color">
                                <view class="color-tag green"></view>
                                <uni-text class="label">已收运商家</uni-text>
                            </view>
                            <uni-text class="value">{{ confirmNum }} 个</uni-text>

                        </view>
                        <view class="stat-item">
                            <view class="label-with-color">
                                <view class="color-tag orange"></view>
                                <uni-text class="label">未收运商家</uni-text>
                            </view>
                            <uni-text class="value">{{ notConfirmNum }} 个</uni-text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="weight-section">
            <uni-text class="weight-header">过磅信息 </uni-text>
            <view class="weight-content">
                <image src="/static/ssd/gbicon.png" mode="aspectFill"></image>
                <uni-text class="weight-title">重量：</uni-text>
                <input class="weight-input" type="number" v-model="weightInput" placeholder="0" disabled />
                <uni-text class="weight-unit">kg</uni-text>
                <uni-button size="mini" type="primary" class="tj-btn" @tap="handleSubmitWeight()">获取重量</uni-button>
            </view>
        </view>

        <view class="abnormal-section" v-if="abnormalList.length > 0">
            <view class="abnormal-item">
                <image src="/static/ssd/warning.png" mode="aspectFill"></image>
                <uni-text class="abnormal-label">异常:</uni-text>
                <swiper class="abnormal-swiper" :autoplay="abnormalList.length > 1" :interval="3000" :duration="500"
                    :circular="true" :vertical="true" :indicator-dots="false" :display-multiple-items="1"
                    :touchable="false" :disable-touch="true">
                    <swiper-item v-for="(item, index) in abnormalList" :key="index">
                        <view class="abnormal-text-wrapper">
                            <uni-text class="abnormal-text">{{ item.merchantName }}连续 {{ item.notCollectNum }}
                                次未收运</uni-text>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
        </view>

        <view class="collection-info-section">
            <view class="collection-info">
                <uni-text class="info-title">收运信息</uni-text>
                <uni-button size="mini" type="primary" class="contact-btn" @tap="contactLine()">查看线路</uni-button>
            </view>
            <view class="map-container">
                <map class="location-map" :longitude="currentLocation.longitude" :latitude="currentLocation.latitude"
                    :markers="markers" :show-location="true" :enable-zoom="true" :enable-scroll="true">
                </map>
            </view>
        </view>

        <view class="task-list">
            <view class="task-item" v-for="(task, index) in taskList" :key="task.id" :style="{
                '--line-top-height': getLinePositions(index).topHeight + 'rpx',
                '--line-bottom-top': getLinePositions(index).bottomTop + 'rpx'
            }">
                <view class="task-header">
                    <view class="time-info">
                        <view class="icon-container">
                            <uni-icons type="circle-filled"
                                :color="index === 0 ? 'rgba(7, 193, 96, 1)' : 'rgba(61, 61, 61, 0.50)'"
                                :size="index === 0 ? ICON_SIZE.first : ICON_SIZE.normal">
                            </uni-icons>
                        </view>
                        <uni-text class="date">{{ task.appointmentTime }}</uni-text>
                    </view>
                    <DriverStatusTag :status="task.status" />
                </view>
                <view class="divider"></view>
                <view class="task-content">
                    <InfoDisplay :fields="getInfoFields(task)" :show-bottom-border="false" :showTopBorder="false"
                        :enable-address-navigation="true" />
                </view>
                <DriverOrderActions :status="task.status" :order-data="task" @refresh="handleRefresh"
                    @abnormalReport="handleAbnormalReport" />
            </view>
        </view>
        <view class="headImage">
            <image src="/static/headTopBg.png" mode="aspectFill"></image>
        </view>

        <!-- 异常上报弹窗 -->
        <AbnormalReportModal :show="showAbnormalModal" :order-data="currentOrderData" @close="closeAbnormalModal"
            @success="handleAbnormalSuccess" />
    </view>

</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow, onPageScroll } from '@dcloudio/uni-app' // 导入onShow和onPageScroll生命周期
import { useUserStore } from '@/stores/user.js'
import { apiGetDriverInfo, apiGetDriverTodayPlan, apiGetnoNeedCollect, apiGetCarWeight, apiGetAbnormalPlan } from '@/api/apis.js'
import DriverStatusTag from '@/components/DriverStatusTag/DriverStatusTag.vue'
import DriverOrderActions from '@/components/DriverOrderActions/DriverOrderActions.vue'
import InfoDisplay from '@/components/InfoDisplay/InfoDisplay.vue'
import AbnormalReportModal from '@/components/AbnormalReportModal/AbnormalReportModal.vue'
import { formatWeight, formatNum } from '@/utils/orderUtils'

// 获取当前日期并格式化为 YYYY-MM-DD 格式
const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const userStore = useUserStore()
const weightNum = ref(0) // 已收运总量
const notConfirmNum = ref(0) // 未收运
const confirmNum = ref(0) // 已收运
const bucketNum = ref(0) // 垃圾桶数
const registrationNumber = ref('') // 车牌号
const name = ref('') // 司机名称
const currentDate = getCurrentDate() // 当前日期
const weightInput = ref('') // 重量输入框的值
const allCarId = ref(0)//车辆Id
const allRecordNo = ref('')//运单号
const navBarBgColor = ref('transparent') // 导航栏背景色

const taskList = ref([]) // 任务列表
const abnormalList = ref([]) // 异常列表

// 地图相关数据
const currentLocation = ref({
    longitude: 104.066, // 默认经度
    latitude: 30.5728   // 默认纬度
})
const markers = ref([]) // 地图标记点

// 图标大小配置
const ICON_SIZE = {
    first: 25,  // 第一个图标大小
    normal: 20  // 普通图标大小
}

// 计算连接线位置
const getLinePositions = (index) => {
    const iconSize = index === 0 ? ICON_SIZE.first : ICON_SIZE.normal
    const containerHeight = 50 // 容器高度
    const containerCenter = containerHeight / 2 // 容器中心位置 25rpx
    const iconRadius = iconSize / 2

    // 分析布局结构：
    // task-item (padding: 30rpx)
    //   └── task-header (margin-bottom: 20rpx)
    //       └── time-info (align-items: center)
    //           └── icon-container (50rpx × 50rpx, margin-left: -5rpx)
    //               └── 图标 (居中)

    // 从task-item顶部到图标顶部的距离：
    const taskItemPadding = 30 // task-item的padding
    const taskHeaderMarginBottom = 20 // task-header的margin-bottom
    const timeInfoHeight = 50 // time-info的高度（与icon-container相同）
    const timeInfoTop = (timeInfoHeight - containerHeight) / 2 // time-info在task-header中的垂直居中位置
    const topToIconTop = taskItemPadding + timeInfoTop + containerCenter - iconRadius

    return {
        topHeight: topToIconTop, // 上半段高度：从task-item顶部到图标顶部
        bottomTop: topToIconTop + iconSize  // 下半段起始位置：从task-item顶部到图标底部
    }
}

// 获取当前定位
const getCurrentLocation = () => {
    uni.getLocation({
        type: 'gcj02',
        success: (res) => {
            currentLocation.value = {
                longitude: res.longitude,
                latitude: res.latitude
            }
            // 设置当前位置标记
            markers.value = [{
                id: 1,
                longitude: res.longitude,
                latitude: res.latitude,
                title: '当前位置',
                iconPath: '/static/ssd/positioning.png',
                width: 30,
                height: 30
            }]
            console.log('获取定位成功:', res)
        },
        fail: (err) => {
            console.error('获取定位失败:', err)
            uni.showToast({
                title: '获取定位失败',
                icon: 'none'
            })
        }
    })
}

// 计算进度百分比
const progressPercentage = computed(() => {

    if (confirmNum.value === 0 && weightNum.value === 0) return 0;
    return Math.round((confirmNum.value / (confirmNum.value + notConfirmNum.value)) * 100);
});


// 统一调用所有接口的函数
const loadAllData = async () => {
    getCurrentLocation(); // 获取当前定位
    try {
        // 需要调用的接口列表（方便修改查看）
        await Promise.all([
            getapiGetDriverInfo(),
            getapiGetDriverTodayPlan(),
            getapiGetAbnormalPlan()
        ]);
    } catch (error) {
        console.error('加载数据失败:', error);
    }
};

onMounted(async () => {
    // 页面加载时的逻辑
    try {
        // const userInfo = await userStore.ensureUserInfo()
        // if (userInfo === null) {
        //     // 用户未登录，已跳转到登录页，不需要继续执行
        //     console.log('用户未登录，已跳转到登录页')
        //     return
        // }
        // await loadAllData();

    } catch (error) {
        // 其他非401错误的处理
        console.error('页面初始化失败:', error)
    }
})

// 根据状态获取信息字段
const getInfoFields = (task) => {
    const status = task.status;

    // 状态为 0（进行中）或 2（无法收运）时显示预估信息
    if (status === 0 || status === '0' || status === 2 || status === '2') {
        return [
            {
                key: 'merchantName',
                label: '商户名称',
                value: task.merchantName
            },
            {
                key: 'estimateWeight',
                label: '预估重量',
                value: formatWeight(task.estimateWeight)
            },
            {
                key: 'estimateBucketNum',
                label: '预估桶数',
                value: formatNum(task.estimateBucketNum)
            },
            {
                key: 'address',
                label: '地址',
                value: task.address,
                taskData: task // 传递完整的任务数据，包含经纬度信息
            }
        ];
    }

    // 状态为 1（已完成）时显示收运信息
    if (status === 1 || status === '1') {
        return [
            {
                key: 'merchantName',
                label: '商户名称',
                value: task.merchantName
            },
            {
                key: 'weight',
                label: '收运重量',
                value: formatWeight(task.weight)
            },
            {
                key: 'bucketNum',
                label: '收运桶数',
                value: formatNum(task.bucketNum)
            },
            {
                key: 'address',
                label: '地址',
                value: task.address,
                taskData: task // 传递完整的任务数据，包含经纬度信息
            }
        ];
    }

    // 默认返回预估信息
    return [
        {
            key: 'merchantName',
            label: '商户名称',
            value: task.merchantName
        },
        {
            key: 'estimateWeight',
            label: '预估重量',
            value: formatWeight(task.estimateWeight)
        },
        {
            key: 'estimateBucketNum',
            label: '预估桶数',
            value: formatNum(task.estimateBucketNum)
        },
        {
            key: 'address',
            label: '地址',
            value: task.address
        }
    ];
};

// 页面显示时刷新数据
onShow(async () => {
    console.log('页面显示时刷新数据')
    await loadAllData();
    getCurrentLocation(); // 获取当前定位
})

// 处理异常上报后的刷新
const handleRefresh = async () => {
    try {
        // 重新加载所有数据
        await loadAllData();
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

// 任务操作逻辑已完全封装到 DriverOrderActions 组件中

// 注册页面滚动监听
onPageScroll((e) => {
    const scrollTop = e.scrollTop;
    // 当滚动超过背景图片高度时，显示白色背景
    if (scrollTop > 20) {
        navBarBgColor.value = '#fff';
    } else {
        navBarBgColor.value = 'transparent';
    }
})


//获取今日统计信息
const getapiGetDriverInfo = async () => {
    try {
        const res = await apiGetDriverInfo({
            driverId: userStore.sfmerchant?.id,
        })

        if (res.code === 200) {
            if (res.data === null)
                return;
            confirmNum.value = res.data.confirmNum ?? 0;
            notConfirmNum.value = res.data.notConfirmNum ?? 0;
            weightNum.value = res.data.weightNum ?? 0;

            bucketNum.value = res.data.bucketNum ?? 0;
            registrationNumber.value = res.data.registrationNumber;
            name.value = res.data.name;
            allCarId.value = res.data.carId;
            allRecordNo.value = res.data.crecordNo;
        } else {
            console.error('获取司机信息失败:', res.message || '未知错误');
        }
    } catch (error) {
        console.error('获取司机信息异常:', error);
    }
}

//司机今日收运管理列表
const getapiGetDriverTodayPlan = async () => {
    try {
        const res = await apiGetDriverTodayPlan({
            driverId: userStore.sfmerchant?.id,
            page: 1,
        })
        // status  0进行中  1已完成  2无需收运
        if (res.code === 200) {
            taskList.value = res.data;
        } else {
            console.error('获取今日收运计划失败:', res.message || '未知错误');
        }
    } catch (error) {
        console.error('获取今日收运计划异常:', error);
    }
}

//获取异常计划列表
const getapiGetAbnormalPlan = async () => {
    try {
        const res = await apiGetAbnormalPlan({
            driverId: userStore.sfmerchant?.id,
        })
        if (res.code === 200) {
            abnormalList.value = res.data || [];
        } else {
            console.error('获取异常计划失败:', res.message || '未知错误');
            abnormalList.value = [];
        }
    } catch (error) {
        console.error('获取异常计划异常:', error);
        abnormalList.value = [];
    }
}




// 原来的方法已封装到 DriverOrderActions 组件中



const contactLine = () => {
    console.log('查看线路');

    const mapData = {
        taskList: taskList.value,
        driverName: name.value,
        registrationNumber: registrationNumber.value,
        bucketNum: bucketNum.value,
        currentDate: currentDate
    };

    // 简单直接：先存储数据再跳转
    uni.setStorageSync('mapData', mapData);
    console.log('数据已存储，跳转页面');

    uni.navigateTo({
        url: '/pages/collection/syAllMap'
    });
};

// 获取重量
const handleSubmitWeight = async () => {
    uni.showModal({
        title: '注意!',
        content: '需要车辆过磅后才能获取重量!',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: async (res) => {
            if (res.confirm) {
                try {
                    const result = await apiGetCarWeight({
                        driverId: userStore.sfmerchant?.id
                    });

                    if (result.code === 200) {
                        if (result.data && result.data.weight) {
                            weightInput.value = result.data.weight;
                            uni.showToast({
                                title: '获取重量成功',
                                icon: 'success'
                            });
                        } else {
                            uni.showToast({
                                title: '暂无过磅重量数据',
                                icon: 'none'
                            });
                        }
                    } else {
                        uni.showToast({
                            title: result.message || '获取重量失败',
                            icon: 'none'
                        });
                    }
                } catch (error) {
                    uni.showToast({
                        title: '获取重量失败，请确保车辆已过磅',
                        icon: 'none'
                    });
                    console.error('获取重量失败:', error);
                }
            }
        }
    });
};

// 返回上一页
const back = () => {
    uni.navigateBack();
};


// 组件逻辑
</script>



<style scoped lang="scss">
.container {
    background-color: $bg-theme-color;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 0 30rpx 30rpx;
    position: relative;

    .header-progress-container {
        background: #FFFFFF;
        border-radius: 20rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        margin-top: 20rpx;
        position: relative;
        z-index: 1;
    }

    .header {
        background: none;
        border-radius: 0;
        padding: 0;
        margin-bottom: 0;

        .header-title {
            margin-bottom: 20rpx;

            .title {
                font-size: 16px;
                font-weight: 500;
                color: #333333;
            }
        }

        .driver-info {
            display: flex;
            flex-direction: column;
            gap: 10rpx;

            .info-item {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .label {
                    color: rgba(61, 61, 61, 0.50);
                    font-size: 28rpx;
                }

                .value {
                    color: rgba(61, 61, 61, 1);
                    font-size: 28rpx;
                }

            }
        }
    }

    .divider {
        height: 2rpx;
        background-color: #f0f0f0;
        margin: 20rpx 0;
    }

    .progress-section {
        background: none;
        border-radius: 0;
        padding: 0;
        margin-bottom: 0;


        .progress-title {
            font-size: 28rpx;
            color: rgba(61, 61, 61, 1);

        }

        .progress-content {
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-top: 66rpx;


            .progress-bar {
                width: 650rpx;
                height: 20rpx;
                background-color: rgba(7, 193, 96, 0.10);
                border-radius: 20rpx;
                overflow: visible;
                position: relative;
                margin-bottom: 40rpx;

                .progress-fill {
                    height: 100%;
                    background-color: #07C160;
                    border-radius: 20rpx;
                    transition: width 0.3s ease;
                    position: relative;

                    .progress-bubble {
                        position: absolute;
                        right: -32rpx;
                        top: -60rpx;
                        width: 68rpx;
                        height: 50rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        image {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            left: 0;
                        }

                        .bubble-text {
                            font-size: 24rpx;
                            color: rgba(7, 193, 96, 1);
                            font-weight: bold;
                            z-index: 1;
                            position: relative;
                            transform: translateY(-10rpx);
                        }
                    }
                }
            }

            .progress-text {
                text-align: center;

                .percentage {
                    font-size: 48rpx;
                    color: #07C160;
                    font-weight: 400;
                    display: block;
                }

                .label {
                    font-size: 24rpx;
                    color: rgba(61, 61, 61, 0.50);
                }
            }


            .progress-stats {
                flex: 1;
                display: flex;
                gap: 20rpx;

                .stat-item {
                    width: 204rpx;
                    height: 108rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    background: rgba(245, 245, 247, 1);

                    .label-with-color {
                        display: flex;
                        align-items: center;
                        gap: 10rpx;

                        .color-tag {
                            width: 4rpx;
                            height: 20rpx;
                            border-radius: 2rpx;

                            &.blue {
                                background-color: rgba(0, 170, 255, 1);
                            }

                            &.green {
                                background-color: rgba(7, 193, 96, 1);
                            }

                            &.orange {
                                background-color: rgba(255, 161, 0, 1);
                            }
                        }

                        .label {
                            font-size: 24rpx;
                            color: rgba(61, 61, 61, 0.50);
                            z-index: 1;
                            text-align: center;
                        }
                    }

                    .value {
                        font-size: 32rpx;
                        font-weight: bold;
                        display: block;
                        z-index: 1;
                        text-align: center;

                    }


                }
            }
        }
    }

    .weight-section {
        background: #FFFFFF;
        border-radius: 20rpx;
        padding: 30rpx;
        margin-bottom: 10rpx;
        position: relative;
        z-index: 1;

        .weight-header {
            font-size: 28rpx;
            color: rgba(61, 61, 61, 1);
            display: block;
            margin-bottom: 20rpx;
        }

        .weight-content {
            display: flex;
            align-items: center;

            image {
                width: 80rpx;
                height: 80rpx;
                margin-right: 40rpx;
            }

            .weight-title {
                font-size: 14px;
                color: #333333;
            }

            .weight-input {
                margin: 0 10rpx;
                padding: 10rpx 20rpx;
                border-bottom: 1rpx solid #ddd;
                font-size: 14px;
                width: 120rpx;
                text-align: center;
            }

            .weight-unit {
                font-size: 28rpx;
                color: #999999;
                margin-left: 10rpx;
            }

            .weight-btn {
                margin-left: auto;
                background-color: #00B578;
            }
        }


        .tj-btn {
            margin-left: auto;
            color: #07C160;
            border-radius: 100rpx;
            padding: 6rpx 20rpx;
            border: 2rpx solid #07C160;
            font-size: 26rpx;
        }
    }

    .abnormal-section {
        background: #FFFFFF;
        border-radius: 16rpx;
        margin: 20rpx 0;
        position: relative;
        z-index: 1;
        height: 60rpx;
        overflow: hidden;
        /* 禁用交互 */
        pointer-events: none;
        user-select: none;

        .abnormal-item {
            display: flex;
            align-items: center;
            gap: 10rpx;
            height: 60rpx;
            padding: 0 20rpx;

            image {
                width: 32rpx;
                height: 32rpx;
            }

            .abnormal-label {
                font-size: 26rpx;
                color: rgba(61, 61, 61, 1);
                flex-shrink: 0;
            }

            .abnormal-swiper {
                flex: 1;
                height: 100%;

                .abnormal-text-wrapper {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }

                .abnormal-text {
                    font-size: 26rpx;
                    color: rgba(61, 61, 61, 1);
                    line-height: 1.2;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }

    .collection-info-section {
        background: #FFFFFF;
        border-radius: 20rpx 20rpx 0 0;
        padding: 30rpx;
        margin-top: 20rpx;
        border-bottom: 1rpx solid rgba(216, 216, 216, 0.5);

        .collection-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20rpx;

            .info-title {
                font-size: 28rpx;
                color: rgba(61, 61, 61, 1);
                font-weight: 500;
            }

            .contact-btn {
                color: #07C160;
                border-radius: 100rpx;
                padding: 6rpx 20rpx;
                border: 2rpx solid #07C160;
                font-size: 26rpx;
            }
        }

        .map-container {
            width: 645rpx;
            height: 368rpx;
            border-radius: 20rpx;
            overflow: hidden;

            .location-map {
                width: 100%;
                height: 100%;
            }
        }
    }

    .task-list {
        margin-top: 0;
        position: relative;
        z-index: 1;
        background: #FFFFFF;
        border-radius: 0 0 20rpx 20rpx;
        overflow: hidden;
        /* 移除左右内边距，因为任务项本身已经有30rpx的padding */

        /* 移除整体时间轴线，改用分段方式 */

        .task-item {
            background: #FFFFFF;
            border-radius: 0;
            padding: 30rpx;
            margin-top: 0;

            margin-bottom: 0;
            /* 移除任务项之间的间隔，让图标可以连线 */
            position: relative;
            z-index: 1;

            /* 为除了第一个task-item添加上半段线条（从item顶部到uni-icons顶部） */
            &:not(:first-child)::before {
                content: '';
                position: absolute;
                left: 50rpx;
                /* 图标容器中心位置 */
                top: 0;
                width: 2rpx;
                height: var(--line-top-height, 15rpx);
                /* 预计算的高度：容器中心(25rpx) - 图标半径 */
                background-color: rgba(216, 216, 216, 0.8);
                z-index: 1;
            }

            /* 为除了最后一个task-item添加下半段线条（从uni-icons底部到item底部） */
            &:not(:last-child)::after {
                content: '';
                position: absolute;
                left: 50rpx;
                /* 图标容器中心位置 */
                top: var(--line-bottom-top, 35rpx);
                width: 2rpx;
                height: calc(100% - var(--line-bottom-top, 35rpx));
                /* 预计算：从图标底部到item底部 */
                background-color: rgba(216, 216, 216, 0.8);
                z-index: 1;
            }

            .task-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20rpx;

                .time-info {
                    display: flex;
                    align-items: center;
                    gap: 25rpx;
                    /* 确保icon与时间文本之间有25rpx间距 */
                    position: relative;
                    z-index: 10;
                    /* 设置高层级，确保图标在时间线之上 */

                    .icon-container {
                        width: 50rpx;
                        height: 50rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        margin-left: -5rpx;
                    }


                    .date {
                        font-size: 28rpx;
                        color: #666666;
                    }
                }

            }

            .divider {
                height: 2rpx;
                background-color: #f0f0f0;
                margin: 22rpx 22rpx 0 55rpx;
            }

            .task-content {
                margin: 22rpx 22rpx 0 55rpx;
            }

        }
    }

    .headImage {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 442rpx;
        z-index: 0;
        overflow: hidden;

        image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}

/* 确保页面背景色始终正确显示 */
page {
    background-color: #F5F5F5;
    height: 100%;
}

body {
    background-color: #F5F5F5;
}
</style>