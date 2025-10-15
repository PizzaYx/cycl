<!-- 认证界面 -->
<template>
    <view class="auth-container">
        <PageHeader title="商户认证" @back="back" />
        <!-- 步骤条 -->
        <view class="step-container">
            <view class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
                <view class="step-circle">
                    <text class="step-number" v-if="currentStep <= 1">1</text>
                    <text class="step-check" v-else>✓</text>
                </view>
                <text class="step-label">申请认证</text>
            </view>
            <view class="step-line" :class="{ active: currentStep > 1 }"></view>
            <view class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
                <view class="step-circle">
                    <text class="step-number" v-if="currentStep <= 2">2</text>
                    <text class="step-check" v-else>✓</text>
                </view>
                <text class="step-label">待审核</text>
            </view>
            <view class="step-line" :class="{ active: currentStep > 2 }"></view>
            <view class="step-item" :class="{ active: currentStep >= 3 }">
                <view class="step-circle">
                    <text class="step-number">3</text>
                </view>
                <text class="step-label">认证完成</text>
            </view>
        </view>

        <!-- 认证表单 -->
        <view class="auth-form">
            <view class="form-section" :class="{ readonly: isReadOnly }">
                <view class="status-tip" v-if="isReadOnly">
                    <view class="tip-content" v-if="authStatus === 'pending'">
                        <uni-icons type="info" size="16" color="#ff9500"></uni-icons>
                        <text class="tip-text">您的认证申请正在审核中，请耐心等待</text>
                    </view>
                    <view class="tip-content approved" v-else-if="authStatus === 'approved'">
                        <uni-icons type="checkmarkempty" size="16" color="#07c160"></uni-icons>
                        <text class="tip-text">恭喜！您的商户认证已通过</text>
                    </view>
                </view>

                <!-- 审核不通过提示 -->
                <view class="status-tip" v-if="authStatus === 'rejected'">
                    <view class="tip-content rejected">
                        <uni-icons type="closeempty" size="16" color="#ff4444"></uni-icons>
                        <text class="tip-text">很抱歉，您的认证申请未通过审核，请重新提交</text>
                    </view>
                </view>
                <text class="section-title">基本信息</text>

                <!-- 使用uni-forms表单组件 -->
                <uni-forms ref="formRef" :modelValue="formData" :rules="formRules" label-position="top">
                    <uni-forms-item label="商户名称" name="merchantName" :required="!isReadOnly">
                        <view class="merchant-name-input">
                            <input v-model="formData.merchantName" placeholder="请输入商户名称" :disabled="isReadOnly"
                                class="input-field" placeholder-class="custom-placeholder" />
                            <image v-if="!isReadOnly" src="/static/shd/right.png" mode="aspectFit" class="arrow-icon"
                                @click="showMerchantList" />
                        </view>
                    </uni-forms-item>

                    <uni-forms-item label="商户地址" name="address" :required="!isReadOnly">
                        <input v-model="formData.address" placeholder="请输入详细地址" :disabled="isReadOnly"
                            class="input-field" placeholder-class="custom-placeholder" />
                    </uni-forms-item>

                    <uni-forms-item label="所属区域" name="appcode" :required="!isReadOnly">
                        <!-- 只读模式：使用input显示 -->
                        <input v-if="isReadOnly" :value="getSelectedAreaText()" :disabled="true" class="input-field" />
                        <!-- 可编辑模式：使用uni-data-select -->
                        <view v-else class="area-select-wrapper">
                            <uni-data-select v-model="formData.appcode" :localdata="appCodeOptions" mode="selector"
                                :clear="false" :hideRight="true" class="area-select">
                                <template v-slot:selected="{ selectedItems }">
                                    <view class="custom-selected">
                                        <text v-if="selectedItems.length > 0" class="selected-text">
                                            {{ selectedItems[0].text }}
                                        </text>
                                        <text v-else class="placeholder-text">请选择区域</text>
                                    </view>
                                </template>
                            </uni-data-select>
                            <image src="/static/shd/right.png" mode="aspectFit" class="area-arrow-icon" />
                            <view class="area-underline"></view>
                        </view>
                    </uni-forms-item>

                    <uni-forms-item label="商户位置" name="latitude" :required="!isReadOnly">
                        <view class="location-field">
                            <view class="location-display" @click="isReadOnly ? viewLocation() : openLocationPicker()">
                                <text v-if="getLocationText()" class="location-text">{{ getLocationText() }}</text>
                                <text v-else class="location-placeholder">{{ isReadOnly ? '点击查看位置' : '点击选择商户位置'
                                }}</text>
                            </view>

                            <image src="/static/shd/dw.png" mode="aspectFit" class="location-icon"
                                @click="isReadOnly ? viewLocation() : openLocationPicker()" />
                        </view>
                    </uni-forms-item>

                    <uni-forms-item label="联系人" name="contactPerson" :required="!isReadOnly">
                        <input v-model="formData.contactPerson" placeholder="请输入联系人姓名" :disabled="isReadOnly"
                            class="input-field" placeholder-class="custom-placeholder" />
                    </uni-forms-item>

                    <uni-forms-item label="联系电话" name="contactPhone" :required="!isReadOnly">
                        <input v-model="formData.contactPhone" placeholder="请输入联系电话" type="number" maxlength="11"
                            :disabled="isReadOnly" class="input-field" placeholder-class="custom-placeholder" />
                    </uni-forms-item>

                    <uni-forms-item label="需要垃圾桶数(个)" name="bucketCount" :required="!isReadOnly">
                        <input v-model="formData.bucketCount" placeholder="请输入垃圾桶数量" type="number"
                            :disabled="isReadOnly" class="input-field" placeholder-class="custom-placeholder" />
                    </uni-forms-item>

                    <uni-forms-item label="预估垃圾重量(kg)" name="estimatedWeight" :required="!isReadOnly">
                        <input v-model="formData.estimatedWeight" placeholder="请输入预估垃圾重量" type="number"
                            :disabled="isReadOnly" class="input-field" placeholder-class="custom-placeholder" />
                    </uni-forms-item>

                    <uni-forms-item label="营业执照和法人身份证上传" name="licenseImages" :required="!isReadOnly">
                        <uni-file-picker :value="formData.licenseImages" file-mediatype="image" mode="grid" :limit="3"
                            :auto-upload="false" :upload-url="uploadUrl" :header="uploadHeaders" @select="onFileSelect"
                            :readonly="isReadOnly" :del-icon="!isReadOnly" file-extname="jpg,jpeg,png"
                            :max-size="20971520" return-type="array" @delete="onFileDelete">
                        </uni-file-picker>
                        <text class="upload-tip" v-if="!isReadOnly">最多上传3张图片，每张图片不超过20MB，支持jpg、png格式</text>
                    </uni-forms-item>

                    <uni-forms-item label="电子合同" name="content" :required="!isReadOnly">
                        <view class="contract-field">
                            <view class="contract-display" @click="goToContract()">
                                <text v-if="isContractSigned" class="contract-text">已签名</text>
                                <text v-else
                                    :class="isReadOnly ? 'contract-placeholder-readonly' : 'contract-placeholder'">{{
                                        contractDisplayText
                                    }}</text>
                            </view>
                            <image src="/static/shd/ht.png" class="logo-icon" @click="goToContract()" />
                        </view>
                    </uni-forms-item>
                </uni-forms>
            </view>

            <!-- 提交按钮 -->
            <view class="submit-section" v-if="authStatus === 'none' || authStatus === 'rejected'">
                <button class="submit-btn" @click="submitAuth" :loading="submitting">
                    {{ authStatus === 'rejected' ? '重新提交' : '提交认证' }}
                </button>
            </view>
        </view>

        <!-- 商户选择弹窗 -->
        <view v-if="showMerchantPopup" class="merchant-popup-mask" @click="closeMerchantList">
            <view class="merchant-popup" @click.stop>
                <view class="popup-header">
                    <text class="popup-title">选择商户</text>
                    <text class="popup-close" @click="closeMerchantList">关闭</text>
                </view>
                <view class="search-box">
                    <input v-model="searchKeyword" placeholder="搜索商户名称" class="search-input" />
                </view>
                <scroll-view class="merchant-list" scroll-y>
                    <view v-for="merchant in filteredMerchantList" :key="merchant.id" class="merchant-item"
                        @click="selectMerchant(merchant)">
                        <text class="merchant-name">{{ merchant.name }}</text>
                    </view>
                    <view v-if="filteredMerchantList.length === 0" class="empty-merchant">
                        <text>暂无匹配的商户</text>
                    </view>
                </scroll-view>
            </view>
        </view>

    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { apiPostMerchantCheck, apiPostEditMerchantCheck, apiGetMerchantCheck, apiSelectMerchantList } from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'
