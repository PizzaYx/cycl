<!-- 收运详细查看 -->
<template>
    <view class="container">
        <!-- 头部导航 -->
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运记录"
            @clickLeft="back" />

        <!-- 用户信息 -->
        <view class="user-info">
            <view class="name">{{ driverName }}</view>
            <view class="status-tag" :class="statusClass">{{ statusText }}</view>
        </view>
        <!-- 内容区域 -->
        <view class="content">

            <!-- 基础信息列表 -->
            <view class="info-list">
                <view class="info-item">
                    <text class="label">收运时间</text>
                    <text class="value">{{ time }}</text>
                </view>
                <view class="info-item">
                    <text class="label">商家名称</text>
                    <text class="value">{{ merchantName }}</text>
                </view>
                <view class="info-item">
                    <text class="label">{{ status === 1 ? '收运重量' : '预估重量' }}</text>
                    <text class="value">{{ weight }}KG</text>
                </view>
                <view class="info-item">
                    <text class="label">{{ status === 1 ? '收运桶数' : '预估桶数' }}</text>
                    <text class="value">{{ bucketNum }}桶</text>
                </view>
                <view class="info-item">
                    <text class="label">收运地址</text>
                    <text class="value">{{ address }}</text>
                </view>
                <view class="info-item">
                    <text class="label">车牌号</text>
                    <text class="value">{{ registrationNumber }}</text>
                </view>
            </view>

            <!-- 照片区域 -->
            <view class="photo-section">
                <text class="photo-title">厨余垃圾照片</text>
                <view class="photo-list">
                    <image v-for="(item, index) in img" :key="index" class="photo-item"
                        :src="item" mode="aspectFill" @click="previewImage(index)" />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { apiGetDriverPlanById } from '@/api/apis.js'
import { onLoad } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期
// 新增接收页面参数的变量
const planId = ref(''); // 车辆ID
const driverId = ref(''); // 司机ID

//页面显示参数
const driverName = ref(''); //司机名称
const status = ref();//状态 0 进行中 1.已完成 2.无法收运 
const merchantName = ref('');//商家名称
const weight = ref(0.0);//重量  状态1接收weight     其他状态接收   estimateWeight
const bucketNum = ref(0);//桶数 状态1接收bucketNum 其他状态接收estimateBucketNum
const address = ref('');//地址 
const registrationNumber = ref(''); //车牌号
const img = ref([]);//照片 ,分隔的图片
const time = ref(''); // 收运时间

// 根据状态显示对应的文字
const statusText = computed(() => {
    switch(status.value) {
        case 0: return '进行中';
        case 1: return '已完成';
        case 2: return '无法收运';
        default: return '';
    }
});

const statusClass = computed(() => {
    switch(status.value) {
        case 0: return 'processing';
        case 1: return 'completed';
        case 2: return 'cancelled';
        default: return '';
    }
});

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

//获取商户首页数据统计
const getSyCheckDetail = async () => {
    const res = await apiGetDriverPlanById({
        driverId: driverId.value,
        id: planId.value
    })

    if (res.code === 200) {
        // 设置司机名称
        driverName.value = res.data.driverName || '';
        // 设置状态
        status.value = res.data.status;
        // 设置商家名称
        merchantName.value = res.data.merchantName || '';
        // 根据状态设置重量和桶数
        if (res.data.status === 1) {
            // 状态1使用实际重量和桶数
            weight.value = res.data.weight || 0.0;
            bucketNum.value = res.data.bucketNum || 0;
        } else {
            // 其他状态使用预估重量和桶数
            weight.value = res.data.estimateWeight || 0.0;
            bucketNum.value = res.data.estimateBucketNum || 0;
        }
        // 设置地址
        address.value = res.data.address || '';
        // 设置车牌号
        registrationNumber.value = res.data.registrationNumber || '';
        // 设置照片
        img.value = res.data.img ? res.data.img.split(',') : [];
        // 根据状态获取不同的时间字段
        if (res.data.status === 1) {
            // 状态1使用实际收运时间(arrivalTime)
            time.value = res.data.arrivalTime || '';
        } else {
            // 其他状态使用预约时间(appointmentTime)
            time.value = res.data.appointmentTime || '';
        }
    }
}
// 返回上一页
const back = () => {
    uni.navigateBack()
}

// 照片预览功能
const previewImage = (index) => {
    uni.previewImage({
        urls: img.value,
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