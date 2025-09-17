<!-- 收运详情 -->
<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="今日收运详情"
            @clickLeft="back" />
        <view class="header-progress-container">
            <view class="header">
                <view class="driver-info">
                    <view class="info-item">
                        <uni-text class="label">司机名称：</uni-text>
                        <uni-text class="value">{{ name }}</uni-text>
                        <uni-button size="mini" type="primary" class="contact-btn"
                            @tap="contactLine()">查看线路</uni-button>
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
                            <uni-text class="value green">{{ confirmNum ?? 0 }}</uni-text>
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
                <uni-button size="mini" type="primary" class="tj-btn" @tap="handleSubmitWeight()">提交重量</uni-button>

            </view>
        </view>
        <view class="task-list">
            <view class="task-item" v-for="(task, index) in taskList" :key="task.id">
                <view class="task-header">
                    <view class="time-info">
                        <uni-icons type="circle-filled"
                            :color="index === 0 ? 'rgba(7, 193, 96, 1)' : 'rgba(61, 61, 61, 0.50)'" size="20">
                        </uni-icons>
                        <uni-text class="date">{{ task.appointmentTime }}</uni-text>
                    </view>
                    <!-- 状态类名对应：0: 进行中, 1: 已完成, 2: 无需收运 -->
                    <uni-text class="status" :class="{
                        'processing': task.status === 0,
                        'completed': task.status === 1,
                        'cancelled': task.status === 2
                    }">
                        {{ getStatusText(task.status) }}
                    </uni-text>
                </view>
                <view class="divider"></view>
                <view class="task-content">
                    <view class="merchant-info">
                        <uni-text class="label">商户名称：</uni-text>
                        <uni-text class="value">{{ task.merchantName }}</uni-text>
                    </view>
                    <view class="weight-info">
                        <uni-text class="label">预估重量：</uni-text>
                        <uni-text class="value">{{ task.estimateWeight }}kg</uni-text>
                    </view>
                    <view class="bin-info">
                        <uni-text class="label">桶数：</uni-text>
                        <uni-text class="value">{{ task.estimateBucketNum || 0 }}个</uni-text>
                    </view>
                    <view class="address-info">
                        <uni-text class="label">地址：</uni-text>
                        <uni-text class="value">{{ task.address }}</uni-text>
                        <uni-icons type="location" size="16" color="#00B578"></uni-icons>
                    </view>
                </view>
                <view class="task-footer">
                    <template v-if="task.status === 0">
                        <!-- 进行中状态：显示4个按钮 -->
                        <uni-button size="mini" class="cancel-btn" @tap="cancelTask(task)">取消</uni-button>
                        <uni-button size="mini" type="primary" class="view-btn" @tap="viewTask(task)">查看</uni-button>
                        <uni-button size="mini" type="primary" class="report-btn"
                            @tap="reportTask(task)">收运上报</uni-button>
                    </template>
                    <template v-else-if="task.status === 1">
                        <!-- 已完成状态：只显示查看按钮 -->
                        <uni-button size="mini" type="primary" class="view-btn" @tap="viewTask(task)">查看</uni-button>
                    </template>
                    <template v-else-if="task.status === 2">
                        <!-- 无需收运状态：只显示查看按钮 -->
                        <uni-button size="mini" type="primary" class="view-btn" @tap="viewTask(task)">查看</uni-button>
                    </template>
                </view>
            </view>
        </view>
        <view class="headImage">
            <image src="/static/headTopBg.png" mode="aspectFill"></image>
        </view>
    </view>

</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app' // 导入onShow生命周期
import { useUserStore } from '@/stores/user.js'
import { apiGetDriverInfo, apiGetDriverTodayPlan, apiGetnoNeedCollect, apiAddCarWeight } from '@/api/apis.js'

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

const taskList = ref([]) // 任务列表

// 计算进度百分比
const progressPercentage = computed(() => {
    if (confirmNum.value === 0 && weightNum.value === 0) return 0;
    return Math.round((confirmNum.value / (confirmNum.value + notConfirmNum.value)) * 100);
});

// 获取状态文本
const getStatusText = (status) => {
    switch (status) {
        case 0: return '进行中';
        case 1: return '已完成';
        case 2: return '无需收运';
        default: return '未知状态';
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
        getapiGetDriverInfo();
        getapiGetDriverTodayPlan();
    } catch (error) {
        // 其他非401错误的处理
        console.error('页面初始化失败:', error)
    }

})

