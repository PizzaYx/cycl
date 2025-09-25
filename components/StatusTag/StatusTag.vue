<!-- 商户收运状态标签组件 -->
<template>
    <view class="status-tag" :class="statusClass">
        {{ statusText }}
    </view>
</template>

<script setup>
/**
 * 商户收运状态标签组件
 * 
 * 功能说明：
 * - 专门为商户端设计的状态标签组件
 * - 根据订单状态显示对应的文字和样式
 * - 与收运端DriverStatusTag组件区分，避免混淆
 * 
 * 使用场景：
 * - 商户端首页订单状态显示
 * - 商户预约详情页面状态显示
 * - 商户收运详情页面状态显示
 * - 商户统计页面状态显示
 * 
 * 状态映射：
 * - 0: 进行中 (蓝色)
 * - 1: 已完成 (灰色)
 * - 2: 无需收运 (红色)
 * 
 * @author 系统
 * @version 1.0.0
 */

import { computed } from 'vue'

// 定义组件属性
const props = defineProps({
    /**
     * 订单状态值
     * @type {Number|String}
     * @description 0-进行中, 1-已完成, 2-无需收运
     * @required true
     */
    status: {
        type: [Number, String],
        required: true
    }
})

/**
 * 计算状态文本
 * 根据状态值返回对应的中文描述
 */
const statusText = computed(() => {
    return getStatusText(props.status)
})

/**
 * 计算状态样式类
 * 根据状态值返回对应的CSS类名
 */
const statusClass = computed(() => {
    return getStatusClass(props.status)
})

/**
 * 获取状态文本（商户收运状态）
 * 将数字状态转换为中文描述
 * 
 * @param {Number|String} status - 状态值
 * @returns {String} 状态中文描述
 */
const getStatusText = (status) => {
    const statusValue = Number(status)

    switch (statusValue) {
        case 0:
            return '进行中'
        case 1:
            return '已完成'
        case 2:
            return '无需收运'
        default:
            return '未知状态'
    }
}

/**
 * 获取状态样式类（商户收运状态）
 * 将数字状态转换为对应的CSS类名
 * 
 * @param {Number|String} status - 状态值
 * @returns {String} CSS类名
 */
const getStatusClass = (status) => {
    const statusValue = Number(status)

    switch (statusValue) {
        case 0:
            return 'processing'
        case 1:
            return 'completed'
        case 2:
            return 'cancelled'
        default:
            return ''
    }
}
</script>

<style lang="scss" scoped>
.status-tag {
    border-radius: 8rpx;
    font-size: 24rpx;
    width: 120rpx;
    height: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    // 收运记录状态样式
    &.processing {
        // 进行中
        color: rgba(0, 170, 255, 1);
        background: rgba(0, 170, 255, 0.10);
    }

    &.completed {
        // 已完成
        color: rgba(61, 61, 61, 0.50);
        background: rgba(153, 153, 153, 0.1);
    }

    &.cancelled {
        // 无法收运/无需收运
        color: rgba(221, 57, 47, 1);
        background: rgba(221, 57, 47, 0.10);
    }
}
</style>
