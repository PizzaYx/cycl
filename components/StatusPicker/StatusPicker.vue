<!-- 
  状态选择器组件
  功能：带选中状态显示的状态选择器
  使用场景：需要状态筛选的页面
-->
<template>
    <view class="status-picker">
        <view class="filter-item" @click="showStatusPicker">
            <text>状态</text>
            <uni-icons type="bottom" size="12" color="#666"></uni-icons>
        </view>
    </view>
</template>

<script setup>
import { ref, watch } from 'vue'

// ==================== Props 定义 ====================
// 父组件传入的初始值
const props = defineProps({
    // 初始选中的状态值
    modelValue: {
        type: [Number, String, null],
        default: null
    },
    // 状态选项配置
    options: {
        type: Array,
        default: () => [
            { value: 0, text: '待收运' },
            { value: 1, text: '已完成' },
            { value: 2, text: '无需收运' }
        ]
    }
})

// ==================== Emits 定义 ====================
// 向父组件发送的事件
const emit = defineEmits([
    'update:modelValue', // 状态变化时触发，用于 v-model 双向绑定
    'change'             // 状态变化时触发，传递新的状态值
])

// ==================== 响应式数据 ====================
// 内部维护的状态值
const selectedStatus = ref(null)

// ==================== 监听器 ====================
// 监听父组件传入的值变化，同步到内部状态
watch(() => props.modelValue, (newValue) => {
    selectedStatus.value = newValue
}, { immediate: true })

// 监听内部值变化，通知父组件
watch(selectedStatus, (newValue) => {
    emit('update:modelValue', newValue)
    emit('change', newValue)
})

// ==================== 方法定义 ====================

/**
 * 显示状态选择器
 * 使用 uni.showActionSheet 显示状态选项
 */
const showStatusPicker = () => {
    // 创建带选中标记的选项列表
    const itemList = props.options.map((item) => {
        const isSelected = selectedStatus.value === item.value
        return isSelected ? `✓ ${item.text}` : item.text
    })

    uni.showActionSheet({
        itemList: itemList,
        success: (res) => {
            // 用户选择了某个选项
            const selectedOption = props.options[res.tapIndex]
            selectedStatus.value = selectedOption.value
            console.log('状态选择:', selectedOption.text, selectedOption.value)
        },
        fail: (res) => {
            // 用户点击了取消
            if (res.errMsg.includes('cancel')) {
                // 点击取消相当于重置状态
                selectedStatus.value = null
                console.log('状态已重置为 null')
            }
        }
    })
}

// ==================== 暴露给父组件的方法 ====================
// 父组件可以通过 ref 调用这些方法
defineExpose({
    reset: () => { selectedStatus.value = null },  // 重置方法
    setValue: (value) => { selectedStatus.value = value }  // 设置值方法
})
</script>

<style lang="scss" scoped>
.status-picker {
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
}
</style>
