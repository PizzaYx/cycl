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
const merchantName = ref('') // 商户名称

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
    merchantName.value = options.merchantName ? decodeURIComponent(options.merchantName) : '' // 接收商户名称

    console.log('===== syContractFromAuth 接收到的参数 =====')
    console.log('商户名称:', merchantName.value)
    console.log('是否只读:', isReadOnly.value)
    console.log('是否有合同:', hasContract.value)
    console.log('开始时间(existingStartTime):', existingStartTime.value)
    console.log('结束时间(existingEndTime):', existingEndTime.value)
    console.log('所有参数:', options)

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

    // 填充商户名称和日期
    fillContractTemplate()
}


// 从认证页面进入的合同加载逻辑
const loadContractForAuth = async () => {
    try {
        // 先尝试获取商户合同
        const merchantResult = await apiGetMerchantCovenant({
            merchantId: userStore.contractContent?.id
        })

        if (merchantResult.code === 200 && merchantResult.data && merchantResult.data.content) {
            // 有商户合同，直接显示
            console.log('找到商户合同，直接显示')
            contractContent.value = decodeHtmlEntities(merchantResult.data.content)
            contractData.value = merchantResult.data
            // 填充商户名称和日期
            fillContractTemplate()
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
            // 填充商户名称和日期
            fillContractTemplate()
        } else {
            contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">暂无合同模板</div>'
        }
    } catch (error) {
        console.error('加载合同模板失败:', error)
        contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">加载合同模板失败</div>'
    }
}

// 填充合同模板信息（商户名称和日期）
const fillContractTemplate = () => {
    console.log('===== 开始填充合同模板 =====')
    console.log('商户名称:', merchantName.value)
    console.log('开始时间:', existingStartTime.value || contractData.value.createTime)
    console.log('结束时间:', existingEndTime.value || contractData.value.endTime)

    let content = contractContent.value

    // 1. 填充商户名称到"乙方(餐厨单位)："位置
    // 找到第一个乙方位置（在基本信息部分）
    // 更宽松的正则，匹配任何内容（不仅仅是 &nbsp;）
    content = content.replace(
        /(<div><span style="font-weight: bold; color: #000;">乙方\(餐厨单位\)：<\/span>\s*<div style="margin-top: 4px; border-bottom: 1px solid #333; height: 20px;">)[^<]*(<\/div>)/,
        `$1${merchantName.value || '&nbsp;'}$2`
    )

    // 2. 填充商户名称到"餐厨单位(乙方)："位置（签名部分）
    content = content.replace(
        /(<div style="font-weight: bold; margin-bottom: 5px;">餐厨单位\(乙方\)：<\/div>\s*<div style="border-bottom: 1px solid #333; height: 30px;">)[^<]*(<\/div>)/,
        `$1${merchantName.value || '&nbsp;'}$2`
    )

    // 3. 填充合同有效期日期
    // 获取开始时间和结束时间
    let startTime = existingStartTime.value || contractData.value.createTime || ''
    const endTime = existingEndTime.value || contractData.value.endTime || ''

    console.log('原始开始时间:', startTime)
    console.log('原始结束时间:', endTime)
    console.log('contractData.value:', contractData.value)

    // 如果没有开始时间，使用当前日期
    if (!startTime) {
        startTime = getCurrentDate()
        console.log('使用当前日期作为开始时间:', startTime)
    }

    // 只要有结束时间就进行填充
    if (endTime) {
        // 解析开始日期
        const startDate = new Date(startTime)
        const startYear = startDate.getFullYear()
        const startMonth = startDate.getMonth() + 1
        const startDay = startDate.getDate()

        // 解析结束日期
        const endDate = new Date(endTime)
        const endYear = endDate.getFullYear()
        const endMonth = endDate.getMonth() + 1
        const endDay = endDate.getDate()

        console.log('解析后的日期:', {
            startYear, startMonth, startDay,
            endYear, endMonth, endDay
        })

        // 替换合同有效期的6个空白位置
        // 使用更宽松的正则表达式，允许空格和换行
        const beforeReplace = content

        // 尝试多个正则表达式模式
        // 模式1：标准格式（可能有空格）
        let pattern1 = /本合同有效期自\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*40px;\s*text-align:\s*center;">[^<]*<\/span>\s*年\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*月\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*日至\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*40px;\s*text-align:\s*center;">[^<]*<\/span>\s*年\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*月\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*日止/

        content = content.replace(
            pattern1,
            `本合同有效期自 <span style="border-bottom: 1px solid #333; display: inline-block; width: 40px; text-align: center;">${startYear}</span>年 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${startMonth}</span>月 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${startDay}</span>日至 <span style="border-bottom: 1px solid #333; display: inline-block; width: 40px; text-align: center;">${endYear}</span>年 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${endMonth}</span>月 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${endDay}</span>日止`
        )

        if (beforeReplace === content) {
            console.log('警告：日期替换未生效，正在打印相关内容以便调试')
            // 查找是否存在"本合同有效期自"
            const hasText = content.includes('本合同有效期自')
            console.log('是否包含"本合同有效期自":', hasText)
            if (hasText) {
                // 提取相关部分查看
                const index = content.indexOf('本合同有效期自')
                const excerpt = content.substring(index, index + 500)
                console.log('相关HTML片段:', excerpt)
            }
        } else {
            console.log('日期替换成功')
        }
    } else {
        console.log('警告：没有结束时间，跳过日期填充')
    }

    contractContent.value = content
    console.log('===== 合同模板填充完成 =====')
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
    console.log('当前合同内容长度:', contractContent.value.length)

    if (signatures.value.partyB) {
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 270px; max-height: 80px; vertical-align: middle; cursor: pointer;" alt="乙方签名" />`

        let content = contractContent.value
        const beforeReplace = content

        // 替换签名按钮（旧格式）：<span id="signature-btn">点击此处签名</span>
        content = content.replace(
            /<span id="signature-btn"[^>]*>[^<]*<\/span>/g,
            signatureHtml
        )

        // 替换签名按钮（新格式）：<div id="signature-btn" ...>点击此处进行电子签名</div>
        content = content.replace(
            /<div id="signature-btn"[^>]*>[^<]*<\/div>/g,
            signatureHtml
        )

        // 如果已经有签名图片，替换它
        content = content.replace(
            /<img[^>]*alt="乙方签名"[^>]*>/g,
            signatureHtml
        )

        if (beforeReplace !== content) {
            console.log('签名替换成功')
        } else {
            console.log('警告：签名替换未生效，查找签名按钮位置')
            // 输出部分内容帮助调试
            const signatureBtnIndex = content.indexOf('signature-btn')
            if (signatureBtnIndex > -1) {
                console.log('找到 signature-btn 位置:', signatureBtnIndex)
                console.log('相关HTML片段:', content.substring(signatureBtnIndex - 50, signatureBtnIndex + 200))
            } else {
                console.log('未找到 signature-btn')
            }
        }

        contractContent.value = content

        // 签名后自动回填开始日期（如果模板中有 start-date）
        const currentDate = getCurrentDate()
        contractContent.value = contractContent.value.replace(
            /<span id="start-date">[^<]*<\/span>/g,
            `<span id="start-date">${currentDate}</span>`
        )

        // 同时更新 contractData 中的时间
        contractData.value.createTime = currentDate

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
