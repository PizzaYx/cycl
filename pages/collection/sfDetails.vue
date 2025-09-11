<!-- 收运详情 -->
<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运详情"
            @clickLeft="back" />
        <view class="header-progress-container">
            <view class="header">
                <view class="driver-info">
                    <view class="info-item">
                        <uni-text class="label">司机名称：</uni-text>
                        <uni-text class="value">{{ name }}</uni-text>
                        <uni-button size="mini" type="primary" class="contact-btn">查看线路</uni-button>
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
                    <view class="progress-circle"
                        :style="{ background: `conic-gradient(#07C160 ${progressPercentage}%, rgba(216, 216, 216, 0.5) ${progressPercentage}% 100%)` }">
                        <view class="circle-text">
                            <uni-text class="percentage">{{ progressPercentage }}%</uni-text>
                            <uni-text class="label">已完成</uni-text>
                        </view>
                    </view>
                    <view class="progress-stats">
                        <view class="stat-item">
                            <image src="/static/ssd/greenbg.png" mode="aspectFill"></image>
                            <uni-text class="value green">{{ confirmNum }}</uni-text>
                            <uni-text class="label">已收运</uni-text>
                        </view>
                        <view class="stat-item">
                            <image src="/static/ssd/orangebg.png" mode="aspectFill"></image>
                            <uni-text class="value orange">{{ notConfirmNum }}</uni-text>
                            <uni-text class="label">未收运</uni-text>
                        </view>
                        <view class="stat-item">
                            <image src="/static/ssd/bluebg.png" mode="aspectFill"></image>
                            <uni-text class="value blue">{{ weightNum }}</uni-text>
                            <uni-text class="label">总重量</uni-text>
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
                <input class="weight-input" type="number" v-model="weightInput" placeholder="0" />
                <uni-text class="weight-unit">kg</uni-text>
                <uni-button size="mini" type="primary" class="tj-btn">提交重量</uni-button>

            </view>
        </view>
        <view class="task-list">
            <view class="task-item">
                <view class="task-header">
                    <view class="time-info">
                        <uni-text class="date">2025-08-24 14:30</uni-text>
                    </view>
                    <uni-text class="status processing">进行中</uni-text>
                </view>
                <view class="task-content">
                    <view class="merchant-info">
                        <uni-text class="label">商户名称：</uni-text>
                        <uni-text class="value">三顾冒菜</uni-text>
                    </view>
                    <view class="weight-info">
                        <uni-text class="label">预估重量：</uni-text>
                        <uni-text class="value">1.46kg</uni-text>
                    </view>
                    <view class="bin-info">
                        <uni-text class="label">桶数：</uni-text>
                        <uni-text class="value">{{ bucketNum }}个</uni-text>
                    </view>
                    <view class="address-info">
                        <uni-text class="label">地址：</uni-text>
                        <uni-text class="value">成都市锦江区春熙路123号</uni-text>
                        <uni-icons type="location" size="16" color="#00B578"></uni-icons>
                    </view>
                </view>
                <view class="task-footer">
                    <uni-button size="mini" class="cancel-btn">取消</uni-button>
                    <uni-button size="mini" type="primary" class="view-btn">查看</uni-button>
                </view>
            </view>
        </view>
    </view>

</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { apiGetDriverInfo, apiGetDriverTodayPlan } from '@/api/apis.js'

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
const weightValue = ref('') // 重量输入框的值

// 计算进度百分比
const progressPercentage = computed(() => {
   
    if (confirmNum === 0 && weightNum === 0) return 0;
    console.log('confirmNum:', confirmNum.value, 'weightNum:', weightNum.value);
    return Math.round((confirmNum.value / weightNum.value) * 100);
});

onMounted(async () => {
    // 页面加载时的逻辑
    try {
        const userInfo = await userStore.ensureUserInfo()
        if (userInfo === null) {
            // 用户未登录，已跳转到登录页，不需要继续执行
            console.log('用户未登录，已跳转到登录页')
            return
        }
        getapiGetDriverInfo();
        getapiGetDriverTodayPlan();
    } catch (error) {
        // 其他非401错误的处理
        console.error('页面初始化失败:', error)
    }
})

//获取今日统计信息
const getapiGetDriverInfo = async () => {
    const res = await apiGetDriverInfo({
        driverId: userStore.sfmerchant?.id
    })

    if (res.code === 200) {
        //confirmNum.value = res.data.confirmNum;
        confirmNum.value = 20;
        notConfirmNum.value = res.data.notConfirmNum;
        // weightNum.value = res.data.weightNum;
        weightNum.value = 100;
        bucketNum.value = res.data.bucketNum;
        registrationNumber.value = res.data.registrationNumber;
        name.value = res.data.name;
    }
}

//司机今日收运管理列表
const getapiGetDriverTodayPlan = async () => {
    const res = await apiGetDriverTodayPlan({
        driverId: userStore.sfmerchant?.id,
        page: 1,
        pageSize: 10
    })

    if (res.code === 200) {
        taskList.value = res.data.records;
    }
}


