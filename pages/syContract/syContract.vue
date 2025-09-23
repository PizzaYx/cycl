<template>
    <view class="contract-container">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="合同详情"
            @clickLeft="back" />

        <!-- 合同过期提示 -->
        <view v-if="contractExpired && fromMerchant" class="expired-tip">
            <view class="tip-content">
                <uni-icons type="info" size="16" color="#ff9500"></uni-icons>
                <text class="tip-text">您的合同已过期，请重新签署合同</text>
            </view>
        </view>

        <!-- 合同内容区域 -->
        <scroll-view class="contract-content" scroll-y>
            <!-- 富文本合同内容 -->
            <view class="contract-body">
                <mp-html :content="contractContent" @tap="onRichTextTap"></mp-html>
            </view>
        </scroll-view>

        <!-- 底部提交按钮（仅从merchant页面进入且可编辑时显示） -->
        <view v-if="fromMerchant && !isReadOnly" class="bottom-actions">
            <button class="action-btn submit-btn" @tap="submitContract" :disabled="!canSubmit">
                提交合同
            </button>
        </view>

    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiGetMerchantCovenant, apiGetCovenantTemplat, apiAddMerchantCovenant } from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'

// 页面参数
const tempId = ref('') // 合同模板ID（只读模式使用）
const contractData = ref({})
const isReadOnly = ref(false) // 必传：是否为只读模式
const needReturnData = ref(false) // 必传：是否需要返回数据给上级页面
const fromMerchant = ref(false) // 是否从merchant页面进入
const contractExpired = ref(false) // 合同是否过期

// 用户信息
const userStore = useUserStore()

// 签名数据
const signatures = ref({
    partyB: ''  // 乙方签名
})


// 富文本合同内容（HTML格式）
const contractContent = ref('')

// HTML实体转码函数
const decodeHtmlEntities = (str) => {
    if (!str) return ''
    return str.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
}

// 检查合同是否过期
const checkContractExpiry = (endTime) => {
    if (!endTime) return false

    try {
        // 解析结束时间（假设格式为 YYYY-MM-DD 或 YYYY年MM月DD日）
        let endDate
        if (endTime.includes('年') && endTime.includes('月') && endTime.includes('日')) {
            // 处理 "2024年12月31日" 格式
            const match = endTime.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
            if (match) {
                const [, year, month, day] = match
                endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            }
        } else {
            // 处理 "2024-12-31" 格式
            endDate = new Date(endTime)
        }

        if (!endDate || isNaN(endDate.getTime())) {
            console.warn('无法解析合同结束时间:', endTime)
            return false
        }

        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0) // 重置时间到当天开始
        endDate.setHours(23, 59, 59, 999) // 设置到当天结束

        const isExpired = currentDate > endDate
        console.log('合同过期检查:', {
            endTime: endTime,
            endDate: endDate.toISOString(),
            currentDate: currentDate.toISOString(),
            isExpired: isExpired
        })

        return isExpired
    } catch (error) {
        console.error('检查合同过期时间失败:', error)
        return false
    }
}

// 计算属性：是否可以提交
const canSubmit = computed(() => {
    return signatures.value.partyB
})

// 页面加载
onLoad((options) => {
    tempId.value = options.tempId || '' // 接收合同模板ID
    isReadOnly.value = options.isReadOnly === 'true' // 必传：是否为只读模式
    needReturnData.value = options.needReturn === 'true' // 必传：是否需要返回数据
    fromMerchant.value = !options.isReadOnly && !options.needReturn // 判断是否从merchant页面进入

    console.log('接收到的状态参数:', {
        isReadOnly: isReadOnly.value,
        needReturnData: needReturnData.value,
        tempId: tempId.value,
        fromMerchant: fromMerchant.value
    })

    // 根据模式加载不同的数据
    if (fromMerchant.value) {
        // 从merchant页面进入，先尝试获取商户合同，没有则获取模板
        loadContractForMerchant()
    } else if (isReadOnly.value) {
        loadMerchantCovenant()
    } else {
        loadCovenantTemplate()
    }

    loadSignatures()
})

// 加载商户合同（只读模式）
const loadMerchantCovenant = async () => {
    console.log('加载商户合同（只读模式）', tempId.value, userStore.merchant?.id,)
    try {
        const result = await apiGetMerchantCovenant({
            tempId: tempId.value,
            merchantId: userStore.merchant?.id,
        })

        if (result.code === 200 && result.data) {
            contractContent.value = decodeHtmlEntities(result.data.content || '')
        } else {
            contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">暂无合同数据</div>'
        }
    } catch (error) {
        uni.showToast({
            title: '加载合同失败',
            icon: 'none'
        })
        contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">加载合同失败</div>'
    }
}

