<!-- 收运详细查看 -->
<template>
    <view class="container">
        <!-- 头部导航 -->
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运记录"
            @clickLeft="back" />

        <!-- 用户信息 -->
        <view class="user-info">
            <view class="name">{{ pageData.driverName }}</view>
            <view class="status-tag" :class="statusClass">{{ statusText }}</view>
        </view>
        <!-- 内容区域 -->
        <view class="content">

            <!-- 基础信息列表 -->
            <view class="info-list">
                <view class="info-item" v-for="(item, index) in infoList" :key="index">
                    <text class="label">{{ item.label }}</text>
                    <text class="value">{{ item.value }}</text>
                </view>
            </view>

            <!-- 照片区域 -->
            <view class="photo-section">
                <text class="photo-title">厨余垃圾照片</text>
                <view class="photo-list">
                    <image v-for="(item, index) in pageData.img" :key="index" class="photo-item" :src="item"
                        mode="aspectFill" @click="previewImage(index)" />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { apiGetDriverPlanById } from '@/api/apis.js'
import { onLoad } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期

// 页面参数
const planId = ref(''); // 车辆ID
const driverId = ref(''); // 司机ID

// 页面数据
const pageData = ref({
    // driverName: '', //司机名称
    // status: null, //状态 0 进行中 1.已完成 2.无法收运 
    // merchantName: '', //商家名称

    // weight: 0.0, //重量
    // bucketNum: 0, //桶数
    // address: '', //地址 
    // registrationNumber: '', //车牌号
    // img: [], //照片数组
    // time: '', // 收运时间
    // estimateTime: '' // 预估时间
});

// 根据状态显示对应的文字
const statusText = computed(() => {
    switch (pageData.value.status) {
        case 0: return '进行中';
        case 1: return '已完成';
        case 2: return '无法收运';
        default: return '';
    }
});

const statusClass = computed(() => {
    switch (pageData.value.status) {
        case 0: return 'processing';
        case 1: return 'completed';
        case 2: return 'cancelled';
        default: return '';
    }
});

// 信息列表配置
const infoList = computed(() => [
    {
        label: '商家名称',
        value: pageData.value.merchantName
    },
    {
        label: '预估时间',
        value: pageData.value.estimateTime
    },
    {
        label: '收运时间',
        value: pageData.value.arrivalTime ?? '', 
    },
    {
        label: '预估重量',
        value: pageData.value.estimateWeight + 'kg' ?? '暂无'
 
    },
    {
        label: '收运重量',
        value: pageData.value.registrationNumber
    },
    {
        label: '预估桶数',
        value: pageData.value.estimateBucketNum ?? 0
    },
    {
        label: '收运桶数',
        value: pageData.value.estimateBucketNum ?? 0
    },
    {
        label: '收运地址',
        value: pageData.value.address ?? '',
    },
    {
        label: '车牌号',
        value: pageData.value.registrationNumber ?? '',
    },
 
    

   

]);

onLoad((options) => {
    if (options.planId) planId.value = options.planId;
    if (options.driverId) driverId.value = options.driverId;

    console.log('接收到的参数:', options);
});

// 页面逻辑
onMounted(() => {
    // 获取收运记录详情
    getSyCheckDetail()
})



//获取收运记录详情
const getSyCheckDetail = async () => {
    const res = await apiGetDriverPlanById({
        driverId: driverId.value,
        id: planId.value
    })

    if (res.code === 200) {
        const data = res.data;

        // 统一更新pageData
        pageData.value = {
            driverName: data.driverName || '',
            status: data.status,
            merchantName: data.merchantName || '',
            estimateWeight: data.estimateWeight || 0.0,
            weight: data.weight || 0.0,
            estimateBucketNum: data.estimateBucketNum || 0,
            bucketNum: data.bucketNum || 0,
            registrationNumber: data.registrationNumber || '',
            img: data.img ? data.img.split(',') : [],
            appointmentTime : data.appointmentTime || '',
            arrivalTime: data.arrivalTime || '',
        };
    }
}
// 返回上一页
const back = () => {
    uni.navigateBack()
}

// 照片预览功能
const previewImage = (index) => {
    uni.previewImage({
        urls: pageData.value.img,
        current: index
    })
}
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $bg-theme-color;
    padding: 0 30rpx;
}

.user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background-color: #ffffff;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    margin-top: 20rpx;
    border-radius: 16rpx;

    .name {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
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

.content {
    padding: 32rpx 0;
    position: relative;
    background-color: #ffffff;
    border-radius: 16rpx;
    margin-top: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

    .info-list {
        padding: 0 30rpx;

        .info-item {
            display: flex;
            margin-bottom: 32rpx;
            padding-bottom: 32rpx;
            border-bottom: 1rpx solid #f0f0f0;

            &:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }

            .label {
                width: 140rpx;
                font-size: 14px;
                color: #999999;
                flex-shrink: 0;
            }

            .value {
                flex: 1;
                font-size: 14px;
                color: #333333;
            }
        }
    }

    .photo-section {
        margin-top: 48rpx;
        padding: 0 30rpx;

        .photo-title {
            font-size: 14px;
            color: #999999;
            margin-bottom: 24rpx;
            display: block;
        }

        .photo-list {
            display: flex;
            gap: 20rpx;

            .photo-item {
                width: 186rpx;
                height: 186rpx;
                border-radius: 8rpx;
                box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
            }
        }
    }
}
</style>