<!-- 通用页面标题组件 -->
<template>
    <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" :title="title"
        @clickLeft="handleBack" />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

/**
 * 通用页面标题组件
 * 
 * 功能说明：
 * - 提供统一的页面标题栏样式
 * - 包含返回按钮和标题显示
 * - 支持自定义返回事件处理
 * 
 * 使用场景：
 * - 所有需要导航栏的页面
 * - 统一的页面标题样式
 * 
 * @author 系统
 * @version 1.0.0
 */

// 定义组件属性
const props = defineProps({
    /**
     * 页面标题
     * @type {String}
     * @description 显示在导航栏中间的标题文字
     * @required true
     */
    title: {
        type: String,
        required: true
    }
})

// 定义组件事件
const emit = defineEmits(['back'])

/**
 * 处理返回按钮点击
 * 默认执行 uni.navigateBack()，也可以通过事件自定义处理
 */
const handleBack = () => {
    // 触发自定义返回事件，让父组件决定如何处理
    emit('back')
}
</script>

<style lang="scss" scoped>
/* PageHeader 组件样式 - 字体大小由全局样式控制 */
</style>