// 加载合同模板（可编辑模式）
const loadCovenantTemplate = async () => {
    try {
        const result = await apiGetCovenantTemplat()

        if (result.code === 200 && result.data && result.data.content) {
            contractContent.value = decodeHtmlEntities(result.data.content)
            contractData.value = result.data
        } else {
            contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">暂无合同模板</div>'
        }
    } catch (error) {
        console.error('加载合同模板失败:', error)
        contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">加载合同模板失败</div>'
    }
}

// 从merchant页面进入的合同加载逻辑
const loadContractForMerchant = async () => {
    try {
        console.log('从merchant页面进入，先尝试获取商户合同')
        // 先尝试获取商户合同
        const merchantResult = await apiGetMerchantCovenant({
            merchantId: userStore.merchant?.id
        })

        if (merchantResult.code === 200 && merchantResult.data && merchantResult.data.content) {
            // 有商户合同，检查是否过期
            const contractData = merchantResult.data
            const isExpired = checkContractExpiry(contractData.endTime)

            if (isExpired) {
                // 合同已过期，需要重新编辑
                console.log('合同已过期，需要重新编辑')
                contractExpired.value = true
                await loadCovenantTemplate()
                isReadOnly.value = false // 设置为可编辑模式
            } else {
                // 合同未过期，只读显示
                console.log('合同未过期，只读显示')
                contractContent.value = decodeHtmlEntities(contractData.content)
                isReadOnly.value = true // 设置为只读模式
            }
        } else {
            // 没有商户合同，获取模板进入编辑模式
            console.log('未找到商户合同，获取模板进入编辑模式')
            await loadCovenantTemplate()
            isReadOnly.value = false // 设置为可编辑模式
        }
    } catch (error) {
        console.error('加载商户合同失败，尝试获取模板:', error)
        // 出错时也尝试获取模板
        await loadCovenantTemplate()
        isReadOnly.value = false
    }
}

// 获取当前日期
const getCurrentDate = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}


// 加载签名数据
const loadSignatures = () => {
    // 初始化签名数据
    signatures.value = {
        partyB: ''
    }
}


// 更新合同内容中的签名显示
const updateContractWithSignature = () => {
    if (signatures.value.partyB) {
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 270px; max-height: 80px; vertical-align: middle; cursor: pointer;" alt="乙方签名" />`
        contractContent.value = contractContent.value.replace(
            '<span id="signature-btn" style="display: inline-block; width: 270px; height: 80px; border: 2px dashed #ccc; border-radius: 8px; margin-left: 10px; text-align: center; line-height: 76px; color: #999; font-size: 16px; cursor: pointer; background: #fafafa; transition: all 0.3s ease;">点击此处签名</span>',
            signatureHtml
        )

        // 签名后自动回填开始日期
        const currentDate = getCurrentDate()
        contractContent.value = contractContent.value.replace(
            '<span id="start-date">________________</span>',
            `<span id="start-date">${currentDate}</span>`
        )
    }
}


// 富文本点击事件
const onRichTextTap = (e) => {
    console.log('富文本点击事件触发:', e)
    // 只在非只读模式下才允许跳转到签名页面
    if (!isReadOnly.value) {
        goToSignature()
    }
}

// 跳转到签名页面
const goToSignature = () => {
    uni.navigateTo({
        url: `/pages/syContract/shSignature`
    })
}



// 提交合同
const submitContract = () => {
    if (!canSubmit.value) {
        uni.showToast({
            title: '请先完成签名',
            icon: 'none'
        })
        return
    }

    uni.showModal({
        title: '确认提交',
        content: '确定要提交合同吗？提交后将无法修改。',
        success: (res) => {
            if (res.confirm) {
                submitContractToServer()
            }
        }
    })
}

// 提交合同到服务器
const submitContractToServer = async () => {
    try {
        uni.showLoading({
            title: '提交中...'
        })

        // 创建包含签名的完整HTML内容
        let finalContractContent = contractContent.value

        // 如果已签名，确保签名图片和日期在HTML中显示
        if (signatures.value.partyB) {
            const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 300px; max-height: 80px; border-radius: 8px; vertical-align: middle; border: 1px solid #e0e0e0;" alt="乙方签名" />`
            finalContractContent = finalContractContent.replace(
                '<span id="signature-btn" style="display: inline-block; width: 270px; height: 80px; border: 2px dashed #ccc; border-radius: 8px; margin-left: 10px; text-align: center; line-height: 76px; color: #999; font-size: 16px; cursor: pointer; background: #fafafa; transition: all 0.3s ease;">点击此处签名</span>',
                signatureHtml
            )

            // 确保日期也正确显示
            const currentDate = getCurrentDate()
            finalContractContent = finalContractContent.replace(
                '<span id="start-date">________________</span>',
                `<span id="start-date">${currentDate}</span>`
            )
        }

        // 提交数据到服务器
        try {
            // 准备提交数据
            const submitData = {
                content: finalContractContent, // 富文本内容
                merchantId: userStore.merchant?.id, // 商户ID
                startTime: getCurrentDate(), // 开始日期
                endTime: contractData.value.endTime, // 结束日期
                tempId: contractData.value.id // 合同模板ID
            }

            console.log('提交合同数据:', submitData)

            // 调用API提交合同
            const response = await apiAddMerchantCovenant(submitData)

            if (response.code === 200) {
                uni.hideLoading()
                uni.showToast({
                    title: '合同提交成功',
                    icon: 'success'
                })

                // 清除签名数据
                signatures.value = {
                    partyB: ''
                }

                // 返回上一页
                setTimeout(() => {
                    uni.navigateBack()
                }, 1500)
            } else {
                throw new Error(response.message || '提交失败')
            }
        } catch (error) {
            uni.hideLoading()
            console.error('提交合同失败:', error)
            uni.showToast({
                title: '提交失败，请重试',
                icon: 'none'
            })
        }

    } catch (error) {
        uni.hideLoading()
        console.error('提交合同失败:', error)
        uni.showToast({
            title: '提交失败，请重试',
            icon: 'none'
        })
    }
}