import { uploadUrl, createUploadHeaders } from '@/utils/config.js'
import PageHeader from '@/components/PageHeader/PageHeader.vue'

//返回上一页
const back = () => {
    uni.navigateBack()
}

//商户信息
const userStore = useUserStore();


// 商户认证数据 - 直接存储API返回的数据
const merchantData = ref(null)
//0:未审核/待审核 1:认证成功 2: 审核不通过

// 当前步骤 - 基于 merchant.status
const currentStep = computed(() => {
    const status = merchantData.value?.status
    switch (status) {
        case 0: // 待审核
            return 2
        case 1: // 认证成功
            return 3
        case 2: // 审核不通过
            return 1
        default: // 未提交认证
            return 1
    }
})

// 认证状态 - 根据后端状态码正确映射
const authStatus = computed(() => {
    const status = merchantData.value?.status
    switch (status) {
        case 0: // 未审核/待审核 -> 认证中
            return 'pending'
        case 1: // 认证成功 -> 已认证
            return 'approved'
        case 2: // 审核不通过 -> 未认证
            return 'rejected'
        default: // 未提交认证 -> 未认证
            return 'none'
    }
})


// 是否为只读状态 - 只有待审核和已通过状态才是只读
const isReadOnly = computed(() => {
    return authStatus.value === 'pending' || authStatus.value === 'approved'
})

// 判断合同是否已签名
const isContractSigned = computed(() => {
    // 如果有content，表示已签名（第一次提交或修改了合同）
    if (formData.content) {
        return true
    }
    // 如果有covenantId，表示已签名（服务器返回的合同ID，修改状态但未修改合同）
    if (formData.covenantId) {
        return true
    }
    return false
})

// 合同显示文本
const contractDisplayText = computed(() => {
    if (isContractSigned.value) {
        // 已签名状态：已签名
        return '已签名'
    } else {
        // 未签名状态：请点击查看电子合同并签名
        return '请点击查看电子合同并签名'
    }
})

// // 是否显示商户选择器（只有需要认证的状态才显示）
// const showMerchantSelector = computed(() => {
//     return authStatus.value === 'none' || authStatus.value === 'rejected'
// })

// 表单数据
const formData = reactive({
    merchantName: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    bucketCount: '',
    estimatedWeight: '',
    appcode: '', // 区域代码
    latitude: '', // 纬度
    longitude: '', // 经度
    locationName: '', // 选择的位置名称（用于显示）
    licenseImages: [], // 改为数组支持多图上传
    content: '', // 合同内容
    startTime: '', // 合同开始时间
    endTime: '', // 合同结束时间
    tempId: null, // 合同模板ID
    covenantId: null // 合同ID
})

// 区域选择数据
const appCodeOptions = [
    { value: 1, text: '普兴' },
    { value: 2, text: '兴义' },
    { value: 3, text: '安西' },
    { value: 4, text: '五津' },
    { value: 5, text: '花桥' },
    { value: 6, text: '永商' },
    { value: 7, text: '花源' }
]

// //商户名称选择
// const merchantNameOptions = ref([])

// 表单引用
const formRef = ref()

