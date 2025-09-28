<template>
    <view class="signature-container">
        <!-- 自定义导航栏 -->
        <view class="custom-nav-bar" :style="navBarStyle">
            <!-- 状态栏占位 - 定位到胶囊按钮位置 -->
            <view class="status-bar" :style="statusBarStyle"></view>

            <!-- 导航栏内容 - 定位到胶囊按钮位置 -->
            <view class="nav-content" :style="navContentStyle">
                <!-- 左侧返回按钮 -->
                <view class="nav-left" @click="back">
                    <uni-icons type="left" size="20" color="#000"></uni-icons>
                </view>

                <!-- 中间标题 -->
                <view class="nav-title">{{ contractTitle }}</view>

                <!-- 右侧占位 -->
                <view class="nav-right"></view>
            </view>
        </view>


        <!-- 签名弹窗 -->
        <view class="signature-modal-native">
            <view style="width: 100%; height: 100%;">
                <l-signature ref="signatureRef" :penColor="penColor" :penSize="penSize" :openSmooth="openSmooth"
                    openSmooth></l-signature>
            </view>

            <view class="signature-buttons-rotated">
                <button class="signature-btn clear-btn" @click="clearSignature">清空</button>
                <button class="signature-btn undo-btn" @click="undoSignature">撤销</button>
                <button class="signature-btn save-btn" @click="saveSignature">保存</button>
                <button class="signature-btn cancel-btn" @click="cancelSignature">取消</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { uploadUrl, createUploadHeaders } from '@/utils/config.js'

// 页面参数
const contractId = ref('')
const contractTitle = ref('合同签名')

// 导航栏相关数据
const statusBarHeight = ref(0)
const navBarHeight = ref(44) // 默认导航栏高度
const menuButtonInfo = ref({})
const useFixedHeight = ref(false) // 临时使用固定高度测试

// 签名相关数据
const penColor = ref('black')
const penSize = ref(3)
const openSmooth = ref(true)
const signatureRef = ref(null)

// 上传相关
const uploadHeaders = createUploadHeaders()

/**
 * 计算导航栏样式
 */
const navBarStyle = computed(() => {
    let totalHeight
    if (useFixedHeight.value) {
        // 使用固定高度测试
        totalHeight = 88 // 固定88px测试
        console.log('使用固定高度测试:', totalHeight)
    } else {
        // 导航栏总高度 = 胶囊按钮的top + 胶囊按钮高度
        if (menuButtonInfo.value.top) {
            totalHeight = menuButtonInfo.value.top + menuButtonInfo.value.height
        } else {
            totalHeight = statusBarHeight.value + navBarHeight.value
        }
    }
    return {
        height: totalHeight + 'px',
        '--nav-bar-height': totalHeight + 'px'
    }
})

/**
 * 计算状态栏样式 - 定位到胶囊按钮位置
 */
const statusBarStyle = computed(() => {
    if (menuButtonInfo.value.top) {
        // 胶囊按钮的top是相对于整个屏幕的，所以直接使用
        const top = menuButtonInfo.value.top
        return {
            position: 'absolute',
            top: top + 'px',
            left: '0',
            right: '0',
            height: menuButtonInfo.value.height + 'px'
        }
    } else {
        // 默认样式
        return {
            height: navBarHeight.value + 'px'
        }
    }
})

/**
 * 计算导航栏内容样式 - 定位到胶囊按钮位置
 */
const navContentStyle = computed(() => {
    if (menuButtonInfo.value.top) {
        // 胶囊按钮的top是相对于整个屏幕的，所以直接使用
        const top = menuButtonInfo.value.top
        return {
            position: 'absolute',
            top: top + 'px',
            left: '0',
            right: '0',
            height: menuButtonInfo.value.height + 'px'
        }
    } else {
        // 默认样式
        return {
            height: navBarHeight.value + 'px'
        }
    }
})

/**
 * 获取系统信息并计算导航栏高度
 */
