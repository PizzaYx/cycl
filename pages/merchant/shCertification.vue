<!-- 认证界面 -->
<template>
    <view class="auth-container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="商户认证"
            @clickLeft="back" />
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
                    <uni-forms-item label="商户名称" name="merchantName" required>
                        <view class="merchant-name-input">
                            <uni-easyinput v-model="formData.merchantName" placeholder="请输入商户名称" :clearable="false"
                                :disabled="isReadOnly" class="merchant-input" />
                            <button v-if="showMerchantSelector" class="select-btn" @click="showMerchantList"
                                :disabled="isReadOnly">
                                选择
                            </button>
                        </view>
                    </uni-forms-item>

                    <uni-forms-item label="商户地址" name="address" required>
                        <uni-easyinput v-model="formData.address" placeholder="请输入详细地址" :clearable="false"
                            :disabled="isReadOnly">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="所属区域" name="appcode" required>
                        <uni-data-select v-model="formData.appcode" :localdata="appCodeOptions" placeholder="请选择区域"
                            :clear="false" :disabled="isReadOnly">
                        </uni-data-select>
                    </uni-forms-item>

                    <uni-forms-item label="商户位置" name="latitude" required>
                        <view class="location-picker">
                            <view class="location-input" @click="!isReadOnly && openLocationPicker()"
                                :class="{ disabled: isReadOnly }">
                                <view v-if="formData.latitude && formData.longitude" class="location-info">
                                    <text class="location-name">{{ formData.locationName || '已选择位置' }}</text>
                                    <text class="location-coords">经度: {{ formData.longitude }}, 纬度: {{ formData.latitude
                                        }}</text>
                                </view>
                                <text class="location-placeholder" v-else>点击选择商户位置</text>
                                <uni-icons type="location" size="20" color="#999"></uni-icons>
                            </view>
                        </view>
                    </uni-forms-item>

                    <uni-forms-item label="联系人" name="contactPerson" required>
                        <uni-easyinput v-model="formData.contactPerson" placeholder="请输入联系人姓名" :clearable="false"
                            :disabled="isReadOnly">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="联系电话" name="contactPhone" required>
                        <uni-easyinput v-model="formData.contactPhone" placeholder="请输入联系电话" type="number"
                            maxlength="11" :clearable="false" :disabled="isReadOnly">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="需要垃圾桶数(个)" name="bucketCount" required>
                        <uni-easyinput v-model="formData.bucketCount" placeholder="请输入垃圾桶数量" type="number"
                            :clearable="false" :disabled="isReadOnly">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="预估垃圾重量" name="estimatedWeight" required>
                        <uni-easyinput v-model="formData.estimatedWeight" placeholder="请输入预估垃圾重量" type="number"
                            :clearable="false" :disabled="isReadOnly">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="营业执照上传" name="licenseImages" required>
                        <uni-file-picker v-model="formData.licenseImages" file-mediatype="image" mode="grid" :limit="3"
                            :auto-upload="true" :upload-url="uploadUrl" :header="uploadHeaders" @select="onFileSelect"
                            @progress="onUploadProgress" @success="onUploadSuccess" @fail="onUploadFail"
                            @delete="onFileDelete" :disabled="isReadOnly" file-extname="jpg,jpeg,png"
                            :max-size="20971520">
                        </uni-file-picker>
                        <text class="upload-tip" v-if="!isReadOnly">最多上传3张图片，每张图片不超过20MB，支持jpg、png格式</text>
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
                    <uni-easyinput v-model="searchKeyword" placeholder="搜索商户名称" :clearable="true" />
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
import { apiPostMerchantCheck, apiGetMerchantCheck, apiSelectMerchantList } from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'
import { uploadUrl, createUploadHeaders } from '@/utils/config.js'

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


// 是否为只读状态
const isReadOnly = computed(() => {
    return authStatus.value === 'pending' || authStatus.value === 'approved'
})

// 是否显示商户选择器（只有需要认证的状态才显示）
const showMerchantSelector = computed(() => {
    return authStatus.value === 'none' || authStatus.value === 'rejected'
})

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
    licenseImages: [] // 改为数组支持多图上传
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