// 表单验证规则
const formRules = {
    merchantName: {
        rules: [
            { required: true, errorMessage: '请输入商户名称' }
        ]
    },
    address: {
        rules: [
            { required: true, errorMessage: '请输入商户地址' }
        ]
    },
    appcode: {
        rules: [
            { required: true, errorMessage: '请选择所属区域' },
            {
                validateFunction: function (rule, value, data, callback) {
                    // 验证选中的值是否在有效的区域选项中
                    const validValues = appCodeOptions.map(option => option.value);
                    if (value && !validValues.includes(parseInt(value))) {
                        callback('请选择有效的区域');
                        return false;
                    }
                    return true;
                }
            }
        ]
    },
    contactPerson: {
        rules: [
            { required: true, errorMessage: '请输入联系人姓名' }
        ]
    },
    contactPhone: {
        rules: [
            { required: true, errorMessage: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, errorMessage: '请输入正确的手机号码' }
        ]
    },
    bucketCount: {
        rules: [
            { required: true, errorMessage: '请输入垃圾桶数量' },
            {
                validateFunction: function (rule, value, data, callback) {
                    if (value && (isNaN(value) || parseInt(value) <= 0)) {
                        callback('垃圾桶数量必须大于0')
                    }
                    return true
                }
            }
        ]
    },
    estimatedWeight: {
        rules: [
            { required: true, errorMessage: '请输入预估垃圾重量' },
            {
                validateFunction: function (rule, value, data, callback) {
                    if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                        callback('预估垃圾重量必须大于0')
                    }
                    return true
                }
            }
        ]
    },
    latitude: {
        rules: [
            { required: true, errorMessage: '请选择商户位置坐标' },
            {
                validateFunction: function (rule, value, data, callback) {
                    if (value && (isNaN(value) || parseFloat(value) < -90 || parseFloat(value) > 90)) {
                        callback('纬度值必须在-90到90之间');
                        return false;
                    }
                    return true;
                }
            }
        ]
    },
    longitude: {
        rules: [
            { required: true, errorMessage: '请选择商户位置坐标' },
            {
                validateFunction: function (rule, value, data, callback) {
                    if (value && (isNaN(value) || parseFloat(value) < -180 || parseFloat(value) > 180)) {
                        callback('经度值必须在-180到180之间');
                        return false;
                    }
                    return true;
                }
            }
        ]
    },
    licenseImages: {
        rules: [
            {
                required: true,
                validateFunction: function (rule, value, data, callback) {

                    // 特殊处理：如果是 undefined 或 null，直接失败
                    if (value === undefined || value === null) {
                        console.log('验证失败: 值为 undefined 或 null')
                        callback('请至少上传1张营业执照')
                        return false
                    }

                    // 检查是否为数组
                    if (!Array.isArray(value)) {
                        console.log('验证失败: 不是数组，类型为:', typeof value)
                        callback('请至少上传1张营业执照')
                        return false
                    }

                    // 检查数组长度
                    if (value.length === 0) {
                        console.log('验证失败: 数组为空')
                        callback('请至少上传1张营业执照')
                        return false
                    }

                    // 检查是否有有效的文件（更宽松的检查）
                    const validFiles = value.filter((file, index) => {
                        console.log(`===== 检查文件${index} =====`)
                        console.log(`文件${index}完整对象:`, file)

                        if (!file) {
                            console.log(`文件${index}: 文件对象为空`)
                            return false
                        }

                        // 更宽松的检查逻辑：只要有任何一个有效属性就认为是有效文件
                        const hasUrl = file.url && file.url.trim()
                        const hasPath = file.path && file.path.trim()
                        const hasResponse = file.response && file.response.url
                        const isString = typeof file === 'string' && file.trim()
                        const hasFileId = file.fileID || file.id
                        const hasName = file.name
                        const hasSize = file.size > 0
                        const hasTempFilePath = file.tempFilePath // uni-file-picker 的临时文件路径
                        const hasFile = file.file // 原始文件对象

                        // 新增：检查是否有任何图片相关的属性
                        const hasImageProps = file.type && file.type.includes('image')
                        const hasExtension = file.name && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)

                        console.log(`文件${index}检查结果:`, {
                            hasUrl, hasPath, hasResponse, isString, hasFileId, hasName, hasSize,
                            hasTempFilePath, hasFile, hasImageProps, hasExtension,
                            url: file.url,
                            path: file.path,
                            name: file.name,
                            size: file.size,
                            tempFilePath: file.tempFilePath,
                            type: file.type
                        })

                        // 更宽松的判断：只要有基本文件属性就认为有效
                        const isValid = hasUrl || hasPath || hasResponse || isString || hasFileId ||
                            hasName || hasTempFilePath || hasFile || hasImageProps || hasExtension ||
                            (hasSize && file.name) // 有大小和名称就认为是有效文件

                        console.log(`文件${index}是否有效:`, isValid)
                        console.log(`===== 文件${index}检查完成 =====`)
                        return isValid
                    })

                    console.log('有效文件数量:', validFiles.length)
                    console.log('有效文件详情:', validFiles.map(f => ({ url: f.url, path: f.path, name: f.name })))

                    if (validFiles.length === 0) {
                        console.log('验证失败: 没有有效文件')
                        callback('请至少上传1张营业执照')
                        return false
                    }

                    // 检查文件数量限制
                    if (validFiles.length > 3) {
                        console.log('验证失败: 文件数量超过限制')
                        callback('最多只能上传3张图片')
                        return false
                    }

                    console.log('验证成功: 有效文件数量', validFiles.length)
                    console.log('===== 验证营业执照结束 =====')
                    return true
                },
                errorMessage: '请至少上传1张营业执照'
            }
        ]
    },
    content: {
        rules: [
            {
                required: true,
                validateFunction: function (rule, value, data, callback) {
                    if (!value) {
                        callback('请查看并签署电子合同')
                        return false
                    }
                    return true
                },
                errorMessage: '请查看并签署电子合同'
            }
        ]
    }
}

// 文件上传配置
const uploadHeaders = createUploadHeaders().value // 添加 .value 获取实际值

// 提交状态
const submitting = ref(false)

// 商户选择相关
const merchantList = ref([]) // 商户列表
const searchKeyword = ref('') // 搜索关键词
const showMerchantPopup = ref(false) // 弹窗显示状态

// 过滤后的商户列表 - 简单模糊搜索
const filteredMerchantList = computed(() => {
    if (!searchKeyword.value) {
        return merchantList.value
    }

    const keyword = searchKeyword.value.toLowerCase().trim()
    if (!keyword) {
        return merchantList.value
    }

    return merchantList.value.filter(merchant => {
        return merchant.name.toLowerCase().includes(keyword)
    })
})

