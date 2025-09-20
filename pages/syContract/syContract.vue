<template>
    <view class="contract-container">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="合同详情"
            @clickLeft="back" />

        <!-- 合同内容区域 -->
        <scroll-view class="contract-content" scroll-y>
            <!-- 合同标题 -->
            <view class="contract-header">
                <text class="contract-title">{{ contractData.title || '垃圾收运服务合同' }}</text>
                <text class="contract-date">签订日期：{{ contractData.date || '2024年1月1日' }}</text>
            </view>

            <!-- 富文本合同内容 -->
            <view class="contract-body">
                <mp-html :content="contractContent" @tap="onRichTextTap"></mp-html>
            </view>
        </scroll-view>

        <!-- 底部操作按钮 -->
        <view class="bottom-actions">
            <button class="action-btn signature-btn" @click="goToSignature">
                {{ signatures.partyB ? '修改签名' : '签名' }}
            </button>
            <button class="action-btn preview-btn" @click="goToPreview">预览</button>
            <button class="action-btn submit-btn" :disabled="!canSubmit" @click="submitContract">
                提交
            </button>
        </view>

        <!-- 隐藏的canvas用于生成合同图片 -->
        <canvas canvas-id="contractCanvas" id="contractCanvas"
            style="position: fixed; top: -9999px; left: -9999px; width: 750rpx; height: 2000rpx;"></canvas>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 页面参数
const contractId = ref('')
const contractData = ref({})

// 签名数据
const signatures = ref({
    partyB: ''  // 乙方签名
})

// 富文本合同内容（HTML格式）
const contractContent = ref(`
<div style="font-size: 16px; line-height: 1.8; color: #333; padding: 20px;">
    <h2 style="text-align: center; margin-bottom: 30px; color: #333;">垃圾收运服务合同</h2>
    
    <p><strong>甲方（商户）：</strong>________________</p>
    <p><strong>乙方（收运方）：</strong>________________</p>
    
    <p style="margin: 20px 0;">根据《中华人民共和国合同法》及相关法律法规，甲乙双方在平等、自愿、协商一致的基础上，就垃圾收运服务事宜达成如下协议：</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第一条 服务内容</h3>
    <p>乙方为甲方提供垃圾收运服务，包括但不限于：</p>
    <ol style="margin: 10px 0; padding-left: 20px;">
        <li>定期上门收集生活垃圾；</li>
        <li>按照环保要求进行分类处理；</li>
        <li>提供收运服务相关证明文件。</li>
    </ol>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第二条 服务时间</h3>
    <p>服务时间：每周一、三、五上午8:00-12:00</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第三条 费用标准</h3>
    <p>服务费用：每月500元，按季度结算。</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第四条 双方权利义务</h3>
    <p><strong>甲方权利：</strong></p>
    <ol style="margin: 10px 0; padding-left: 20px;">
        <li>要求乙方按时提供收运服务；</li>
        <li>对服务质量进行监督。</li>
    </ol>
    
    <p><strong>甲方义务：</strong></p>
    <ol style="margin: 10px 0; padding-left: 20px;">
        <li>按时支付服务费用；</li>
        <li>配合乙方收运工作。</li>
    </ol>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第五条 违约责任</h3>
    <p>任何一方违反本合同约定，应承担相应的违约责任。</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第六条 合同期限</h3>
    <p>本合同自双方签字盖章之日起生效，有效期为一年。</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第七条 争议解决</h3>
    <p>因本合同引起的争议，双方应友好协商解决；协商不成的，可向有管辖权的人民法院起诉。</p>
    
    <div style="margin-top: 40px;">
        <p><strong>乙方（签字）：</strong><span id="signature-btn" style="padding: 8px 16px; background: #07c160; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: inline-block; margin-left: 10px;">点击签名</span></p>
        <p><strong>日期：</strong>________________</p>
    </div>
</div>
`)

// 计算属性：是否可以提交
const canSubmit = computed(() => {
    return signatures.value.partyB
})

// 页面加载
onLoad((options) => {
    contractId.value = options.id || ''
    loadContractData()
    loadSignatures()
})

// 加载合同数据
const loadContractData = async () => {
    try {
        // 模拟API调用
        contractData.value = {
            title: '垃圾收运服务合同',
            date: '2024年1月1日',
            content: contractContent.value
        }
    } catch (error) {
        console.error('加载合同数据失败:', error)
        uni.showToast({
            title: '加载合同失败',
            icon: 'none'
        })
    }
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
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 150px; max-height: 40px; border-radius: 4px; vertical-align: middle;" alt="乙方签名" />`
        contractContent.value = contractContent.value.replace(
            '<span id="signature-btn" style="padding: 8px 16px; background: #07c160; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: inline-block; margin-left: 10px;">点击签名</span>',
            signatureHtml
        )
    }
}

// 富文本点击事件
const onRichTextTap = (e) => {
    console.log('富文本点击事件触发:', e)
    // 点击富文本区域时跳转到签名页面
    goToSignature()
}

// 跳转到签名页面
const goToSignature = () => {
    uni.navigateTo({
        url: `/pages/syContract/shSignature?contractId=${contractId.value}`
    })
}