//商户名称选择
const merchantNameOptions = ref([])

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
                    console.log('===== 开始验证营业执照 =====')
                    console.log('验证营业执照 - 完整数据:', JSON.stringify(value))
                    console.log('验证营业执照 - 数据类型:', typeof value)
                    console.log('验证营业执照 - 是否数组:', Array.isArray(value))
                    console.log('验证营业执照 - 原始值:', value)

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

                    // 检查是否有有效的文件（更全面的检查）
                    const validFiles = value.filter((file, index) => {
                        console.log(`检查文件${index}:`, JSON.stringify(file))
                        if (!file) {
                            console.log(`文件${index}: 文件对象为空`)
                            return false
                        }

                        // 检查各种可能的文件格式
                        const hasUrl = file.url && file.url.trim()
                        const hasPath = file.path && file.path.trim()
                        const hasResponse = file.response && file.response.url
                        const isString = typeof file === 'string' && file.trim()
                        const hasFileId = file.fileID || file.id
                        const hasName = file.name
                        const hasSize = file.size
                        const hasTempFilePath = file.tempFilePath // uni-file-picker 的临时文件路径
                        const hasFile = file.file // 原始文件对象

                        console.log(`文件${index}检查结果:`, {
                            hasUrl, hasPath, hasResponse, isString, hasFileId, hasName, hasSize, hasTempFilePath, hasFile,
                            url: file.url,
                            path: file.path,
                            name: file.name,
                            size: file.size,
                            tempFilePath: file.tempFilePath,
                            file: file.file
                        })

                        const isValid = hasUrl || hasPath || hasResponse || isString || hasFileId || hasName || hasTempFilePath || hasFile
                        console.log(`文件${index}是否有效:`, isValid)
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
    }
}

// 文件上传配置
const uploadHeaders = createUploadHeaders()

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

// 页面加载完成
onMounted(() => {
    console.log('商户认证页面加载完成')
    // 这里可以调用接口获取认证状态
    loadAuthStatus()
    // 加载商户列表
    loadMerchantList()
})

