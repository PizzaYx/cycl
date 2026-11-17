<template>
    <view class="contract-container">
        <!-- 导航栏 -->
        <PageHeader title="合同详情" @back="back" />

        <!-- 合同状态提示 -->
        <view v-if="contractData.endTime" class="contract-tip" :class="{ 'expired': contractExpired }">
            <view class="tip-content">
                <uni-icons :type="contractExpired ? 'info' : 'calendar'" size="16"
                    :color="contractExpired ? '#ff9500' : 'rgba(7, 193, 96, 1)'"></uni-icons>
                <text class="tip-text">
                    {{ contractExpired ? '您的合同已过期，请重新签署合同' : `您的合同截止到 ${contractData.endTime} 到期` }}
                </text>
            </view>
        </view>


        <!-- 合同内容区域 -->
        <scroll-view class="contract-content" scroll-y>
            <!-- 富文本合同内容 -->
            <view class="contract-body">
                <mp-html :content="contractContent"></mp-html>
                <!-- 可编辑模式下的点击区域 -->
                <view v-if="!isReadOnly" class="click-overlay" @tap="onRichTextTap">
                    <view class="click-hint">点击此处修改签名</view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部按钮 -->
        <view class="bottom-actions">
            <button v-if="!isReadOnly" class="action-btn submit-btn" @tap="submitContract" :disabled="!canSubmit">
                提交合同
            </button>
            <button v-if="isReadOnly && !contractExpired" class="action-btn submit-btn" @tap="downloadContract">
                保存合同
            </button>
        </view>

    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiGetMerchantCovenant, apiGetCovenantTemplat, apiAddMerchantCovenant } from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'
import PageHeader from '@/components/PageHeader/PageHeader.vue'

// 页面参数
const tempId = ref('') // 合同模板ID
const contractData = ref({})
const isReadOnly = ref(false) // 是否为只读模式
const contractExpired = ref(false) // 合同是否过期

// 用户信息
const userStore = useUserStore()

// 签名数据
const signatures = ref({
    partyB: ''  // 乙方签名
})


// 甲方公章URL
const COMPANY_SEAL_URL = 'https://cc.cdlians.tech:8883/upload/2026/08/04/a8NNtrGaRQh882f35874f5fb7a67edfda697970f9c2c_20260804104234A162.png'

// 添加甲方公章（仅前端显示，审核通过后）
const addCompanySeal = () => {
    if (!isReadOnly.value || contractExpired.value) return

    let content = contractContent.value

    // 先移除已有公章（避免重复）
    content = content.replace(/<img[^>]*alt="甲方公章"[^>]*\/?>/g, '')

    // 在收运单位(甲方)后面的公司名称上覆盖公章（跨标签匹配，兼容新旧模板结构）
    const sealImg = `<img src="${COMPANY_SEAL_URL}" style="position: absolute; left: 60%; top: 30%; transform: translate(-50%, -50%); max-width: 120px; max-height: 120px; opacity: 0.85; pointer-events: none;" alt="甲方公章" />`
    content = content.replace(
        /(收运单位\(甲方\)[\s\S]*?<div[^>]*>)(成都市新津蓉澄净环保科技有限公司)/,
        `$1<span style="position: relative; display: inline-block;">$2${sealImg}</span>`
    )

    contractContent.value = content
}

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
    isReadOnly.value = options.isReadOnly === 'true' // 是否为只读模式

    console.log('===== syContract.vue 页面加载 =====')
    console.log('接收到的状态参数:', {
        isReadOnly: isReadOnly.value,
        tempId: tempId.value
    })

    // 先尝试获取商户合同，没有则获取模板
    loadContractForMerchant()
    loadSignatures()
})



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

// 填充合同模板信息（乙方名称和日期）
const fillContractTemplate = () => {
    const merchantName = userStore.currentMerchant?.name || ''
    const startTime = getCurrentDate()
    const endTime = contractData.value.endTime || ''

    console.log('===== 开始填充合同模板 =====')
    console.log('商户名称:', merchantName)
    console.log('开始时间:', startTime)
    console.log('结束时间:', endTime)

    let content = contractContent.value

    // 1. 填充商户名称到"乙方(餐厨单位)："位置
    content = content.replace(
        /(<div><span style="font-weight: bold; color: #000;">乙方\(餐厨单位\)：<\/span>\s*<div style="margin-top: 4px; border-bottom: 1px solid #333; height: 20px;">)[^<]*(<\/div>)/,
        `$1${merchantName || '&nbsp;'}$2`
    )

    // 2. 填充商户名称到"餐厨单位(乙方)："位置（签名部分）
    content = content.replace(
        /(<div style="font-weight: bold; margin-bottom: 5px;">餐厨单位\(乙方\)：<\/div>\s*<div style="border-bottom: 1px solid #333; height: 30px;">)[^<]*(<\/div>)/,
        `$1${merchantName || '&nbsp;'}$2`
    )

    // 3. 填充合同有效期日期
    if (endTime) {
        const startDate = new Date(startTime)
        const startYear = startDate.getFullYear()
        const startMonth = startDate.getMonth() + 1
        const startDay = startDate.getDate()

        const endDate = new Date(endTime)
        const endYear = endDate.getFullYear()
        const endMonth = endDate.getMonth() + 1
        const endDay = endDate.getDate()

        const beforeReplace = content

        content = content.replace(
            /本合同有效期自\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*40px;\s*text-align:\s*center;">[^<]*<\/span>\s*年\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*月\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*日至\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*40px;\s*text-align:\s*center;">[^<]*<\/span>\s*年\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*月\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*日止/,
            `本合同有效期自 <span style="border-bottom: 1px solid #333; display: inline-block; width: 40px; text-align: center;">${startYear}</span>年 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${startMonth}</span>月 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${startDay}</span>日至 <span style="border-bottom: 1px solid #333; display: inline-block; width: 40px; text-align: center;">${endYear}</span>年 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${endMonth}</span>月 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${endDay}</span>日止`
        )

        if (beforeReplace === content) {
            console.log('警告：日期替换未生效')
        } else {
            console.log('日期替换成功')
        }
    } else {
        console.log('警告：没有结束时间，跳过日期填充')
    }

    contractContent.value = content
    console.log('===== 合同模板填充完成 =====')
}

