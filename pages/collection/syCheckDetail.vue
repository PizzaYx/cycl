<!-- 收运记录详细 -->
<template>
    <view class="container">
        <!-- 头部导航 -->
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运记录详细"
            @clickLeft="back" />

        <!-- 用户信息 -->
        <view class="user-info">
            <view class="name">{{ pageData.driverName }}</view>
            <DriverStatusTag :status="pageData.status" />
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

        </view>
    </view>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { apiGetDriverPlanById } from '@/api/apis.js'
import { onLoad } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期
import DriverStatusTag from '@/components/DriverStatusTag/DriverStatusTag.vue'
import { formatWeight, formatNum } from '@/utils/orderUtils'

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


// 信息列表配置
const infoList = computed(() => [
    {
        label: '商家名称:',
        value: pageData.value.merchantName ?? '暂无'
    },
    {
        label: '预估时间:',
        value: pageData.value.appointmentTime ?? '暂无',
    },
    {
        label: '收运时间:',
        value: pageData.value.arrivalTime ?? '暂无',
    },
    {
        label: '预估重量:',
        value: formatWeight(pageData.value.estimateWeight)
    },
    {
        label: '收运重量:',
        value: formatWeight(pageData.value.weight)
    },
    {
        label: '预估桶数:',
        value: formatNum(pageData.value.estimateBucketNum)
    },
    {
        label: '收运桶数:',
        value: formatNum(pageData.value.bucketNum)
    },
    {
        label: '收运地址:',
        value: pageData.value.address ?? '暂无',
    },
    {
        label: '车牌号:',
        value: pageData.value.registrationNumber ?? '暂无',
    },
    {
        label: '其他说明:',
        value: pageData.value.remark ?? '暂无',
    }
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
            driverName: data.driverName,
            status: data.status,
            merchantName: data.merchantName,
            estimateWeight: data.estimateWeight || 0.0,
            weight: data.weight || 0.0,
            estimateBucketNum: data.estimateBucketNum || 0,
            bucketNum: data.bucketNum || 0,
            registrationNumber: data.registrationNumber,
            appointmentTime: data.appointmentTime,
            arrivalTime: data.arrivalTime,
            address: data.address,
            remark: data.remark,
        };
    }
}
// 返回上一页
const back = () => {
    uni.navigateBack()
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
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
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
        margin-bottom: 40rpx;

        .info-item {
            display: block;
            margin-bottom: 30rpx;
            border-bottom: 1rpx solid #f0f0f0;

            &:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }

            .label {
                display: block;
                font-size: 14px;
                color: #999999;
                margin-bottom: 20rpx;
            }

            .value {
                display: block;
                font-size: 14px;
                color: #333333;
                line-height: 1.4;
                margin-bottom: 5rpx;
            }
        }
    }
}
</style>