// 获取选中区域的文本（用于只读显示）
const getSelectedAreaText = () => {
    if (!formData.appcode) {
        return ''
    }
    const selectedOption = appCodeOptions.find(option => option.value === parseInt(formData.appcode))
    return selectedOption ? selectedOption.text : ''
}

// 获取位置文本（用于只读显示）
const getLocationText = () => {
    if (formData.latitude && formData.longitude) {
        return formData.locationName || `经度: ${formData.longitude}, 纬度: ${formData.latitude}`
    }
    return ''
}



// 跳转到电子合同页面
const goToContract = () => {
    // 根据认证状态决定页面参数
    const isReadOnly = authStatus.value === 'pending' || authStatus.value === 'approved'

    console.log('===== shCertification.vue 准备跳转到合同页面 =====')
    console.log('当前状态:', {
        isReadOnly: isReadOnly,
        hasContent: !!formData.content,
        content: formData.content
    })

    // 如果有合同内容，传递合同数据用于回显
    if (formData.content) {

        const contractContent = encodeURIComponent(formData.content)
        const startTime = formData.startTime
        const endTime = formData.endTime

        let url = `/pages/syContract/syContractFromAuth?isReadOnly=${isReadOnly}&hasContract=true&content=${contractContent}&startTime=${startTime}&endTime=${endTime}`

        uni.navigateTo({
            url: url,
            success: () => {
                console.log('跳转到合同页面成功，显示已签名合同')
            },
            fail: (err) => {
                console.error('跳转失败:', err)
                uni.showToast({
                    title: '页面跳转失败',
                    icon: 'none'
                })
            }
        })
        return
    }

    // 如果有covenantId但没有content，直接跳转到合同页面（合同页面会用商户ID获取）
    if (formData.covenantId) {
        let url = `/pages/syContract/syContractFromAuth?isReadOnly=${isReadOnly}`

        uni.navigateTo({
            url: url,
            success: () => {
                console.log('跳转到合同页面成功，合同页面会用商户ID获取合同')
            },
            fail: (err) => {
                console.error('跳转失败:', err)
                uni.showToast({
                    title: '页面跳转失败',
                    icon: 'none'
                })
            }
        })
        return
    }

    // 如果都没有，跳转到合同页面进行签名
    let url = `/pages/syContract/syContractFromAuth?isReadOnly=${isReadOnly}`

    // 如果是只读模式且有tempId，传入tempId
    if (isReadOnly && formData.tempId) {
        url += `&tempId=${formData.tempId}`
    }

    uni.navigateTo({
        url: url,
        success: () => {
            console.log('跳转到电子合同页面成功，进行签名')
        },
        fail: (err) => {
            console.error('跳转失败:', err)
            uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
            })
        }
    })
}

// 查看位置（只读模式）
const viewLocation = () => {
    if (formData.latitude && formData.longitude) {
        // 使用系统地图查看位置
        uni.openLocation({
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            name: formData.locationName || '商户位置',
            address: formData.locationName || '商户位置',
            success: () => {
                console.log('打开系统地图成功')
            },
            fail: (err) => {
                console.error('打开系统地图失败:', err)
                // 如果系统地图打开失败，显示位置信息弹窗
                uni.showModal({
                    title: '商户位置',
                    content: `位置名称：${formData.locationName || '已选择位置'}\n经度：${formData.longitude}\n纬度：${formData.latitude}`,
                    showCancel: false,
                    confirmText: '确定'
                })
            }
        })
    } else {
        uni.showToast({
            title: '暂无位置信息',
            icon: 'none'
        })
    }
}



// 页面加载完成
onMounted(() => {
    // 这里可以调用接口获取认证状态
    loadAuthStatus()
    // 加载商户列表
    loadMerchantList()

    // 监听合同页面返回的数据
    uni.$on('contractUpdated', (contractData) => {
        // 判断返回的数据是否有值，有值才更新合同状态
        if (contractData && contractData.content) {
            formData.content = contractData.content
            formData.startTime = contractData.createTime
            formData.endTime = contractData.endTime
            uni.showToast({
                title: '合同签名成功',
                icon: 'success'
            })
        } else {
            console.log('合同数据无效，不更新')
        }
    })
})

// 加载认证状态
const loadAuthStatus = async () => {
    try {
        // 调用获取认证信息接口
        const result = await apiGetMerchantCheck({
            userid: userStore.userId
        })

        console.log('获取认证状态API返回:', result)

        if (result.code === 200 && result.data) {
            // 存储商户认证数据
            merchantData.value = result.data

            // 数据回显
            fillFormData(result.data)

            console.log('认证状态加载成功, 状态:', result.data)
        } else {
            console.log('用户尚未提交认证申请')
            // 没有认证数据，保持默认状态
            merchantData.value = null
        }
    } catch (error) {
        console.error('加载认证状态失败:', error)
        // 发生错误时也保持默认状态
        merchantData.value = null
    }
}

// 数据回显函数
const fillFormData = (data) => {
    if (!data) return

    console.log('开始数据回显:', data)

    // 基本信息回显
    formData.merchantName = data.name || ''
    formData.address = data.address || ''
    formData.appcode = data.appcode || ''
    formData.contactPerson = data.contactTruename || ''
    formData.contactPhone = data.contactTel || ''
    formData.bucketCount = data.bucketNum?.toString() || ''
    formData.estimatedWeight = data.trashWeight?.toString() || ''


    // 经纬度回显
    if (data.lat && data.lon) {
        formData.latitude = data.lat.toString()
        formData.longitude = data.lon.toString()
        // 可以根据经纬度获取位置名称，这里先用默认值
        formData.locationName = '已选择位置'
    }

    // 图片回显
    if (data.img) {
        console.log('===== 开始图片回显 =====')
        console.log('服务器返回的img字段:', data.img)

        const imageUrls = data.img.split(',').filter(url => url.trim())
        console.log('解析后的图片URLs:', imageUrls)

        formData.licenseImages = imageUrls.map((url, index) => {
            const trimmedUrl = url.trim()
            console.log(`回显第${index + 1}个图片URL:`, trimmedUrl)
            return {
                url: trimmedUrl,
                path: trimmedUrl,
                name: '营业执照'
            }
        })

        console.log('回显后的formData.licenseImages:', formData.licenseImages)
        console.log('===== 图片回显完成 =====')
    }

    // 电子合同状态回显（如果有合同内容则回显）
    if (data.content) {
        formData.content = data.content || ''
        formData.startTime = data.createTime || ''
        formData.endTime = data.endTime || ''
    }

    // 回显covenantId（合同ID）
    formData.covenantId = data.covenantId || null
    console.log('回显covenantId:', formData.covenantId, '原始数据:', data.covenantId)

    // 回显tempId（最外层）
    formData.tempId = data.tempId || ''

    console.log('数据回显完成:', formData)
    console.log('isContractSigned:', isContractSigned.value)
}

