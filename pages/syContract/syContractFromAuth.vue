<!-- 从认证页面进入的合同页面 -->
<template>
    <view class="contract-container">
        <!-- 导航栏 -->
        <PageHeader title="电子合同" @back="back" />
        <!-- 合同内容区域 -->
        <scroll-view class="contract-content" scroll-y>
            <!-- 富文本合同内容 -->
            <view class="contract-body">
                <mp-html :content="contractContent" @tap="onRichTextTap"></mp-html>
                <!-- 可编辑模式下的点击区域 -->
                <view v-if="!isReadOnly" class="click-overlay" @tap="onRichTextTap">
                    <view class="click-hint">点击此处修改签名</view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiGetMerchantCovenant, apiGetCovenantTemplat } from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'
import PageHeader from '@/components/PageHeader/PageHeader.vue'

// 页面参数
const tempId = ref('') // 合同模板ID
const contractData = ref({})
const hasContract = ref(false) // 是否有已存在的合同
const existingContent = ref('') // 已存在的合同内容
const existingStartTime = ref('') // 已存在的开始时间
const existingEndTime = ref('') // 已存在的结束时间
const isReadOnly = ref(false) // 是否只读模式

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

// 页面加载
onLoad((options) => {
    tempId.value = options.tempId || '' // 接收合同模板ID
    hasContract.value = options.hasContract === 'true' // 是否有已存在的合同
    existingContent.value = options.content ? decodeURIComponent(options.content) : '' // 已存在的合同内容
    existingStartTime.value = options.startTime || '' // 已存在的开始时间
    existingEndTime.value = options.endTime || '' // 已存在的结束时间
    isReadOnly.value = options.isReadOnly === 'true' // 是否只读模式


    // 如果有已存在的合同，直接显示；否则先尝试获取商户合同，没有则获取模板
    if (hasContract.value && existingContent.value) {
        loadExistingContract()
    } else {
        loadContractForAuth()
    }
    loadSignatures()
})

// 加载已存在的合同内容
const loadExistingContract = () => {
    console.log('===== 加载已存在的合同内容 =====')
    contractContent.value = decodeHtmlEntities(existingContent.value)

    // 设置合同数据
    contractData.value = {
        content: existingContent.value,
        createTime: existingStartTime.value,
        endTime: existingEndTime.value,
        id: '' // ID暂时为空
    }

    console.log('已存在合同内容加载完成:', contractContent.value)
}


// 从认证页面进入的合同加载逻辑
const loadContractForAuth = async () => {
    try {
        // 先尝试获取商户合同
        const merchantResult = await apiGetMerchantCovenant({
            merchantId: userStore.merchant?.id
        })

        if (merchantResult.code === 200 && merchantResult.data && merchantResult.data.content) {
            // 有商户合同，直接显示
            console.log('找到商户合同，直接显示')
            contractContent.value = decodeHtmlEntities(merchantResult.data.content)
            contractData.value = merchantResult.data
        } else {
            // 没有商户合同，获取模板进入编辑模式
            console.log('未找到商户合同，获取模板进入编辑模式')
            await loadCovenantTemplate()
        }
    } catch (error) {
        console.error('加载商户合同失败，尝试获取模板:', error)
        // 出错时也尝试获取模板
        await loadCovenantTemplate()
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
    console.log('===== 开始更新合同签名 =====')
    console.log('当前签名数据:', signatures.value)
    console.log('当前合同内容:', contractContent.value)

    if (signatures.value.partyB) {
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 270px; max-height: 80px; vertical-align: middle; cursor: pointer;" alt="乙方签名" />`

        // 替换签名按钮或已存在的签名图片
        contractContent.value = contractContent.value.replace(
            /<span id="signature-btn"[^>]*>点击此处签名<\/span>/g,
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

        console.log('更新后的合同内容:', contractContent.value)
        console.log('===== 合同签名更新完成 =====')
    }
}

// 富文本点击事件
const onRichTextTap = (e) => {
    console.log('富文本点击事件触发:', e)
    console.log('isReadOnly:', isReadOnly.value)

    if (isReadOnly.value) {
        // 只读模式，不跳转签名
        console.log('只读模式，不跳转签名')
        return
    }

    // 可编辑模式，跳转签名
    console.log('可编辑模式，跳转签名')
    goToSignature()
}

// 跳转到签名页面
const goToSignature = () => {
    uni.navigateTo({
        url: `/pages/syContract/shSignature`
    })
}

// 返回上一页
const back = () => {
    // 如果没有签名，直接返回
    if (!signatures.value.partyB) {
        uni.navigateBack()
        return
    }
    // 已签名，先准备返回数据，再返回
    prepareReturnData()
}

// 页面显示时刷新签名图片
onMounted(() => {
    // 监听页面显示事件，刷新签名图片
    uni.$on('signatureUpdated', (signatureData) => {
        console.log('===== 收到签名更新事件 =====')
        console.log('签名数据:', signatureData)
        signatures.value = signatureData
        updateContractWithSignature()
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

    // 通过事件传递数据给上级页面

    uni.$emit('contractUpdated', returnData);
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.contract-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.contract-content {
    min-height: calc(100vh - 200rpx);
    padding: 20rpx;
    padding-bottom: 140rpx;
    box-sizing: border-box;
}


.contract-body {
    background: #fff;
    padding: 30rpx;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    min-height: 800rpx;
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
    z-index: 100;


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

.contract-body {
    position: relative;
}
</style>
