<!-- 信息展示组件 -->
<template>
    <view class="info-content">
        <view v-for="field in fields" :key="field.key" class="info-item">
            <text class="label">{{ field.label }}:</text>
            <text class="value">{{ getFieldValue(field) }}</text>
        </view>
    </view>
</template>

<script>
import { formatWeight, formatNum } from '@/utils/orderUtils'

export default {
    name: 'InfoDisplay',
    props: {
        fields: {
            type: Array,
            required: true
        }
    },
    methods: {
        getFieldValue(field) {
            // 根据字段key判断处理方式
            if (field.key === 'weight' || field.key === 'estimateWeight') {
                return formatWeight(field.value)
            } else if (field.key === 'bucketNum' || field.key === 'estimateBucketNum' || field.key === 'deliveryCount') {
                return formatNum(field.value)
            } else {
                // 其他字段显示"暂无"
                return field.value || '暂无'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.info-content {
    padding: 20rpx 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;

    .info-item {
        display: flex;
        margin-bottom: 16rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .label {
            font-size: 26rpx;
            color: rgba(61, 61, 61, 0.50);
        }

        .value {
            margin-left: 100rpx;
            font-size: 26rpx;
            color: rgba(61, 61, 61, 1);
        }
    }
}
</style>