// 从merchant页面进入的合同加载逻辑
const loadContractForMerchant = async () => {
    try {
        console.log('从merchant页面进入，先尝试获取商户合同', userStore.currentMerchant?.id)
        // 先尝试获取商户合同
        const merchantResult = await apiGetMerchantCovenant({
            merchantId: userStore.currentMerchant?.id,
        })

        if (merchantResult.code === 200 && merchantResult.data && merchantResult.data.content) {
            // 有商户合同，检查是否过期
            const merchantContractData = merchantResult.data
            const isExpired = checkContractExpiry(merchantContractData.endTime)

            if (isExpired) {
                // 合同已过期，需要重新编辑
                console.log('合同已过期，需要重新编辑')
                contractExpired.value = true
                await loadCovenantTemplate()
                isReadOnly.value = false // 设置为可编辑模式
                // 用新模板数据填充乙方名称和日期
                fillContractTemplate()
            } else {
                // 合同未过期，只读显示
                console.log('合同未过期，只读显示')
                contractContent.value = decodeHtmlEntities(merchantContractData.content)
                contractData.value = merchantContractData // 设置合同数据，包含endTime
                isReadOnly.value = true // 设置为只读模式
                // 审核通过后显示甲方公章
                addCompanySeal()
            }
        } else {
            // 没有商户合同，获取模板进入编辑模式
            console.log('未找到商户合同，获取模板进入编辑模式')
            await loadCovenantTemplate()
            isReadOnly.value = false // 设置为可编辑模式
            // 首次签约也填充乙方名称和日期
            fillContractTemplate()
        }
    } catch (error) {
        console.error('加载商户合同失败，尝试获取模板:', error)
        // 出错时也尝试获取模板
        await loadCovenantTemplate()
        isReadOnly.value = false
        fillContractTemplate()
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

        // 替换签名按钮（span格式）：<span id="signature-btn">点击此处签名</span>
        contractContent.value = contractContent.value.replace(
            /<span id="signature-btn"[^>]*>[^<]*<\/span>/g,
            signatureHtml
        )

        // 替换签名按钮（div格式）：<div id="signature-btn">点击此处进行电子签名</div>
        contractContent.value = contractContent.value.replace(
            /<div id="signature-btn"[^>]*>[^<]*<\/div>/g,
            signatureHtml
        )

        // 如果已经有签名图片，替换它
        contractContent.value = contractContent.value.replace(
            /<img[^>]*alt="乙方签名"[^>]*>/g,
            signatureHtml
        )

        // 签名后自动回填开始日期
        const currentDate = getCurrentDate()
        contractContent.value = contractContent.value.replace(
            /<span id="start-date">[^<]*<\/span>/g,
            `<span id="start-date">${currentDate}</span>`
        )

        // 同时更新 contractData 中的时间
        contractData.value.createTime = currentDate
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
                merchantId: userStore.currentMerchant?.id, // 商户ID
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
    uni.navigateBack()
}

// 下载合同
const downloadContract = () => {
    const merchantId = userStore.currentMerchant?.id || ''
    const url = `/pages/syContract/contractWebview/contractWebview?merchantId=${encodeURIComponent(merchantId)}`
    console.log('跳转webview URL:', url)
    uni.navigateTo({
        url
    })
}

// 页面显示时刷新签名状态
onMounted(() => {
    // 监听页面显示事件，刷新签名状态
    uni.$on('signatureUpdated', (signatureData) => {
        signatures.value = signatureData
        updateContractWithSignature()
    })
})

</script>

<style lang="scss" scoped>
.contract-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

// 合同状态提示样式
.contract-tip {
    background: #fff;
    margin: 20rpx;
    border-radius: 16rpx;
    padding: 20rpx;
    border-left: 4rpx solid rgba(7, 193, 96, 1);

    .tip-content {
        display: flex;
        align-items: center;
        gap: 10rpx;

        .tip-text {
            font-size: 28rpx;
            color: rgba(7, 193, 96, 1);
            font-weight: 500;
        }
    }

    // 过期状态样式
    &.expired {
        border-left-color: #ff9500;

        .tip-text {
            color: #ff9500;
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
    position: relative;
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

// 点击覆盖层样式
.click-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    .click-hint {
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 20rpx 40rpx;
        border-radius: 10rpx;
        font-size: 28rpx;
        opacity: 0;
        transition: opacity 0.3s;
    }

    &:active .click-hint {
        opacity: 1;
    }
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