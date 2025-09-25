<!-- 收运端订单操作按钮组件 -->
<template>
    <view class="order-footer">
        <!-- 进行中状态：显示取消和收运上报按钮 -->
        <template v-if="status === 0 || status === '0'">
            <uni-button size="mini" type="default" class="cancel-btn" @tap="handleCancel">
                取消
            </uni-button>
            <uni-button size="mini" type="primary" class="report-btn" @tap="handleReport">
                收运上报
            </uni-button>
        </template>

        <!-- 已完成或其他状态：显示查看详情按钮 -->
        <template v-else>
            <uni-button size="mini" type="default" class="view-btn" @tap="handleView">
                查看详情
            </uni-button>
        </template>
    </view>
</template>

<script setup>
/**
 * 收运端订单操作按钮组件
 * 
 * 功能说明：
 * - 根据订单状态显示不同的操作按钮
 * - 状态为0（进行中）时显示：取消、收运上报
 * - 其他状态时显示：查看详情
 * 
 * 使用场景：
 * - 收运端首页订单列表
 * - 收运记录页面订单列表
 * - 收运统计页面订单列表
 * 
 * 事件命名规范：
 * - cancel: 取消操作
 * - report: 收运上报操作
 * - view: 查看详情操作
 * 
 * @author 系统
 * @version 1.0.0
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

// 定义事件
const emit = defineEmits([
    /**
     * 取消按钮点击事件
     * @param {Object} orderData - 订单数据
     */
    'cancel',

    /**
     * 收运上报按钮点击事件
     * @param {Object} orderData - 订单数据
     */
    'report',

    /**
     * 查看详情按钮点击事件
     * @param {Object} orderData - 订单数据
     */
    'view'
])

/**
 * 处理取消按钮点击
 * 触发cancel事件，传递订单数据给父组件
 */
const handleCancel = () => {
    emit('cancel', props.orderData)
}

/**
 * 处理收运上报按钮点击
 * 触发report事件，传递订单数据给父组件
 */
const handleReport = () => {
    emit('report', props.orderData)
}

/**
 * 处理查看详情按钮点击
 * 触发view事件，传递订单数据给父组件
 */
const handleView = () => {
    emit('view', props.orderData)
}
</script>

<style lang="scss" scoped>
.order-footer {
    margin-top: 30rpx;
    display: flex;
    justify-content: flex-end;
    gap: 15rpx;
    flex-wrap: wrap; // 允许换行以适应多个按钮

    .cancel-btn,
    .view-btn,
    .report-btn {
        width: 120rpx; // 固定按钮宽度
        height: 48rpx;
        color: #07C160;
        border-radius: 100rpx;
        border: 2rpx solid #07C160;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    // 取消按钮样式
    .cancel-btn {
        border: 1rpx solid rgba(196, 196, 196, 1);
        color: rgba(61, 61, 61, 1);
    }

    // 收运上报按钮样式
    .report-btn {
        background-color: #FFA500;
        border-color: #FFA500;
        color: white;
    }
}
</style>