// 跳转到预览页面
const goToPreview = () => {
    // 创建预览内容，包含签名
    let content = contractContent.value

    // 如果已签名，确保签名图片在预览中显示
    if (signatures.value.partyB) {
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 150px; max-height: 40px; border-radius: 4px; vertical-align: middle;" alt="乙方签名" />`
        content = content.replace(
            '<span id="signature-btn" style="padding: 8px 16px; background: #07c160; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: inline-block; margin-left: 10px;">点击签名</span>',
            signatureHtml
        )
    }

    uni.navigateTo({
        url: `/pages/syContract/syPreview?content=${encodeURIComponent(content)}&title=${encodeURIComponent(contractData.value.title || '垃圾收运服务合同')}`
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

        // 将HTML合同内容转换为图片并保存
        try {
            // 等待页面渲染完成
            await new Promise(resolve => setTimeout(resolve, 500))

            // 使用uni-app的截图功能截取合同内容区域
            uni.createSelectorQuery()
                .select('.contract-body')
                .fields({
                    node: true,
                    size: true,
                    rect: true
                })
                .exec(async (res) => {
                    if (res[0]) {
                        try {
                            // 使用uni-app的截图API直接截取页面区域
                            uni.createSelectorQuery()
                                .select('.contract-body')
                                .boundingClientRect()
                                .exec(async (rectRes) => {
                                    if (rectRes[0]) {
                                        // 使用canvas绘制合同内容
                                        const ctx = uni.createCanvasContext('contractCanvas')

                                        // 设置canvas尺寸 - 使用固定尺寸确保完整显示
                                        const dpr = uni.getSystemInfoSync().pixelRatio
                                        const width = 750 * dpr  // 固定宽度
                                        const height = 2000 * dpr  // 足够的高度

                                        // 绘制白色背景
                                        ctx.setFillStyle('#ffffff')
                                        ctx.fillRect(0, 0, width, height)

                                        // 绘制合同内容（这里需要手动绘制文本内容）
                                        ctx.setFillStyle('#333333')
                                        ctx.setFontSize(16 * dpr)
                                        ctx.setTextAlign('left')

                                        // 绘制合同标题
                                        ctx.setFontSize(20 * dpr)
                                        ctx.fillText('垃圾收运服务合同', 20 * dpr, 50 * dpr)

                                        // 绘制合同内容
                                        ctx.setFontSize(14 * dpr)
                                        const contractText = contractContent.value.replace(/<[^>]*>/g, '') // 移除HTML标签
                                        const lines = contractText.split('\n')
                                        let y = 100 * dpr
                                        const lineHeight = 25 * dpr
                                        const maxWidth = width - 40 * dpr

                                        lines.forEach(line => {
                                            if (line.trim()) {
                                                // 处理长文本换行
                                                const words = line.trim().split('')
                                                let currentLine = ''
                                                let currentY = y

                                                words.forEach(char => {
                                                    currentLine += char
                                                    if (currentLine.length > 50) { // 每行最多50个字符
                                                        ctx.fillText(currentLine, 20 * dpr, currentY)
                                                        currentLine = ''
                                                        currentY += lineHeight
                                                    }
                                                })

                                                if (currentLine) {
                                                    ctx.fillText(currentLine, 20 * dpr, currentY)
                                                    currentY += lineHeight
                                                }

                                                y = currentY + 10 * dpr // 段落间距
                                            }
                                        })

                                        // 如果有签名，绘制签名
                                        if (signatures.value.partyB) {
                                            ctx.drawImage(signatures.value.partyB, 20 * dpr, y, 200 * dpr, 80 * dpr)
                                        }

                                        ctx.draw(false, () => {
                                            // 将canvas转换为图片
                                            uni.canvasToTempFilePath({
                                                canvasId: 'contractCanvas',
                                                success: async (canvasRes) => {
                                                    try {
                                                        // 保存合同图片到本地相册
                                                        await uni.saveImageToPhotosAlbum({
                                                            filePath: canvasRes.tempFilePath,
                                                            success: () => {
                                                                console.log('合同图片已保存到相册')
                                                                uni.showToast({
                                                                    title: '合同图片已保存',
                                                                    icon: 'success'
                                                                })
                                                            },
                                                            fail: (error) => {
                                                                console.warn('保存合同图片到相册失败:', error)
                                                                uni.showToast({
                                                                    title: '保存失败',
                                                                    icon: 'none'
                                                                })
                                                            }
                                                        })
                                                    } catch (error) {
                                                        console.warn('保存合同图片失败:', error)
                                                    }
                                                },
                                                fail: (error) => {
                                                    console.warn('生成合同图片失败:', error)
                                                    uni.showToast({
                                                        title: '生成图片失败',
                                                        icon: 'none'
                                                    })
                                                }
                                            })
                                        })
                                    }
                                })
                        } catch (error) {
                            console.warn('生成合同图片失败:', error)
                        }
                    }
                })
        } catch (error) {
            console.warn('保存合同失败:', error)
        }

        // 模拟API调用
        setTimeout(() => {
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
        }, 2000)

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

.contract-content {
    min-height: calc(100vh - 200rpx);
    padding: 20rpx;
    padding-bottom: 140rpx;
    box-sizing: border-box;
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
</style>