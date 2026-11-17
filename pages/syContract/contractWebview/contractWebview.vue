<template>
    <view class="webview-container">
        <web-view :src="webviewUrl" @message="onMessage"></web-view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { CONTRACT_DOWNLOAD_URL } from '@/utils/config.js'

const webviewUrl = ref('')

onLoad((options) => {
    const token = uni.getStorageSync('access_token') || ''
    const merchantId = options.merchantId || ''
    webviewUrl.value = `${CONTRACT_DOWNLOAD_URL}/#/about?token=${encodeURIComponent(token)}&merchantId=${encodeURIComponent(merchantId)}`
    console.log('webview URL:', webviewUrl.value)
})

// 接收H5通过 wx.miniProgram.postMessage 发送的消息
const onMessage = (e) => {
    console.log('webview message:', e.detail)
    const data = e.detail?.data
    if (!data || data.length === 0) return

    const lastData = data[data.length - 1]

    // 情况1：H5传了图片base64
    if (lastData.imageBase64) {
        saveBase64ToAlbum(lastData.imageBase64)
    }
    // 情况2：H5传了下载URL
    else if (lastData.downloadUrl) {
        saveUrlToAlbum(lastData.downloadUrl)
    }
}

// base64 保存到相册
const saveBase64ToAlbum = (base64Data) => {
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const fs = uni.getFileSystemManager()
    const filePath = `${wx.env.USER_DATA_PATH}/contract_${Date.now()}.png`

    fs.writeFile({
        filePath,
        data: base64,
        encoding: 'base64',
        success: () => {
            saveToAlbum(filePath)
        },
        fail: (err) => {
            console.error('写入文件失败:', err)
            uni.showToast({ title: '保存失败', icon: 'none' })
        }
    })
}

// URL 下载保存到相册
const saveUrlToAlbum = (url) => {
    uni.showLoading({ title: '正在下载...' })
    uni.downloadFile({
        url,
        success: (res) => {
            uni.hideLoading()
            if (res.statusCode === 200) {
                saveToAlbum(res.tempFilePath)
            } else {
                uni.showToast({ title: '下载失败', icon: 'none' })
            }
        },
        fail: () => {
            uni.hideLoading()
            uni.showToast({ title: '下载失败', icon: 'none' })
        }
    })
}

// 保存到相册
const saveToAlbum = (filePath) => {
    uni.showLoading({ title: '正在保存...' })
    uni.saveImageToPhotosAlbum({
        filePath,
        success: () => {
            uni.hideLoading()
            uni.showToast({ title: '已保存到相册', icon: 'success' })
        },
        fail: (err) => {
            uni.hideLoading()
            if (err.errMsg.includes('auth deny') || err.errMsg.includes('authorize:fail')) {
                uni.showModal({
                    title: '提示',
                    content: '需要保存图片的权限，请在设置中打开相册授权',
                    success: (modalRes) => {
                        if (modalRes.confirm) {
                            uni.openSetting()
                        }
                    }
                })
            } else {
                uni.showToast({ title: '保存失败', icon: 'none' })
            }
        }
    })
}
</script>

<style scoped>
.webview-container {
    width: 100%;
    height: 100vh;
}
</style>