// 页面显示时刷新数据
onShow(async () => {
    console.log('页面显示时刷新数据')
    getapiGetDriverInfo();
    getapiGetDriverTodayPlan();
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



// 取消任务
const cancelTask = (task) => {
    console.log('取消任务:', task.id);
    uni.showModal({
        title: '确认取消',
        content: '是否确认取消当前任务？',
        success: async (res) => {
            if (res.confirm) {
                await apiGetnoNeedCollect({
                    id: task.id,
                    driverId: userStore.sfmerchant?.id,
                }).then((res) => {
                    if (res.code === 200) {
                        uni.showToast({
                            title: res.msg || '操作成功',
                            icon: 'success'
                        });
                        // 刷新任务列表
                        getapiGetDriverTodayPlan();
                    } else {
                        uni.showToast({
                            title: res.msg || '操作失败',
                            icon: 'error'
                        });
                    }

                })
            }
        }
    })
};

// 查看任务
const viewTask = (task) => {

    // 这里添加查看任务的逻辑
    uni.navigateTo({
        url: `/pages/collection/syCheckDetail?planId=${task.id}&driverId=${task.driverId}`
    });
};

// 收运上报
const reportTask = (task) => {
    console.log('收运上报:', task);

    uni.navigateTo({
        url: `/pages/collection/syReport?carId=${task.carId}&driverId=${task.driverId}&merchantId=${task.merchantId}&planId=${task.id}&merchantName=${task.merchantName}`
    });
};



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

// // 收运
// const collectTask = (task) => {
//     console.log('收运:', task.id);
//     //先判断task.weight是否大于0 he task.bucketNum是否大于0
//     if (task.weight > 0 && task.bucketNum > 0) {
//         //确认收运完成
//         uni.showModal({
//             title: '确认收运完成',
//             content: '是否确认收运完成？',
//             success: async (res) => {
//                 if (res.confirm) {
//                     await apiGetdriverConfirmPlan({
//                         id: task.id,
//                         driverId: userStore.sfmerchant?.id,
//                     }).then((res) => {
//                         if (res.code === 200) {
//                             uni.showToast({
//                                 title: res.message || '操作成功',
//                                 icon: 'success'
//                             });
//                             // 刷新任务列表
//                             getapiGetDriverTodayPlan();
//                         } else {
//                             uni.showToast({
//                                 title: res.message || '操作失败',
//                                 icon: 'error'
//                             });
//                         }
//                     })
//                 }
//             }
//         })

//     }
//     else {
//         uni.showToast({
//             title: '请先进行 收运上报 操作',
//             icon: 'none'
//         });
//         return;
//     }
// };
// 提交重量
const handleSubmitWeight = async () => {
    // 验证提交重量是否输入 是否大于等于0，成功提示是否提交过磅重量 是就调取接口apiGetCarWeight
    if (!weightInput.value) {
        uni.showToast({
            title: '请输入重量',
            icon: 'none'
        });
        return;
    }

    const weight = parseFloat(weightInput.value);
    if (isNaN(weight) || weight < 0) {
        uni.showToast({
            title: '请输入有效的重量(大于等于0)',
            icon: 'none'
        });
        return;
    }

    uni.showModal({
        title: '确认提交',
        content: `是否确认提交过磅重量 ${weight}kg？`,
        success: async (res) => {
            if (res.confirm) {
                try {
                    const result = await apiAddCarWeight({
                        carId: allCarId.value,
                        recordNo: allRecordNo.value,
                        weight: weight,
                        registrationNumber: registrationNumber.value,
                        driverId: userStore.sfmerchant?.id
                    });

                    if (result.code === 200) {
                        uni.showToast({
                            title: '提交成功',
                            icon: 'success'
                        });
                        // 清空输入框
                        weightInput.value = '';
                        // 刷新统计数据
                        getapiGetDriverInfo();
                    } else {
                        uni.showToast({
                            title: result.message || '提交失败',
                            icon: 'none'
                        });
                    }
                } catch (error) {
                    uni.showToast({
                        title: '提交失败',
                        icon: 'none'
                    });
                    console.error('提交重量失败:', error);
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

    .header-progress-container {
        background: #FFFFFF;
        border-radius: 16rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        margin-top: 20rpx;
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
                border: 1rpx solid #ddd;
                border-radius: 10rpx;
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

    .task-list {
        margin-top: 20rpx;
        position: relative;
        /* 移除左右内边距，因为任务项本身已经有30rpx的padding */

        /* 移除整体时间轴线，改用分段方式 */

        .task-item {
            background: #FFFFFF;
            border-radius: 16rpx;
            padding: 30rpx;
            margin-bottom: 0;
            /* 移除任务项之间的间隔，让图标可以连线 */
            position: relative;
            z-index: 1;

            /* 为除了第一个item添加上半段线条（从item顶部到uni-icons顶部） */
            &:not(:first-child)::before {
                content: '';
                position: absolute;
                left: 49rpx;
                /* uni-icons图标中心位置 */
                top: 0;
                width: 2rpx;
                height: 35rpx;
                /* 从item顶部到uni-icons顶部 */
                background-color: rgba(216, 216, 216, 1);
                z-index: 1;
            }

            /* 为除了最后一个item添加下半段线条（从uni-icons底部到item底部） */
            &:not(:last-child)::after {
                content: '';
                position: absolute;
                left: 49rpx;
                /* uni-icons图标中心位置 */
                bottom: 0;
                width: 2rpx;
                height: 382rpx;
                /* 从uni-icons底部到item底部 */
                background-color: rgba(216, 216, 216, 1);
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


                    .date {
                        font-size: 28rpx;
                        color: #666666;
                    }
                }

                .status {
                    font-size: 24rpx;
                    width: 100rpx;
                    height: 40rpx;
                    border-radius: 8rpx;
                    margin-right: 15rpx;
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

            .divider {
                height: 2rpx;
                background-color: #f0f0f0;
                margin: 22rpx 22rpx 0 55rpx;
            }

            .task-content {
                margin: 22rpx 22rpx 0 55rpx;
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
                gap: 15rpx;
                flex-wrap: wrap; // 允许换行以适应4个按钮

                .cancel-btn,
                .view-btn,
                .report-btn
                {
                    width: 120rpx; // 减小按钮宽度以适应4个按钮
                    height: 48rpx;
                    color: #07C160;
                    border-radius: 100rpx;
                    border: 2rpx solid #07C160;
                    font-size: 24rpx; // 稍微减小字体
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

    
                .cancel-btn {
                    border: 1rpx solid rgba(196, 196, 196, 1);
                    color: rgba(61, 61, 61, 1);
                }

                .report-btn {
                    background-color: #FFA500;
                    border-color: #FFA500;
                    color: white;
                }
            }
        }
    }

    .headImage {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: -1;

        image {
            width: 100%;
            height: auto;
            display: block;
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