// 返回上一页
const back = () => {
    // 如果需要返回数据给上级页面，提示用户是否已签名
    if (needReturnData.value && !signatures.value.partyB) {
        uni.showToast({
            title: '请先完成签名',
            icon: 'none'
        })
    }

    uni.navigateBack()
}

// 页面显示时刷新签名状态
onMounted(() => {
    // 监听页面显示事件，刷新签名状态
    uni.$on('signatureUpdated', (signatureData) => {
        signatures.value = signatureData
        updateContractWithSignature()

        // 如果需要返回数据给上级页面，且已签名，才准备返回数据
        if (needReturnData.value && signatures.value.partyB) {
            prepareReturnData()
        }
    })
})

// 准备返回给上级页面的数据
const prepareReturnData = () => {
    // 获取当前日期作为开始日期（回显的开始日期）
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const createTime = `${year}-${month}-${day}`

    // 准备返回的4个值
    const returnData = {
        content: contractContent.value, // 修改后的富文本内容
        createTime: createTime, // 回显的开始日期
        endTime: contractData.value.endTime, // 从result.data获取的结束日期
        id: contractData.value.id // 从result.data获取的合同ID
    }

    console.log('准备返回给上级页面的数据:', returnData)

    // 通过事件传递数据给上级页面
    uni.$emit('contractUpdated', returnData)
}
</script>

<style lang="scss" scoped>
.contract-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

// 合同过期提示样式
.expired-tip {
    background: #fff;
    margin: 20rpx;
    border-radius: 16rpx;
    padding: 20rpx;
    border-left: 4rpx solid #ff9500;

    .tip-content {
        display: flex;
        align-items: center;
        gap: 10rpx;

        .tip-text {
            font-size: 28rpx;
            color: #ff9500;
            font-weight: 500;
        }
    }
}

.contract-content {
    min-height: calc(100vh - 200rpx);
    padding: 20rpx;
    padding-bottom: 140rpx;
    box-sizing: border-box;
}

// 当有底部按钮时，增加底部边距
.contract-container:has(.bottom-actions) .contract-content {
    padding-bottom: 200rpx;
}

.contract-header {
    background: #fff;
    padding: 30rpx;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    text-align: center;

    .contract-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        display: block;
        margin-bottom: 20rpx;
    }

    .contract-date {
        font-size: 28rpx;
        color: #666;
    }
}

.contract-body {
    background: #fff;
    padding: 30rpx;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    min-height: 800rpx;
}

.readonly-tip {
    background: #f8f9fa;
    border-radius: 8rpx;
    padding: 20rpx;
    margin: 20rpx 0;
    display: flex;
    align-items: center;
    gap: 10rpx;
    border-left: 4rpx solid #ff9500;

}

.bottom-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #eee;
    display: flex;
    gap: 20rpx;
    z-index: 100;

    .action-btn {
        flex: 1;
        height: 80rpx;
        border-radius: 40rpx;
        font-size: 32rpx;
        font-weight: bold;
        border: none;

        &.signature-btn {
            background: #ff9500;
            color: #fff;
        }

        &.preview-btn {
            background: #f0f0f0;
            color: #666;
        }

        &.submit-btn {
            background: linear-gradient(135deg, #07c160 0%, #10ad6a 100%);
            color: #fff;

            &:disabled {
                background: #ccc;
                color: #999;
            }
        }
    }
}

// 富文本样式调整
:deep(.rich-text) {
    font-size: 28rpx;
    line-height: 1.6;
    color: #333;
}

// 底部操作按钮样式
.bottom-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #eee;
    z-index: 100;

    .action-btn {
        width: 100%;
        height: 80rpx;
        border-radius: 40rpx;
        font-size: 32rpx;
        font-weight: bold;
        border: none;

        &.submit-btn {
            background: linear-gradient(135deg, #07c160 0%, #10ad6a 100%);
            color: #fff;

            &:disabled {
                background: #ccc;
                color: #999;
            }
        }
    }
}
</style>