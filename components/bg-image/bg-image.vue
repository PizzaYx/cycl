<template>
    <view class="bg-image-wrap">
        <image class="bg-image" :src="src" mode="widthFix"></image>
        <view class="bg-content">
            <slot />
        </view>
    </view>
</template>

<script setup>
const props = defineProps({
    src: {
        type: String,
        default: '/static/headTopBg.png'
    },
    height: {
        type: String,
        default: '442rpx'
    }
})
</script>

<style scoped lang="scss"> 
.bg-image-wrap {
    display: block;
    position: relative;
    width: 100%;
    overflow: visible; // 允许内容溢出
}

.bg-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 442rpx;
    z-index: 0;
    pointer-events: none;
}

.bg-content {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 442rpx; // 至少保持背景图高度
    display: block;
    padding-top: 0; // 重置可能的padding
}
</style>