// 加载商户列表
const loadMerchantList = async () => {
    try {
        console.log('开始加载商户列表...')
        const result = await apiSelectMerchantList()
        console.log('获取商户列表API返回:', result)

        if (result.code === 200 && result.data) {
            // 只提取name字段，保持原有的id作为key
            merchantList.value = result.data.map((item, index) => ({
                id: item.id || index, // 使用返回的id或索引作为key
                name: item.name
            }))
            console.log('商户列表加载成功，数量:', merchantList.value.length)
        } else {
            console.log('获取商户列表失败')
            merchantList.value = []
        }
    } catch (error) {
        console.error('加载商户列表失败:', error)
        merchantList.value = []
    }
}

// 显示商户选择列表
const showMerchantList = () => {
    console.log('点击选择按钮')
    console.log('merchantList.value:', merchantList.value)

    if (merchantList.value.length === 0) {
        uni.showToast({
            title: '商户列表为空',
            icon: 'none'
        })
        return
    }
    showMerchantPopup.value = true
}

// 关闭商户选择列表
const closeMerchantList = () => {
    showMerchantPopup.value = false
    // 清空搜索关键词
    searchKeyword.value = ''
}

// 选择商户
const selectMerchant = (merchant) => {
    console.log('选择商户:', merchant)
    formData.merchantName = merchant.name
    closeMerchantList()
}


// 手动上传文件
const uploadFileManually = (file, fileIndex = null) => {
    console.log('===== uploadFileManually 开始 =====')
    console.log('上传文件:', file)
    console.log('目标索引:', fileIndex)
    console.log('当前数组状态:', formData.licenseImages)

    uni.uploadFile({
        url: uploadUrl,
        filePath: file.tempFilePath || file.path,
        name: 'file',
        header: uploadHeaders,
        success: (res) => {
            console.log('手动上传成功:', res)
            const response = JSON.parse(res.data)
            if (response.code === 200 && response.url) {
                console.log('上传响应:', response)

                console.log('当前数组状态:', formData.licenseImages)
                console.log('数组类型:', Array.isArray(formData.licenseImages))
                console.log('数组长度:', formData.licenseImages.length)

                // 确保数组存在且有效
                if (!Array.isArray(formData.licenseImages)) {
                    console.log('数组类型异常，重新初始化')
                    formData.licenseImages = []
                }

                // 直接使用传入的索引更新文件
                if (fileIndex !== null && fileIndex !== undefined && fileIndex >= 0 && fileIndex < formData.licenseImages.length) {
                    const oldFile = formData.licenseImages[fileIndex]
                    console.log('更新前的文件:', oldFile)

                    // 更新文件信息
                    formData.licenseImages[fileIndex] = {
                        ...oldFile,
                        url: response.url,
                        path: response.url,
                        fileName: response.fileName,
                        newFileName: response.newFileName,
                        originalFilename: response.originalFilename,
                        response: response,
                        progress: 100,
                        uploading: false // 标记上传完成
                    }

                    console.log('更新后的文件:', formData.licenseImages[fileIndex])
                    console.log('更新后的完整数组:', formData.licenseImages)

                    // 触发表单验证
                    setTimeout(() => {
                        if (formRef.value) {
                            console.log('===== 准备触发表单验证 =====')
                            console.log('验证时数组状态:', formData.licenseImages)
                            console.log('验证时数组长度:', formData.licenseImages.length)
                            console.log('验证时数组类型:', Array.isArray(formData.licenseImages))

                            formRef.value.validateField('licenseImages')
                            console.log('===== 表单验证触发完成 =====')
                        }
                    }, 300)

                } else {
                    console.error('无效的文件索引:', fileIndex, '数组长度:', formData.licenseImages.length)
                }

                console.log('===== 文件上传成功处理完成 =====')


            } else {
                console.error('上传失败:', response)
                uni.showToast({
                    title: '文件上传失败',
                    icon: 'none'
                })
            }
        },
        fail: (err) => {
            console.error('上传请求失败:', err)
            uni.showToast({
                title: '文件上传失败',
                icon: 'none'
            })
        }
    })
}

// 文件选择事件
const onFileSelect = (res) => {
    console.log('===== onFileSelect 开始 =====')
    console.log('选择文件事件:', res)
    console.log('当前formData.licenseImages:', formData.licenseImages)
    console.log('数组类型检查:', Array.isArray(formData.licenseImages))

    if (res.tempFiles && res.tempFiles.length > 0) {
        const selectedFile = res.tempFiles[0]
        console.log('准备上传的文件:', selectedFile)

        // 确保 licenseImages 是数组
        if (!Array.isArray(formData.licenseImages)) {
            console.log('修复数组类型问题')
            formData.licenseImages = []
        }

        // 手动添加文件到数组（因为 v-model 可能有问题）
        const fileToAdd = {
            ...selectedFile,
            progress: 0, // 初始进度
            uploading: true // 标记正在上传
        }

        formData.licenseImages.push(fileToAdd)
        console.log('手动添加文件后的数组:', formData.licenseImages)

        // 计算新文件的索引
        const newFileIndex = formData.licenseImages.length - 1
        console.log('新文件索引:', newFileIndex)

        // 手动上传文件
        uploadFileManually(selectedFile, newFileIndex)
    }
    console.log('===== onFileSelect 结束 =====')
}

// 文件删除事件
const onFileDelete = (res) => {
    console.log('===== onFileDelete 开始 =====')
    console.log('删除文件事件:', res)

    if (res.index !== undefined && res.index >= 0 && res.index < formData.licenseImages.length) {
        // 手动删除文件
        formData.licenseImages.splice(res.index, 1)
        console.log('删除后的数组:', formData.licenseImages)

        // 触发表单验证
        setTimeout(() => {
            if (formRef.value) {
                formRef.value.validateField('licenseImages')
            }
        }, 100)
    }

    console.log('===== onFileDelete 结束 =====')
}

