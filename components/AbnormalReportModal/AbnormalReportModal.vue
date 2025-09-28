<!-- 异常上报弹窗组件 -->
<template>
    <view v-if="show" class="abnormal-mask" @touchstart="preventTouch" @touchmove="preventTouch"
        @touchend="preventTouch">
        <view class="abnormal-modal">
            <view class="modal-header">
                <text class="modal-title">异常上报</text>
                <text class="close-btn" @tap="handleClose">×</text>
            </view>

            <view class="modal-content">
                <view class="abnormal-types">
                    <text class="section-title">请选择异常类型：</text>
                    <view class="type-list">
                        <view v-for="(type, index) in abnormalTypes" :key="index" class="type-item"
                            :class="{ active: selectedException === type.label }"
                            @tap="selectExceptionType(type.label)">
                            <view class="radio-item">
                                <view class="radio-circle" :class="{ checked: selectedException === type.label }">
                                    <view v-if="selectedException === type.label" class="radio-dot"></view>
                                </view>
                                <text class="type-text">{{ type.label }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="other-reason">
                    <text class="section-title">其他原因：</text>
                    <textarea v-model="otherReason" class="other-input" placeholder="如果没有合适的选项，请在此输入具体原因..."
                        maxlength="50" @input="onOtherReasonInput"></textarea>
                    <text class="char-count">{{ otherReason.length }}/50</text>
                </view>
            </view>

            <view class="modal-footer">
                <view class="btn-group">
                    <view class="cancel-btn" @tap="handleClose">
                        取消
                    </view>
                    <view class="confirm-btn" :class="{ disabled: !selectedException.trim() }" @tap="handleSubmit">
                        确认上报
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { apiGetnoNeedCollect } from '@/api/apis.js'

// 定义组件属性
const props = defineProps({
    /**
     * 是否显示弹窗
     */
    show: {
        type: Boolean,
        default: false
    },
    /**
     * 订单数据
     */
    orderData: {
        type: Object,
        default: null
    }
})

// 定义组件事件
const emit = defineEmits(['close', 'success'])

// 异常类型选项
const abnormalTypes = [
    { label: '商家未营业', value: 'merchant_closed' },
    { label: '垃圾桶损坏', value: 'bucket_damaged' },
    { label: '道路不通', value: 'road_blocked' },
    { label: '商家拒绝收运', value: 'merchant_refused' },
    { label: '设备故障', value: 'equipment_failure' },
    { label: '天气原因', value: 'weather_issue' }
]

// 异常上报相关变量
const selectedException = ref('')
const otherReason = ref('')

// 监听弹窗显示状态，重置表单
watch(() => props.show, (newVal) => {
    if (newVal) {
        selectedException.value = ''
        otherReason.value = ''
    }
})

// 选择异常类型
const selectExceptionType = (type) => {
    selectedException.value = type
    otherReason.value = ''
}

// 处理其他原因输入
const onOtherReasonInput = () => {
    if (otherReason.value.trim()) {
        selectedException.value = ''
    }
}

// 阻止遮罩层触摸事件
const preventTouch = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
}

// 关闭弹窗
const handleClose = () => {
    emit('close')
}

// 处理异常上报提交
const handleSubmit = async () => {
    if (!selectedException.value.trim() && !otherReason.value.trim()) {
        uni.showToast({ title: '请选择异常类型或输入其他原因', icon: 'none' })
        return
    }

    try {
        let fullRemark = ''
        if (selectedException.value) {
            fullRemark = selectedException.value
        } else {
            fullRemark = otherReason.value
        }

        const { id: planId } = props.orderData
        const result = await apiGetnoNeedCollect({
            id: planId,
            driverId: props.orderData.driverId,
            remark: fullRemark
        })

        if (result.code === 200) {
            uni.showToast({ title: '异常上报成功', icon: 'success' })
            emit('success')
            handleClose()
        } else {
            uni.showToast({ title: result.message || '异常上报失败', icon: 'none' })
        }
    } catch (error) {
        uni.showToast({ title: '异常上报失败', icon: 'none' })
        console.error('异常上报失败:', error)
    }
}
</script>

