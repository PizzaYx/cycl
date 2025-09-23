<!-- 
  时间范围选择器组件
  功能：带清除按钮的时间范围选择器
  使用场景：需要时间筛选的页面
-->
<template>
    <view class="time-range-picker">
        <!-- 时间选择器 -->
        <view class="filter-item">
            <uni-datetime-picker v-model="selectedTimeRange" ref="datetimePicker" type="datetimerange"
                rangeSeparator="至" start="2020-01-01 00:00:00" :end="getCurrentDateTime()" @change="onTimeChange"
                @show="onTimePickerShow" @maskClick="onTimePickerClose">
                <text>时间 </text>
                <uni-icons type="bottom" size="12" color="#666"></uni-icons>
            </uni-datetime-picker>
        </view>

        <!-- 清除按钮 - 覆盖在弹出层上 -->
        <view class="clear-button-overlay" :class="{ show: showClearButton }" @click="clearTimeRange">
            <view class="clear-button">
                <text>清除</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, watch } from 'vue'

// ==================== Props 定义 ====================
// 父组件传入的初始值
const props = defineProps({
    // 初始选中的时间范围，格式：['2023-01-01', '2023-01-31']
    modelValue: {
        type: Array,
        default: () => []
    }
})

// ==================== Emits 定义 ====================
// 向父组件发送的事件
const emit = defineEmits([
    'update:modelValue', // 时间范围变化时触发，用于 v-model 双向绑定
    'change'             // 时间范围变化时触发，传递新的时间范围
])

// ==================== 响应式数据 ====================
// 内部维护的时间范围值
const selectedTimeRange = ref([])
// 是否显示清除按钮
const showClearButton = ref(false)
// 时间选择器组件的引用
const datetimePicker = ref(null)

// ==================== 监听器 ====================
// 监听父组件传入的值变化，同步到内部状态
watch(() => props.modelValue, (newValue) => {
    selectedTimeRange.value = newValue || []
}, { immediate: true })

// 监听内部值变化，通知父组件
watch(selectedTimeRange, (newValue) => {
    emit('update:modelValue', newValue)
    emit('change', newValue)
})

// ==================== 方法定义 ====================

/**
 * 获取当前日期时间
 * @returns {string} 格式化的当前日期时间字符串
 */
const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    const second = String(now.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

/**
 * 时间选择器显示时触发
 * 让按钮跟随时间选择器一起从底部弹出
 */
const onTimePickerShow = () => {
    console.log('时间选择器已打开')
    // 添加show类，让按钮从底部升起来
    showClearButton.value = true
}

/**
 * 时间选择器关闭时触发
 * 让按钮回到底部
 */
const onTimePickerClose = () => {
    console.log('时间选择器已关闭')
    // 移除show类，让按钮回到底部
    showClearButton.value = false
}

/**
 * 时间范围变化时触发
 * @param {Array} value 新的时间范围
 */
const onTimeChange = (value) => {
    console.log('时间变化:', value)
    selectedTimeRange.value = value
    // 隐藏清除按钮（用户选择了时间，弹窗会关闭）
    showClearButton.value = false
}

/**
 * 清除时间范围
 * 使用组件的 clear 方法清除选择并关闭弹窗
 */
const clearTimeRange = () => {
    console.log('清除时间范围')
    // 使用组件的 clear 方法
    if (datetimePicker.value) {
        datetimePicker.value.clear()
        // 关闭弹窗
        datetimePicker.value.close()
    }
    // 清空数据
    selectedTimeRange.value = []
    // 隐藏清除按钮
    showClearButton.value = false
}

// ==================== 暴露给父组件的方法 ====================
// 父组件可以通过 ref 调用这些方法
defineExpose({
    clear: clearTimeRange,        // 清除方法
    show: () => datetimePicker.value?.show(),  // 显示方法
    close: () => datetimePicker.value?.close() // 关闭方法
})
</script>

<style lang="scss" scoped>
.time-range-picker {
    position: relative;

    .filter-item {
        display: flex;
        align-items: center;
        gap: 10rpx; // 文字和箭头紧挨着
        min-height: 60rpx;

        text {
            font-size: 28rpx;
            color: #333;
        }
    }

    // 清除按钮覆盖层 - 基于 uni-datetime-picker 的实际弹出层位置
    .clear-button-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100; // 确保在弹出层之上（弹出层z-index是99）
        pointer-events: none; // 让点击穿透到下层

        .clear-button {
            position: absolute;
            // 基于 uni-datetime-picker 移动端弹出层位置定位
            // 弹出层从底部向上滑入，使用 translateY(0) 显示在底部
            // 清除按钮放在弹出层上方
            bottom: calc(var(--window-bottom) + 445px); // 弹出层高度 + 安全距离
            left: 10%; // 水平居中
            transform: translateX(-50%) translateY(100vh); // 水平居中 + 初始位置在视窗外
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15rpx 30rpx;
            background-color: #007aff;
            border-radius: 50rpx;
            pointer-events: auto; // 恢复按钮的点击事件
            box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
            transition: transform 0.43s ease, opacity 0.1s ease; // 跟随弹出层动画
            opacity: 0; // 初始透明

            text {
                font-size: 28rpx;
                color: #fff;
            }

            &:active {
                background-color: #0056cc;
                transform: translateX(-50%) scale(0.95);
            }
        }
    }

    // 当弹出层显示时，清除按钮也显示（跟随动画）
    .clear-button-overlay.show .clear-button {
        transform: translateX(-50%) translateY(0); // 显示状态：只水平居中，不向下偏移
        opacity: 1; // 显示状态：完全不透明
    }

}
</style>