// 打开地图选择器
const openLocationPicker = () => {
    uni.chooseLocation({
        success: function (res) {
            console.log('选择位置成功:', res)
            formData.latitude = res.latitude.toString()
            formData.longitude = res.longitude.toString()
            formData.locationName = res.name || res.address || '已选择位置'

            uni.showToast({
                title: '位置选择成功',
                icon: 'success'
            })
        },
        fail: function (err) {
            console.error('选择位置失败:', err)
            if (err.errMsg && err.errMsg.includes('cancel')) {
                // 用户取消选择，不显示错误提示
                return
            }
            uni.showToast({
                title: '位置选择失败',
                icon: 'none'
            })
        }
    })
}

// 调试函数：检查当前文件状态
const debugLicenseImages = () => {
    console.log('===== 调试营业执照文件状态 =====')
    console.log('formData.licenseImages:', formData.licenseImages)
    console.log('数组长度:', formData.licenseImages.length)
    console.log('数组类型:', Array.isArray(formData.licenseImages))

    if (formData.licenseImages && formData.licenseImages.length > 0) {
        formData.licenseImages.forEach((file, index) => {
            console.log(`文件${index}详情:`, {
                name: file.name,
                url: file.url,
                path: file.path,
                size: file.size,
                type: file.type,
                tempFilePath: file.tempFilePath,
                response: file.response,
                完整对象: file
            })
        })
    }
    console.log('===== 调试完成 =====')
}

// 表单验证（使用uni-forms的验证方式）
const validateForm = async () => {
    try {
        // 验证前先调试一下文件状态
        debugLicenseImages()
        const result = await formRef.value.validate()
        return true
    } catch (error) {
        console.log('表单验证失败:', error)
        // 验证失败时也调试一下
        debugLicenseImages()
        return false
    }
}

// 提交认证
const submitAuth = async () => {
    // 先进行表单验证
    const isValid = await validateForm()
    if (!isValid) {
        return
    }

    submitting.value = true

    try {
        // 处理上传的图片数据
        let imageUrls = []
        if (formData.licenseImages && formData.licenseImages.length > 0) {
            console.log('===== 开始处理图片数据 =====')
            console.log('formData.licenseImages:', formData.licenseImages)

            imageUrls = formData.licenseImages.map((file, index) => {

                // uni-file-picker返回的文件对象结构
                if (typeof file === 'string') {
                    console.log(`使用字符串值:`, file)
                    return file
                } else if (file.url) {
                    console.log(`使用URL:`, file.url)
                    return file.url
                } else if (file.path) {
                    console.log(`使用路径:`, file.path)
                    return file.path
                } else {
                    console.log(`使用原始值:`, file)
                    return file
                }
            })

            console.log('最终图片URLs:', imageUrls)
            console.log('===== 图片数据处理完成 =====')
        }

        // 准备提交数据 - 只包含API需要的字段
        const submitData = {
            userid: userStore.userId,
            id: userStore.merchant?.id || '',
            name: formData.merchantName,              // 商户名称
            address: formData.address,                // 地址
            appcode: formData.appcode,                // 区域代码
            lat: parseFloat(formData.latitude),       // 纬度
            lon: parseFloat(formData.longitude),      // 经度
            contactTruename: formData.contactPerson,  // 联系人姓名
            contactTel: formData.contactPhone,        // 联系电话
            bucketNum: parseInt(formData.bucketCount), // 预计桶数量
            trashWeight: parseFloat(formData.estimatedWeight), // 预估垃圾重量
            img: imageUrls.join(','), // 多张图片用逗号分隔
            tempId: formData.tempId, // 合同模板ID
            content: formData.content, // 合同内容
            startTime: formData.startTime, // 合同开始时间
            endTime: formData.endTime, // 合同结束时间
            covenantId: formData.covenantId // 合同ID
        }

        console.log('提交修改认证数据:', submitData)

        // 根据认证状态选择不同的API
        let result
        if (authStatus.value === 'rejected') {
            // 审核不通过，使用修改接口
            result = await apiPostEditMerchantCheck(submitData)
            console.log('修改认证API返回:', result)
            uni.showToast({
                title: '修改提交成功',
                icon: 'success'
            })
        } else {
            // 首次提交，使用新增接口
            result = await apiPostMerchantCheck(submitData)
            console.log('认证提交API返回:', result)
            uni.showToast({
                title: '认证提交成功',
                icon: 'success'
            })
        }

        // 更新认证状态 - 提交成功后状态为待审核(0)
        merchantData.value = {
            ...submitData,
            status: 0, // 待审核状态
            updateTime: new Date().toLocaleString()
        }

        // 同时更新用户store中的merchant数据
        if (userStore.userInfo) {
            userStore.updateUserInfo({
                merchant: merchantData.value
            })
        }

    } catch (error) {
        uni.showToast({
            title: '提交失败，请重试',
            icon: 'none'
        })
    } finally {
        submitting.value = false
    }
}


</script>

