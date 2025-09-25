<!-- 收运端订单操作按钮组件 -->
<template>
    <view class="order-footer">
        <!-- 进行中状态：显示取消、收运上报、查看详情按钮 -->
        <template v-if="status === 0 || status === '0'">
            <uni-button size="mini" type="primary" class="report-btn" @tap="handleReport">
                收运上报
            </uni-button>

            <uni-button size="mini" type="default" class="cancel-btn" @tap="handleCancel">
                异常上报
            </uni-button>

            <uni-button size="mini" type="default" class="view-btn" @tap="handleView">
                查看
            </uni-button>
        </template>

        <!-- 其他状态：只显示查看详情按钮 -->
        <template v-else>
            <uni-button size="mini" type="default" class="view-btn" @tap="handleView">
                查看
            </uni-button>
        </template>
    </view>
</template>

<script setup>
import { ref } from 'vue'

/**
 * 收运端订单操作按钮组件
 * 
 * 功能说明：
 * - 根据订单状态显示不同的操作按钮
 * - 状态为0（进行中）时显示：异常上报、收运上报、查看详情（3个按钮）
 * - 其他状态时显示：查看详情（1个按钮）
 * - 查看详情按钮在任何状态下都可以使用
 * - 取消和收运上报按钮只在进行中状态下可用
 * 
 * 使用场景：
 * - 收运端首页订单列表
 * - 收运记录页面订单列表
 * - 收运统计页面订单列表
 * - 收运详情页面任务列表
 * 
 * 事件命名规范：
 * - cancel: 取消操作
 * - report: 收运上报操作
 * - view: 查看详情操作
 * 
 * @author 系统
 * @version 1.2.0
 */

// 定义组件属性
const props = defineProps({
    /**
     * 订单状态
     * @type {Number|String}
     * @description 0-进行中, 1-已完成, 2-无法收运
     * @required true
     */
    status: {
        type: [Number, String],
        required: true
    },

    /**
     * 订单数据
     * @type {Object}
     * @description 包含订单的完整信息，用于传递给事件处理函数
     * @required true
     */
    orderData: {
        type: Object,
        required: true
    }
})

// 定义组件事件
const emit = defineEmits(['refresh', 'abnormalReport'])

/**
 * 处理异常上报按钮点击
 * 触发异常上报事件，让父页面处理弹窗
 */
const handleCancel = () => {
    // 触发异常上报事件，让父页面处理弹窗
    emit('abnormalReport', props.orderData)
}

/**
 * 处理收运上报按钮点击
 * 跳转到收运上报页面
 */
const handleReport = () => {
    const { carId, driverId, merchantId, id: planId, merchantName, registrationNumber } = props.orderData;

    uni.navigateTo({
        url: `/pages/collection/syReport?carId=${carId}&driverId=${driverId}&merchantId=${merchantId}&planId=${planId}&merchantName=${merchantName}&registrationNumber=${registrationNumber}`
    });
}

/**
 * 处理查看详情按钮点击
 * 跳转到收运详情页面
 */
const handleView = () => {
    const { id: planId, driverId } = props.orderData;
    uni.navigateTo({
        url: `/pages/collection/syCheckDetail?planId=${planId}&driverId=${driverId}`
    });
}
</script>

<style lang="scss" scoped>
.order-footer {
    margin-top: 30rpx;
    display: flex;
    justify-content: flex-end;
    gap: 10rpx; // 减少间距以适应3个按钮
    flex-wrap: wrap; // 允许换行以适应多个按钮

    .cancel-btn,
    .view-btn,
    .report-btn {
        width: 120rpx; // 增加按钮宽度
        height: 48rpx;
        border-radius: 100rpx;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    // 取消按钮样式
    .cancel-btn {
        border: 1rpx solid rgba(196, 196, 196, 1);
        color: rgba(61, 61, 61, 1);
        background-color: transparent;
    }

    // 查看详情按钮样式
    .view-btn {
        border: 1rpx solid #07C160;
        color: #07C160;
        background-color: transparent;
    }

    // 收运上报按钮样式
    .report-btn {
        border: 1rpx solid #FFA500;
        color: #FFA500;
        background-color: transparent;
    }
}
</style>