// 加载认证状态
const loadAuthStatus = async () => {
    try {
        console.log('开始加载认证状态...')

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

            console.log('认证状态加载成功, 状态:', result.data.status)
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
        const imageUrls = data.img.split(',').filter(url => url.trim())
        formData.licenseImages = imageUrls.map(url => ({
            url: url.trim(),
            path: url.trim(),
            name: '营业执照'
        }))
    }

    console.log('数据回显完成:', formData)
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



// 文件上传成功事件
const onUploadSuccess = (res) => {
    console.log('===== 文件上传成功事件 =====')
    console.log('上传成功回调参数:', res)
    console.log('tempFiles:', res.tempFiles)
    console.log('tempFilePaths:', res.tempFilePaths)
    console.log('当前formData.licenseImages:', formData.licenseImages)

    // 根据文档，上传成功后 v-model 会自动绑定值
    // 但我们仍需要触发表单验证
    setTimeout(() => {
        console.log('延迟后的formData.licenseImages:', formData.licenseImages)
        if (formRef.value) {
            formRef.value.validateField('licenseImages')
        }
    }, 200) // 增加延迟时间，确保 v-model 更新完成

    console.log('===== 文件上传成功事件结束 =====')
}

// 文件上传失败事件
const onUploadFail = (err) => {
    console.error('文件上传失败:', err)
    uni.showToast({
        title: '文件上传失败',
        icon: 'none'
    })
}

// 文件选择事件
const onFileSelect = (res) => {
    console.log('===== 文件选择事件 =====')
    console.log('选择文件:', res)
    console.log('tempFiles:', res.tempFiles)
    console.log('tempFilePaths:', res.tempFilePaths)
    console.log('选择前formData.licenseImages:', formData.licenseImages)

    // 手动更新表单数据，因为 v-model 可能要等上传完成后才更新
    if (res.tempFiles && res.tempFiles.length > 0) {
        // 将选择的文件添加到表单数据中
        formData.licenseImages = [...formData.licenseImages, ...res.tempFiles]
        console.log('手动更新后formData.licenseImages:', formData.licenseImages)

        // 触发表单验证
        setTimeout(() => {
            if (formRef.value) {
                formRef.value.validateField('licenseImages')
            }
        }, 100)
    }

    console.log('===== 文件选择事件结束 =====')
}

// 文件上传进度事件
const onUploadProgress = (res) => {
    console.log('上传进度:', res)
}

// 文件删除事件
const onFileDelete = (res) => {
    console.log('===== 文件删除事件 =====')
    console.log('文件删除:', res)
    console.log('删除前formData.licenseImages:', formData.licenseImages)

    // v-model 应该会自动更新，但我们确保验证被触发
    setTimeout(() => {
        console.log('删除后formData.licenseImages:', formData.licenseImages)
        if (formRef.value) {
            formRef.value.validateField('licenseImages')
        }
    }, 100)
    console.log('===== 文件删除事件结束 =====')
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

// 表单验证（使用uni-forms的验证方式）
const validateForm = async () => {
    try {
        const result = await formRef.value.validate()
        return true
    } catch (error) {
        console.log('表单验证失败:', error)
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
            imageUrls = formData.licenseImages.map(file => {
                // uni-file-picker返回的文件对象结构
                if (typeof file === 'string') {
                    return file
                } else if (file.url) {
                    return file.url
                } else if (file.path) {
                    return file.path
                } else {
                    return file
                }
            })
        }

        // 准备提交数据 - 只包含API需要的字段
        const submitData = {
            userid: userStore.userId,
            name: formData.merchantName,              // 商户名称
            address: formData.address,                // 地址
            appcode: formData.appcode,                // 区域代码
            lat: parseFloat(formData.latitude),       // 纬度
            lon: parseFloat(formData.longitude),      // 经度
            contactTruename: formData.contactPerson,  // 联系人姓名
            contactTel: formData.contactPhone,        // 联系电话
            bucketNum: parseInt(formData.bucketCount), // 预计桶数量
            trashWeight: parseFloat(formData.estimatedWeight), // 预估垃圾重量
            img: imageUrls.join(',') // 法人证照片，多张图片用逗号分隔
        }

        console.log('提交认证数据:', submitData)

        // 调用认证提交API
        const result = await apiPostMerchantCheck(submitData)
        console.log('认证提交API返回:', result)

        uni.showToast({
            title: '认证申请提交成功',
            icon: 'success'
        })

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
        console.error('提交认证失败:', error)
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

            // uni-easyinput样式调整，根据官方文档优化
            // 使用!important是因为uni-app组件有内联样式和深层嵌套样式，需要强制覆盖
            :deep(.uni-easyinput) {
                .uni-easyinput__content {
                    border: none !important;
                    border-radius: 0 !important;
                    border-bottom: 2rpx solid #e5e5e5 !important;
                    background: transparent !important;
                    padding: 0 30rpx 10rpx 30rpx !important; // 左右各30rpx边距
                    height: 60rpx !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    position: relative !important;

                    &.is-focused {
                        border-bottom-color: #07c160 !important;
                    }
                }

                .uni-easyinput__content-input {
                    font-size: 28rpx !important;
                    color: rgba(38, 38, 38, 1) !important;
                    height: 40rpx !important; // 设置固定高度
                    line-height: 40rpx !important; // 行高与高度一致实现垂直居中
                    padding: 0 !important;
                    margin: 0 !important;
                    flex: 1 !important;
                    text-align: left !important;
                    transform: translateY(5rpx) !important; // 向下偏移10rpx
                    box-sizing: border-box !important;
                }

                .uni-easyinput__placeholder-class {
                    color: rgba(191, 191, 191, 1) !important;
                    font-size: 28rpx !important;
                    line-height: 40rpx !important;
                    text-align: left !important;
                    transform: translateY(5rpx) !important; // 占位符也向下偏移10rpx
                }

                // 清除按钮样式调整
                .uni-easyinput__content-clear-icon {
                    transform: translateY(10rpx) !important; // 清除按钮也向下偏移
                }
            }

            // uni-data-select样式调整，与uni-easyinput保持一致
            :deep(.uni-data-select) {
                .uni-data-select__input-box {
                    border: none !important;
                    border-radius: 0 !important;
                    border-bottom: 2rpx solid #e5e5e5 !important;
                    background: transparent !important;
                    padding: 0 30rpx 10rpx 30rpx !important; // 左右各30rpx边距
                    height: 60rpx !important;
                    box-shadow: none !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    position: relative !important;

                    .uni-data-select__input {
                        font-size: 28rpx !important;
                        color: rgba(38, 38, 38, 1) !important;
                        height: 40rpx !important; // 设置固定高度
                        line-height: 40rpx !important; // 行高与高度一致
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        flex: 1 !important;
                        text-align: left !important;
                        transform: translateY(10rpx) !important; // 向下偏移10rpx
                        box-sizing: border-box !important;
                    }

                    .uni-data-select__input.uni-data-select__input--placeholder {
                        color: rgba(191, 191, 191, 1) !important;
                        line-height: 40rpx !important;
                        text-align: left !important;
                        transform: translateY(10rpx) !important; // 占位符也向下偏移10rpx
                    }

                    // 下拉箭头也向下偏移
                    .uni-data-select__input-arrow {
                        transform: translateY(10rpx) !important;
                    }
                }

                // 移除选择器的外层边框
                .uni-data-select__selector {
                    border: none !important;
                    box-shadow: none !important;
                }

                // 移除可能存在的其他边框
                &>view {
                    border: none !important;
                }
            }

            // 上传提示样式
            .upload-tip {
                font-size: 24rpx;
                color: #999999;
                margin-top: 10rpx;
                line-height: 1.4;
            }

            // 位置选择器样式，与其他输入框保持一致
            .location-picker {
                .location-input {
                    border: none;
                    border-bottom: 2rpx solid #e5e5e5;
                    padding: 0 30rpx 10rpx 30rpx; // 左右各30rpx边距
                    height: 60rpx;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    cursor: pointer;
                    position: relative;

                    .location-info {
                        display: flex;
                        flex-direction: column;
                        gap: 2rpx; // 减小间距
                        flex: 1;
                        justify-content: center;
                        align-items: flex-start;
                        transform: translateY(10rpx); // 向下偏移10rpx

                        .location-name {
                            font-size: 28rpx;
                            color: rgba(38, 38, 38, 1);
                            font-weight: 500;
                            line-height: 1.3;
                            text-align: left;
                        }

                        .location-coords {
                            font-size: 20rpx; // 稍微减小字体
                            color: #666666;
                            line-height: 1.2;
                            text-align: left;
                        }
                    }

                    .location-placeholder {
                        color: rgba(191, 191, 191, 1);
                        font-size: 28rpx;
                        flex: 1;
                        line-height: 40rpx; // 与输入框保持一致
                        display: flex;
                        align-items: center;
                        text-align: left;
                        transform: translateY(10rpx); // 向下偏移10rpx
                    }

                    // 位置图标也向下偏移
                    .uni-icons {
                        transform: translateY(10rpx) !important;
                    }

                    &:active {
                        background-color: rgba(0, 0, 0, 0.05);
                    }

                    &.disabled {
                        cursor: not-allowed;
                        opacity: 0.6;

                        &:active {
                            background-color: transparent;
                        }
                    }
                }
            }

            // 商户名称输入框样式
            .merchant-name-input {
                display: flex;
                align-items: center;
                gap: 10rpx;

                .merchant-input {
                    flex: 1;
                }

                .select-btn {
                    width: 120rpx;
                    height: 60rpx;
                    background: #007aff;
                    color: white;
                    border: none;
                    border-radius: 8rpx;
                    font-size: 24rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:disabled {
                        background: #ccc;
                        color: #999;
                    }

                    &:active:not(:disabled) {
                        background: #0056b3;
                    }
                }
            }

            // 只读状态样式
            &.readonly {
                :deep(.uni-easyinput) {
                    .uni-easyinput__content {
                        background-color: #f5f5f5 !important;

                        .uni-easyinput__content-input {
                            color: #999 !important;
                        }
                    }
                }

                :deep(.uni-data-select) {
                    .uni-data-select__input-box {
                        background-color: #f5f5f5 !important;

                        .uni-data-select__input {
                            color: #999 !important;
                        }
                    }
                }

                :deep(.uni-file-picker) {
                    opacity: 0.6;
                    pointer-events: none;
                }
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

    // 自定义导航栏字体大小为34rpx
    :deep(.uni-navbar__content-title) {
        font-size: 34rpx !important;
    }

    :deep(.uni-nav-bar-text) {
        font-size: 34rpx !important;
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