<style lang="scss" scoped>
// 异常上报弹窗样式
.abnormal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    pointer-events: auto;
    touch-action: none;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.abnormal-modal {
    width: 650rpx;
    max-height: 80vh;
    background: #fff;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 10000;

    .modal-header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 30rpx 30rpx 20rpx;
        border-bottom: 1rpx solid #f5f5f5;
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        position: relative;

        .modal-title {
            font-size: 30rpx;
            font-weight: 600;
            color: #2c3e50;
            text-align: center;
        }

        .close-btn {
            position: absolute;
            right: 30rpx;
            top: 50%;
            transform: translateY(-50%);
            width: 50rpx;
            height: 50rpx;
            font-size: 28rpx;
            color: #999;
            line-height: 50rpx;
            text-align: center;
            border-radius: 50%;
            background: #f5f5f5;
            transition: all 0.3s;

            &:active {
                background: #e9ecef;
                transform: translateY(-50%) scale(0.95);
            }
        }
    }

    .modal-content {
        max-height: 60vh;
        padding: 30rpx;

        .section-title {
            display: block;
            font-size: 24rpx;
            color: #2c3e50;
            margin-bottom: 15rpx;
            font-weight: 600;
        }

        .abnormal-types {
            margin-bottom: 30rpx;

            .type-list {
                display: flex;
                flex-direction: column;
                gap: 12rpx;

                .type-item {
                    padding: 18rpx 16rpx;
                    border: 2rpx solid #e9ecef;
                    border-radius: 12rpx;
                    background: #fafbfc;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;

                    &::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 0;
                        height: 100%;
                        background: linear-gradient(90deg, #07C160, #4CAF50);
                        transition: width 0.3s ease;
                        opacity: 0.1;
                    }

                    &.active {
                        border-color: #07C160;
                        background: linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%);
                        transform: translateY(-2rpx);
                        box-shadow: 0 4rpx 20rpx rgba(7, 193, 96, 0.15);

                        &::before {
                            width: 100%;
                        }
                    }

                    &:active {
                        transform: scale(0.98);
                    }

                    .radio-item {
                        display: flex;
                        align-items: center;
                        gap: 16rpx;
                        position: relative;
                        z-index: 1;

                        .radio-circle {
                            width: 28rpx;
                            height: 28rpx;
                            border: 2rpx solid #ddd;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.3s ease;
                            flex-shrink: 0;

                            &.checked {
                                border-color: #07C160;
                                background: #07C160;
                                transform: scale(1.1);
                            }

                            .radio-dot {
                                width: 14rpx;
                                height: 14rpx;
                                background: #fff;
                                border-radius: 50%;
                                animation: radioDot 0.3s ease;
                            }
                        }

                        .type-text {
                            font-size: 26rpx;
                            color: #2c3e50;
                            font-weight: 500;
                            flex: 1;
                        }
                    }
                }
            }
        }

        .other-reason {
            .other-input {
                width: 100%;
                height: 100rpx;
                padding: 16rpx;
                border: 2rpx solid #e9ecef;
                border-radius: 10rpx;
                font-size: 24rpx;
                background: #fafbfc;
                resize: none;
                box-sizing: border-box;
                transition: all 0.3s ease;
                line-height: 1.5;

                &:focus {
                    border-color: #07C160;
                    background: #fff;
                    box-shadow: 0 0 0 4rpx rgba(7, 193, 96, 0.1);
                }
            }

            .char-count {
                display: block;
                text-align: right;
                font-size: 20rpx;
                color: #6c757d;
                margin-top: 8rpx;
            }
        }
    }

    .modal-footer {
        padding: 20rpx 30rpx 30rpx;
        border-top: 1rpx solid #f5f5f5;
        background: #fafbfc;

        .btn-group {
            display: flex;
            gap: 16rpx;
            justify-content: flex-end;

            .cancel-btn,
            .confirm-btn {
                flex: 1;
                max-width: 160rpx;
                height: 56rpx;
                border-radius: 28rpx;
                font-size: 24rpx;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .cancel-btn {
                background: #f8f9fa;
                color: #6c757d;
                border: 2rpx solid #e9ecef;

                &:active {
                    background: #e9ecef;
                    transform: scale(0.98);
                }
            }

            .confirm-btn {
                background: linear-gradient(135deg, #07C160, #4CAF50);
                color: #fff;
                border: none;
                box-shadow: 0 4rpx 20rpx rgba(7, 193, 96, 0.3);

                &:active {
                    transform: scale(0.98);
                    box-shadow: 0 2rpx 10rpx rgba(7, 193, 96, 0.4);
                }

                &.disabled {
                    background: #07C160;
                    color: #fff;
                    box-shadow: none;
                    transform: none;
                }
            }
        }
    }
}

@keyframes radioDot {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}
</style>
