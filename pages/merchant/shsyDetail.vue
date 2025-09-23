<!-- 商户收运详细 -->
<template>
    <view class="container">
        <!-- 头部导航 -->
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运详细"
            @clickLeft="back" />

        <!-- 用户信息 -->
        <view class="user-info">
            <view class="name">{{ pageData.merchantName }}</view>
            <StatusTag :status="pageData.status" />
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
import { apiGetPlanById } from '@/api/apis.js'
import { onLoad } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期
import StatusTag from '@/components/StatusTag/StatusTag.vue'

// 页面参数
const merchantId = ref(); // 商户ID
const id = ref(); // 收运ID

// 页面数据
const pageData = ref({

});


// 信息列表配置
const infoList = computed(() => [
    {
        label: '预估时间:',
        value: pageData.value.appointmentTime ? pageData.value.appointmentTime : '暂无',
    },
    {
        label: '收运时间:',
        value: pageData.value.arrivalTime ? pageData.value.arrivalTime : '暂无',
    },
    {
        label: '预估重量:',
        value: pageData.value.estimateWeight ? pageData.value.estimateWeight + ' kg' : '暂无'

    },
    {
        label: '收运重量:',
        value: pageData.value.weight ? pageData.value.weight + ' kg' : '暂无'
    },
    {
        label: '预估桶数:',
        value: pageData.value.estimateBucketNum ? pageData.value.estimateBucketNum + ' 个' : '暂无'
    },
    {
        label: '收运桶数:',
        value: pageData.value.bucketNum ? pageData.value.bucketNum + ' 个' : '暂无'
    },
    {
        label: '收运地址:',
        value: pageData.value.address ? pageData.value.address : '暂无',
    },
    {
        label: '车牌号:',
        value: pageData.value.registrationNumber ?? '暂无',
    },
    {
        label: '其他说明:',
        value: pageData.value.explain ?? '暂无',
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

    console.log('接收到的参数:', options);
    console.log('解析后的参数:', { merchantId: merchantId.value, id: id.value });

    // 在参数赋值后立即调用API
    getSyCheckDetail();
});

// 页面逻辑
onMounted(() => {
    // API调用已移到onLoad中
})



//获取收运记录详情
const getSyCheckDetail = async () => {
    console.log('获取收运记录详情', merchantId.value, id.value);
    const res = await apiGetPlanById({
        merchantId: merchantId.value,
        id: id.value,

    })

    if (res.code === 200) {
        const data = res.data;

        // 统一更新pageData
        pageData.value = {
            driverName: data.driverName,
            status: data.status,
            merchantName: data.merchantName,
            estimateWeight: data.estimateWeight,
            weight: data.weight,
            estimateBucketNum: data.estimateBucketNum,
            bucketNum: data.bucketNum,
            registrationNumber: data.registrationNumber,
            img: data.img ? data.img.split(',') : [],
            appointmentTime: data.appointmentTime,
            arrivalTime: data.arrivalTime,
            address: data.address,
            explain: data.explain,
            merchantConfirm: data.merchantConfirm,
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
            // padding-bottom: 32rpx;
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