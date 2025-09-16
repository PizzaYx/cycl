<!-- 商户预约详细 -->
<template>
    <view class="container">
        <!-- 头部导航 -->
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="预约详细"
            @clickLeft="back" />

        <!-- 用户信息 -->
        <view class="user-info">
            <view class="name">{{ pageData.merchantName }}</view>
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



        </view>
    </view>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { apiGetPlanTemporaryById } from '@/api/apis.js'
import { onLoad } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期

// 页面参数
const merchantId = ref(); // 商户ID
const id = ref(); // 收运ID

// 页面数据
const pageData = ref({

});

// 根据状态显示对应的文字
const statusText = computed(() => {
    switch (pageData.value.status) {
        case 0: return '待审核';
        case 1: return '审核通过';
        case 2: return '未通过';
        default: return '';
    }
});

const statusClass = computed(() => {
    switch (pageData.value.status) {
        case 0: return 'booking'; // 待审核 
        case 1: return 'passed'; // 审核通过 
        case 2: return 'notpassed'; // 审核不通过 
        default: return '';
    }
});

// 信息列表配置
const infoList = computed(() => [

    {
        label: '预估时间:',
        value: pageData.value.appointmentTime ?? '暂无',
    },
    {
        label: '预估重量:',
        value: pageData.value.estimateWeight + ' kg' ?? '暂无'

    },
    {
        label: '预估桶数:',
        value: pageData.value.estimateBucketNum + ' 个' ?? '暂无'
    },
    {
        label: '收运地址:',
        value: pageData.value.address ?? '暂无',
    },
    {
        label: '其他说明:',
        value: pageData.value.explain,
    },

]);

onLoad((options) => {
    if (options.id) id.value = options.id;
    // 处理参数名可能有空格的情况
    if (options.merchantId) {
        merchantId.value = options.merchantId;
    } else if (options['merchantId ']) {
        merchantId.value = options['merchantId '];
    }

    // 在参数赋值后立即调用API
    getSyCheckDetail();
});

// 页面逻辑
onMounted(() => {
    // API调用已移到onLoad中
})



//获取收运记录详情
const getSyCheckDetail = async () => {

    const res = await apiGetPlanTemporaryById({
        merchantId: merchantId.value,
        id: id.value,

    })

    if (res.code === 200) {
        const data = res.data;
    
        // 统一更新pageData
        pageData.value = {
            driverName: data.driverName ?? '',
            status: data.status,
            merchantName: data.merchantName ?? '',
            estimateWeight: data.estimateWeight ?? 0,
            weight: data.weight ?? 0,
            estimateBucketNum: data.estimateBucketNum ?? 0,
            bucketNum: data.bucketNum   ?? 0,
            registrationNumber: data.registrationNumber ?? 0,
            img: data.img ? data.img.split(',') : [],
            appointmentTime: data.appointmentTime ?? 0,
            arrivalTime: data.arrivalTime,
            address: data.address ??'',
            explain: data.explain ??'',

        };
        console.log('获取收运记录详情成功', pageData.value);
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

    .status-tag {
        font-size: 24rpx;
        width: 120rpx;
        height: 40rpx;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;


        &.booking {
            color: rgba(255, 161, 0, 1);
            background: rgba(255, 161, 0, 0.10);
        }

        &.passed {
            color: rgba(7, 193, 96, 1);
            background: rgba(7, 193, 96, 0.10);
        }

        &.notpassed {
            color: rgba(221, 57, 47, 1);
            background: rgba(221, 57, 47, 0.10);
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
                margin-left: 30rpx;
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