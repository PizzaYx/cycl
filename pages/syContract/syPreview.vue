<template>
    <view class="preview-container">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000"
            :title="contractTitle" @clickLeft="back" />

        <!-- 预览内容区域 -->
        <scroll-view class="preview-content" scroll-y>
            <view class="preview-body">
                <mp-html :content="contractContent"></mp-html>
            </view>
        </scroll-view>

        <!-- 底部操作按钮 -->
        <view class="bottom-actions">
            <button class="action-btn close-btn" @click="back">关闭</button>
            <button class="action-btn print-btn" @click="printContract">打印</button>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 页面参数
const contractId = ref('')
const contractTitle = ref('合同预览')
const contractContent = ref('')

// 页面加载
onLoad((options) => {
    contractId.value = options.contractId || ''
    contractTitle.value = decodeURIComponent(options.title || '合同预览')
    contractContent.value = decodeURIComponent(options.content || '')
})

// 返回上一页
const back = () => {
    uni.navigateBack()
}

// 打印合同
const printContract = () => {
    uni.showToast({
        title: '打印功能开发中',
        icon: 'none'
    })
}
</script>

<style lang="scss" scoped>
.preview-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.preview-content {
    height: calc(100vh - 120rpx);
    padding: 20rpx;
}

.preview-body {
    background: #fff;
    padding: 30rpx;
    border-radius: 16rpx;
    min-height: 800rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.bottom-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #eee;
    display: flex;
    gap: 20rpx;

    .action-btn {
        flex: 1;
        height: 80rpx;
        border-radius: 40rpx;
        font-size: 32rpx;
        font-weight: bold;
        border: none;

        &.close-btn {
            background: #f0f0f0;
            color: #666;
        }

        &.print-btn {
            background: #07c160;
            color: #fff;
        }
    }
}

// 富文本样式调整
:deep(.rich-text) {
    font-size: 28rpx;
    line-height: 1.6;
    color: #333;
}

// 打印样式
@media print {
    .preview-container {
        background: #fff;
    }

    .preview-body {
        box-shadow: none;
        border: none;
    }

    .bottom-actions {
        display: none;
    }
}
</style>