// 组件逻辑
</script>

<style scoped lang="scss">
.container {
    padding: 30rpx;
    background-color: $bg-theme-color;
    height: 100vh;
    
    .header-progress-container {
        background: #FFFFFF;
        border-radius: 16rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
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
            gap: 20rpx;

            .info-item {
                display: flex;
                align-items: center;

                .label {
                    color: rgba(61, 61, 61, 0.50);
                    font-size: 28rpx;
                }

                .value {
                    color: rgba(61, 61, 61, 1);
                    font-size: 14px;
                }

                .contact-btn {
                    margin-left: auto;
                    color: #07C160;
                    border-radius: 100rpx;
                    padding: 6rpx 20rpx;
                    border: 2rpx solid #07C160;
                    font-size: 26rpx;
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
            font-size: 34rpx;
            color: rgba(61, 61, 61, 1);
            margin-bottom: 30rpx;
        }

        .progress-content {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .progress-circle {
                width: 200rpx;
                height: 200rpx;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                .circle-text {
                    text-align: center;
                    background: white;
                    border-radius: 50%;
                    width: 170rpx;
                    height: 170rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    
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
            }

            .progress-stats {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-left: 40rpx;
                gap: 20rpx;
                align-items: flex-end;

                .stat-item {
                    width: 300rpx;
                    height: 88rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    
                    image {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 0;
                    }
                    
                    .value {
                        font-size: 32rpx;
                        font-weight: 500;
                        display: block;
                        z-index: 1;
                        text-align: center;

                        &.green {
                            color: rgba(7, 193, 96, 1);
                        }

                        &.orange {
                            color: rgba(255, 161, 0, 1);
                        }

                        &.blue {
                            color: rgba(0, 170, 255, 1);
                        }
                    }

                    .label {
                        font-size: 24rpx;
                        color: rgba(61, 61, 61, 0.50);
                        z-index: 1;
                        text-align: center;
                    }
                }
            }
        }
    }

    .weight-section {
        background: #FFFFFF;
        border-radius: 16rpx;
        padding: 30rpx;
        margin-bottom: 10rpx;

        .weight-header {
            font-size: 34rpx;
            color: rgba(61, 61, 61, 1);
            display: block;
            margin-bottom: 20rpx;
        }
        
        .weight-content {
            display: flex;
            align-items: center;
            image{
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
                border: 1rpx solid #ddd;
                border-radius: 10rpx;
                font-size: 14px;
                width: 120rpx;
                text-align: center;
            }

            .weight-unit {
                font-size: 14px;
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

    .task-list {
        margin-top: 20rpx;

        .task-item {
            background: #FFFFFF;
            border-radius: 16rpx;
            padding: 30rpx;
            margin-bottom: 20rpx;

            .task-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20rpx;

                .time-info {
                    display: flex;
                    align-items: center;
                    gap: 10rpx;

                    .date {
                        font-size: 14px;
                        color: #666666;
                    }
                }

                .status {
                    font-size: 12px;
                    padding: 4rpx 16rpx;
                    border-radius: 4rpx;

                    &.processing {
                        color: #00B578;
                        background: rgba(0, 181, 120, 0.1);
                    }
                }
            }

            .task-content {
                display: flex;
                flex-direction: column;
                gap: 20rpx;

                .merchant-info,
                .weight-info,
                .bin-info,
                .address-info {
                    display: flex;
                    align-items: center;
                    gap: 10rpx;

                    .label {
                        color: #666666;
                        font-size: 14px;
                    }

                    .value {
                        color: #333333;
                        font-size: 14px;
                    }
                }
            }

            .task-footer {
                margin-top: 30rpx;
                display: flex;
                justify-content: flex-end;
                gap: 20rpx;

                .cancel-btn {
                        color: #07C160;
                        border-radius: 100rpx;
                        padding: 6rpx 20rpx;
                        border: 2rpx solid #07C160;
                        font-size: 26rpx;
                }

                .view-btn {
                        color: #07C160;
                        border-radius: 100rpx;
                        padding: 6rpx 20rpx;
                        border: 2rpx solid #07C160;
                        font-size: 26rpx;
                }
            }
        }
    }
}
</style>


<!-- address: "成都"
appointmentTime: "2025-09-11"
arrivalTime: null
bucketNum: null
carId: 1
contactTel: "18628003126"
contactTruename: "1yx"
createTime: "2025-09-11 09:45:09"
driverId: 3
driverName: "李是"
estimateBucketNum: 4
estimateWeight: 4
id: 5
lat: "30.63706"
lon: "104.08276"
merchantCode: null
merchantConfirm: null
merchantId: 448
merchantName: "杨洵测试"
recordNo: "1_20250911"
registrationNumber: null
status: 0
trashWeight: null
type: 0
updateTime: null
weight: null -->