<style scoped lang="scss">
.auth-container {
    min-height: 100vh;
    background: $bg-theme-color;
    padding: 0 30rpx 30rpx;


    // 步骤条样式
    .step-container {
        background: #ffffff;
        padding: 40rpx 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 30rpx 0;
        height: 144rpx;
        border-radius: 20rpx;

        .step-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16rpx;

            &.active {
                .step-circle {
                    width: 48rpx;
                    height: 48rpx;
                    background: rgba(7, 193, 96, 1);
                    color: #fff;
                }

                .step-label {
                    color: #07c160;
                    font-weight: 400;
                }
            }

            &.completed .step-circle {
                background: #07c160;
                color: #fff;
            }
        }

        .step-circle {
            width: 48rpx;
            height: 48rpx;
            border-radius: 50%;
            background: rgba(217, 217, 217, 1);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
            font-weight: 400;
            transition: all 0.3s ease;
        }

        .step-number,
        .step-check {
            font-size: 24rpx;
            font-weight: 400;
        }

        .step-label {
            font-size: 24rpx;
            color: rgba(61, 61, 61, 1);
            text-align: center;
        }

        .step-line {
            flex: 1;
            height: 2rpx;
            background: #e5e5e5;
            margin: 0 20rpx;
            margin-top: -45rpx; // 向上偏移，与圆圈居中对齐
            transition: all 0.3s ease;

            &.active {
                background: #07c160;
            }
        }
    }

    // 表单样式
    .auth-form {
        .form-section {
            background: #ffffff;
            border-radius: 16rpx;
            padding: 30rpx;
            margin-bottom: 30rpx;
            box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

            .status-tip {
                margin-bottom: 20rpx;

                .tip-content {
                    display: flex;
                    align-items: center;
                    gap: 8rpx;
                    padding: 16rpx 20rpx;
                    background-color: #f8f9fa;
                    border-radius: 8rpx;
                    border-left: 4rpx solid #ff9500;

                    &.approved {
                        border-left-color: #07c160;
                    }

                    &.rejected {
                        border-left-color: #ff4444;
                    }

                    .tip-text {
                        font-size: 26rpx;
                        color: #666666;
                    }
                }
            }

            .section-title {
                font-size: 32rpx;
                font-weight: bold;
                color: rgba(38, 38, 38, 1);
                margin-bottom: 30rpx;
                display: block;
            }

            // uni-forms组件样式调整
            :deep(.uni-forms-item) {
                margin-bottom: 40rpx; // 增加表单项之间的间距

                // 营业执照上传表单项增加下边距
                &:has(.uni-file-picker) {
                    margin-bottom: 45rpx; // 增加5rpx下边距
                }

                // 标签样式调整
                .uni-forms-item__label {
                    font-size: 28rpx !important;
                    color: rgba(38, 38, 38, 1) !important;
                    margin-bottom: 0rpx !important; // 标签和输入框的间距
                    white-space: nowrap !important; // 防止标签换行

                    .uni-forms-item__label-text {
                        white-space: nowrap !important;
                    }
                }

                // 错误信息样式调整 - 恢复原始位置但优化样式
                .uni-forms-item__error {
                    margin-top: 8rpx !important; // 与输入框的间距
                    margin-bottom: 20rpx !important; // 与下一个表单项的间距
                    font-size: 24rpx !important;
                    color: #ff4444 !important;
                    line-height: 1.4 !important;
                    background: transparent !important;
                }
            }

            // input样式调整
            .input-field {
                width: calc(100% - 24rpx); // 减去左右边距，与下划线对齐
                height: 55rpx;
                border: none;
                border-bottom: 2rpx solid #e5e5e5;
                background: transparent;
                padding: 0; // 
                font-size: 28rpx;
                color: rgba(38, 38, 38, 1);
                line-height: 40rpx;
                text-align: left;
                box-sizing: border-box;
                margin-left: 12rpx; // 可输入状态：向右偏移12rpx来对齐*号
                margin-right: 12rpx; // 右边距12rpx，与下划线对齐

                &:focus {
                    border-bottom-color: #07c160;
                    outline: none;
                }

                // 只读状态：不偏移，因为没有*号
                &:disabled {
                    margin-left: 0;
                    margin-right: 0;
                    width: 100%;
                }
            }

            // 微信小程序placeholder样式
            ::v-deep .custom-placeholder {
                color: rgba(191, 191, 191, 1) !important;
                font-size: 28rpx !important;
                line-height: 40rpx !important;
            }

            // 只读状态：label不显示*号，需要偏移12rpx来对齐
            &.readonly ::v-deep .uni-forms-item__label {
                margin-left: 12rpx !important;
            }


            &:disabled {
                background-color: #f5f5f5;
                color: #999;
                margin-left: 0; // 只读状态不偏移
            }
        }

        // 商户名称输入框样式
        .merchant-name-input {
            display: flex;
            align-items: center;
            gap: 10rpx;
            position: relative;
            border-bottom: 2rpx solid #e5e5e5;
            padding-bottom: 2rpx;
            margin-left: 12rpx;
            margin-right: 12rpx;

            .input-field {
                flex: 1;
                border: none;
                border-bottom: none;
                background: transparent;
                margin: 0;
                width: auto;
            }

            .arrow-icon {
                width: 40rpx;
                height: 40rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .logo-icon {
                width: 40rpx;
                height: 40rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .location-icon {
                width: 32rpx;
                height: 32rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .select-icon {
                cursor: pointer;
                flex-shrink: 0;
                justify-content: center;
            }

            &:focus-within {
                border-bottom-color: #07c160;
            }
        }

        // uni-data-select 插槽自定义样式
        .custom-selected {
            display: flex;
            align-items: center;
            height: 40rpx;
            margin-left: -8rpx; // 往左偏移8rpx对齐

            .selected-text {
                font-size: 28rpx;
                color: rgba(38, 38, 38, 1) !important;
                line-height: 40rpx;
            }

            .placeholder-text {
                font-size: 28rpx;
                color: rgba(191, 191, 191, 1) !important;
                line-height: 40rpx;
            }
        }

        // 所属区域包装器样式
        .area-select-wrapper {
            display: flex;
            align-items: center;
            height: 55rpx;
            margin-top: -10rpx;
        }

        .area-arrow-icon {
            width: 40rpx;
            height: 40rpx;
            margin-left: 10rpx;
            flex-shrink: 0;
        }

        // uni-data-select 组件整体样式调整（微信小程序兼容）
        ::v-deep .area-select .uni-data-select__input-box {
            border: none !important; // 完全移除自带的下划线
            background: transparent !important;
            padding: 0 12rpx 0 12rpx !important; // 恢复正常的padding
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;

            margin-left: 0 !important;
        }


        // 自定义下划线
        .area-underline {
            position: absolute;
            bottom: -15rpx;
            left: 12rpx;
            right: 12rpx;
            height: 2rpx;

            background-color: #e5e5e5;
        }

        // 确保placeholder颜色一致（微信小程序兼容）
        ::v-deep .uni-data-select .uni-data-select__input-box .uni-data-select__input {
            color: rgba(38, 38, 38, 1) !important;
        }

        ::v-deep .uni-data-select .uni-data-select__input-box .uni-data-select__placeholder {
            color: rgba(191, 191, 191, 1) !important;
        }


        // 位置字段样式
        .location-field {
            display: flex;
            align-items: center;
            gap: 10rpx;
            position: relative;
            border-bottom: 2rpx solid #e5e5e5;
            padding-bottom: 2rpx;
            margin-left: 12rpx;
            margin-right: 12rpx;

            .location-display {
                flex: 1;
                height: 55rpx;
                border: none;
                border-bottom: none;
                background: transparent;
                padding: 0;
                display: flex;
                align-items: center;
                margin: 0;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent; // 移除点击高亮效果

                .location-text {
                    font-size: 28rpx;
                    color: rgba(38, 38, 38, 1);
                    line-height: 40rpx;
                }

                .location-placeholder {
                    font-size: 28rpx;
                    color: rgba(191, 191, 191, 1);
                    line-height: 40rpx;
                }
            }

            .arrow-icon {
                width: 12rpx;
                height: 23rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .logo-icon {
                width: 40rpx;
                height: 40rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .location-icon {
                width: 32rpx;
                height: 32rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .select-icon {
                cursor: pointer;
                flex-shrink: 0;
                justify-content: center;
            }

            &:focus-within {
                border-bottom-color: #07c160;
            }

            // 只读状态：位置字段不偏移
            &.readonly {
                margin-left: 0;
                margin-right: 0;
            }
        }

        // 电子合同字段样式（与位置字段相同）
        .contract-field {
            display: flex;
            align-items: center;
            gap: 10rpx;
            border-bottom: 2rpx solid #e5e5e5;

            .contract-display {
                flex: 1;
                height: 55rpx;
                border: none;
                background: transparent;
                padding: 0;
                display: flex;
                align-items: center;
                margin-left: 12rpx;
                margin-right: 12rpx; // 右边距12rpx，与下划线对齐
                cursor: pointer;
                -webkit-tap-highlight-color: transparent; // 移除点击高亮效果

                .contract-text {
                    font-size: 28rpx;
                    color: rgba(38, 38, 38, 1);
                    line-height: 40rpx;
                }

                .contract-placeholder {
                    font-size: 28rpx;
                    color: rgba(191, 191, 191, 1);
                    line-height: 40rpx;
                }

                .contract-placeholder-readonly {
                    font-size: 28rpx;
                    color: rgba(38, 38, 38, 1);
                    line-height: 40rpx;
                }
            }

            // 只读状态：电子合同字段不偏移
            &.readonly .contract-display {
                margin-left: 0;
                margin-right: 0;
            }

            .arrow-icon {
                width: 12rpx;
                height: 23rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .logo-icon {
                width: 40rpx;
                height: 40rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .location-icon {
                width: 32rpx;
                height: 32rpx;
                cursor: pointer;
                flex-shrink: 0;
            }

            .select-icon {
                cursor: pointer;
                flex-shrink: 0;
                justify-content: center;
            }
        }

        // 上传提示样式
        .upload-tip {
            font-size: 24rpx;
            color: #999999;
            margin-top: 10rpx;
            line-height: 1.4;
        }


        // 只读状态样式
        &.readonly {
            .input-field {
                color: rgba(38, 38, 38, 1);
            }

            .merchant-name-input {
                margin-left: 0;
                margin-right: 0;
            }
        }
    }

    // 上传区域样式（保留旧的，以防需要）
    .upload-group {
        display: flex;
        flex-direction: column;
        gap: 30rpx;

        .upload-item {
            display: flex;
            flex-direction: column;
            gap: 15rpx;

            .upload-label {
                font-size: 28rpx;
                color: #333333;
                font-weight: 500;
            }

            .upload-area {
                width: 100%;
                height: 200rpx;
                background: #f8f8f8;
                border: 2rpx dashed #cccccc;
                border-radius: 12rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;

                .upload-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10rpx;

                    .upload-icon {
                        font-size: 48rpx;
                    }

                    .upload-text {
                        font-size: 24rpx;
                        color: #999999;
                    }
                }

                .uploaded-image {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    // 提交按钮样式
    .submit-section {
        padding: 0 30rpx;
        margin-top: 40rpx;

        .submit-btn {
            width: 100%;
            height: 80rpx;
            background: linear-gradient(135deg, #07c160 0%, #10ad6a 100%);
            color: #ffffff;
            border-radius: 60rpx;
            font-size: 32rpx;
            font-weight: bold;
            border: none;

            &:disabled {
                background: #cccccc;
                color: #999999;
            }

            &:active:not(:disabled) {
                transform: scale(0.98);
            }
        }
    }
}


// 商户选择弹窗样式
.merchant-popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.merchant-popup {
    background: white;
    border-radius: 20rpx 20rpx 0 0;
    height: 60vh;
    width: 100%;
    display: flex;
    flex-direction: column;

    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1rpx solid #e5e5e5;
        flex-shrink: 0; // 防止压缩
        height: 88rpx; // 固定头部高度

        .popup-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }

        .popup-close {
            font-size: 28rpx;
            color: #007aff;
            padding: 10rpx;
        }
    }

    .search-box {
        padding: 20rpx 30rpx;
        border-bottom: 1rpx solid #e5e5e5;
        flex-shrink: 0; // 防止压缩
        height: 100rpx; // 固定搜索框高度
        display: flex;
        align-items: center;

        .search-input {
            width: 100%;
            height: 60rpx;
            border: 1rpx solid #e5e5e5;
            border-radius: 30rpx;
            background: #f8f8f8;
            padding: 0 20rpx;
            font-size: 28rpx;
            color: #333;

            &::placeholder {
                color: rgba(191, 191, 191, 1);
            }

            &:focus {
                border-color: #07c160;
                background: #fff;
                outline: none;
            }
        }
    }

    .merchant-list {
        flex: 1;
        height: calc(80vh - 188rpx); // 减去头部(88rpx)和搜索框(100rpx)的高度
        overflow-y: auto;

        .merchant-item {
            padding: 30rpx;
            border-bottom: 1rpx solid #f0f0f0;
            display: flex;
            align-items: center;

            &:active {
                background-color: #f5f5f5;
            }

            .merchant-name {
                font-size: 28rpx;
                color: #333;
            }
        }

        .empty-merchant {
            padding: 60rpx 30rpx;
            text-align: center;

            text {
                font-size: 26rpx;
                color: #999;
            }
        }
    }
}
</style>