const initNavBar = () => {
    try {
        // 获取系统信息
        const systemInfo = uni.getSystemInfoSync()
        statusBarHeight.value = systemInfo.statusBarHeight || 0

        // 获取胶囊按钮信息
        const menuButton = uni.getMenuButtonBoundingClientRect()
        if (menuButton) {
            menuButtonInfo.value = menuButton
            // 导航栏应该和胶囊按钮在同一行，所以导航栏高度就是胶囊按钮的高度
            navBarHeight.value = menuButton.height
        } else {
            // 如果没有胶囊按钮信息，使用默认高度
            navBarHeight.value = 44
        }

    } catch (error) {
        console.error('获取系统信息失败:', error)
        // 使用默认值
        statusBarHeight.value = 20
        navBarHeight.value = 44
    }
}

// 页面加载
onLoad((options) => {
    contractId.value = options.contractId || ''
    contractTitle.value = options.title || '合同签名'
    // 初始化导航栏
    initNavBar()
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

            // 显示上传中提示
            uni.showLoading({
                title: '上传签名中...'
            })

            // 上传签名到服务器
            uni.uploadFile({
                url: uploadUrl,
                filePath: res.tempFilePath,
                name: 'file',
                header: uploadHeaders.value,
                success: (uploadRes) => {
                    uni.hideLoading()

                    try {
                        const response = JSON.parse(uploadRes.data)
                        if (response.code === 200 && response.url) {
                            uni.showToast({
                                title: '签名保存成功',
                                icon: 'success'
                            })
                            console.log('签名上传成功:', uploadRes)
                            // 返回上一页并传递签名数据
                            setTimeout(() => {
                                console.log('===== shSignature.vue 准备返回 =====')
                                console.log('执行uni.navigateBack，delta: 1')
                                uni.navigateBack({
                                    delta: 1,
                                    success: () => {
                                        console.log('shSignature.vue uni.navigateBack 成功')
                                        // 通过事件传递签名数据
                                        console.log('发送signatureUpdated事件')
                                        uni.$emit('signatureUpdated', {
                                            partyB: response.url
                                        })
                                    },
                                    fail: (err) => {
                                        console.error('shSignature.vue uni.navigateBack 失败:', err)
                                    }
                                })
                            }, 1500)
                        } else {
                            throw new Error(response.message || '上传失败')
                        }
                    } catch (error) {
                        console.error('解析上传响应失败:', error)
                        uni.showToast({
                            title: '上传失败，请重试',
                            icon: 'none'
                        })
                    }
                },
                fail: (error) => {
                    uni.hideLoading()
                    console.error('上传签名失败:', error)
                    uni.showToast({
                        title: '上传失败，请重试',
                        icon: 'none'
                    })
                }
            })
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
    min-height: 100vh;
    background: #f5f5f5;
}

// 自定义导航栏样式
.custom-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 999;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.status-bar {
    width: 100%;
    background-color: #fff;
}

.nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-color: #fff;
    height: 100%; // 确保占满整个导航栏高度
}

.nav-left {
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.nav-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
}

.nav-right {
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

/* 横屏适配 */
@media screen and (orientation: landscape) {
    .custom-nav-bar {
        .nav-content {
            padding: 0 20px;
        }
    }
}

/* 微信小程序适配 */
/* #ifdef MP-WEIXIN */
.custom-nav-bar {
    .nav-content {
        padding-right: calc(env(safe-area-inset-right) + 10px);
    }
}

/* #endif */

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
    /* 为导航栏留出空间 */
    padding-top: var(--nav-bar-height, 40px);

    .signature-buttons-rotated {
        position: absolute;
        right: 20rpx;
        top: 50vh; // 直接使用视口高度的50%
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 15rpx;
        z-index: 10;
        background: rgba(255, 255, 255, 0.9);
        padding: 10rpx;

        .signature-btn {
            height: 28rpx;
            width: 80rpx;
            border-radius: 30rpx;
            font-size: 20rpx;
            border: none;
            line-height: 25rpx;
            text-align: center;
            background: #07c160;
            color: #fff;

            // &.clear-btn {
            //     background: #ff4444;
            //     color: #fff;
            // }

            // &.undo-btn {
            //     background: #ff9500;
            //     color: #fff;
            // }

            // &.save-btn {
            //     background: #07c160;
            //     color: #fff;
            // }

            // &.cancel-btn {
            //     background: #999;
            //     color: #fff;
            // }
        }
    }
}
</style>