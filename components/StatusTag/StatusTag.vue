<!-- 商户收运状态标签组件 -->
<template>
    <view class="status-tag" :class="statusClass">
        {{ statusText }}
    </view>
</template>

<script setup>
import { computed } from 'vue'

// 定义组件属性
const props = defineProps({
    // 状态值 (0: 进行中, 1: 已完成, 2: 无需收运)
    status: {
        type: [Number, String],
        required: true
    }
})

// 计算状态文本
const statusText = computed(() => {
    return getStatusText(props.status)
})

// 计算状态样式类
const statusClass = computed(() => {
    return getStatusClass(props.status)
})

// 获取状态文本（商户收运状态）
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

// 获取状态样式类（商户收运状态）
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
