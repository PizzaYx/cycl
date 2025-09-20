<template>
    <view class="signature-container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000"
            :title="contractTitle" @clickLeft="back" />
        <!-- 横屏签名弹窗 -->
        <view class="signature-modal-native">
            <view style="width: 100%; height: 100%;">
                <l-signature ref="signatureRef" :penColor="penColor" :penSize="penSize" :openSmooth="openSmooth"
                    openSmooth></l-signature>
            </view>

            <view class="signature-buttons-rotated">
                <button class="signature-btn clear-btn" @click="clearSignature">清空</button>
                <button class="signature-btn undo-btn" @click="undoSignature">撤销</button>
                <button class="signature-btn save-btn" @click="saveSignature">保存签名</button>
                <button class="signature-btn cancel-btn" @click="cancelSignature">取消</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'

// 页面参数
const contractId = ref('')
const contractTitle = ref('合同签名')

// 签名相关数据
const penColor = ref('black')
const penSize = ref(3)
const openSmooth = ref(true)
const signatureRef = ref(null)

// 页面加载
onLoad((options) => {
    contractId.value = options.contractId || ''
    contractTitle.value = options.title || '合同签名'
})

// 页面卸载时清理
onUnload(() => {
    // 清理工作
    console.log('签名页面卸载')
})

// 清空签名
const clearSignature = () => {
    if (signatureRef.value) {
        try {
            signatureRef.value.clear()
        } catch (error) {
            console.warn('清空签名失败:', error)
        }
    }
}

// 撤销签名
const undoSignature = () => {
    if (signatureRef.value) {
        try {
            signatureRef.value.undo()
        } catch (error) {
            console.warn('撤销签名失败:', error)
        }
    }
}

// 保存签名
const saveSignature = () => {
    if (!signatureRef.value) {
        uni.showToast({
            title: '签名组件未加载',
            icon: 'none'
        })
        return
    }

    signatureRef.value.canvasToTempFilePath({
        success: (res) => {
            if (res.isEmpty) {
                uni.showToast({
                    title: '请先进行签名',
                    icon: 'none'
                })
                return
            }

            uni.showToast({
                title: '签名保存成功',
                icon: 'success'
            })

            // 返回上一页并传递签名数据
            setTimeout(() => {
                uni.navigateBack({
                    delta: 1,
                    success: () => {
                        // 通过事件传递签名数据
                        uni.$emit('signatureUpdated', {
                            partyB: res.tempFilePath
                        })
                    }
                })
            }, 1500)
        },
        fail: (error) => {
            console.error('保存签名失败:', error)
            uni.showToast({
                title: '保存签名失败',
                icon: 'none'
            })
        }
    })
}

// 取消签名
const cancelSignature = () => {
    uni.showModal({
        title: '确认取消',
        content: '确定要取消签名吗？',
        success: (res) => {
            if (res.confirm) {
                uni.navigateBack()
            }
        }
    })
}

// 返回上一页
const back = () => {
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.signature-container {
    width: 100vw;
    height: 100vh;
    background: #f5f5f5;
}

.signature-modal-native {
    width: 100vw;
    height: 100vh;
    background: #fff;
    border-radius: 0;
    overflow: hidden;
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;

    .signature-buttons-rotated {
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 15rpx;
        z-index: 10;
        background: rgba(255, 255, 255, 0.9);
        padding: 10rpx;
        border-radius: 8rpx;

        .signature-btn {
            height: 25rpx;
            width: 70rpx;
            border-radius: 30rpx;
            font-size: 12rpx;
            border: none;
            line-height: 25rpx;
            text-align: center;


            &.clear-btn {
                background: #ff4444;
                color: #fff;
            }

            &.undo-btn {
                background: #ff9500;
                color: #fff;
            }

            &.save-btn {
                background: #07c160;
                color: #fff;
            }

            &.cancel-btn {
                background: #999;
                color: #fff;
            }
        }
    }
}
</style>