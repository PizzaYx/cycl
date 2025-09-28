<!-- 临时预约界面 -->
<template>
    <view class="auth-container">
        <PageHeader title="临时预约" @back="back" />
        <!-- 步骤条 -->
        <!-- <view class="step-container">
            <view class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
                <view class="step-circle">
                    <text class="step-number" v-if="currentStep <= 1">1</text>
                    <text class="step-check" v-else>✓</text>
                </view>
                <text class="step-label">申请预约</text>
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
                <text class="step-label">预约成功</text>
            </view>
        </view> -->

        <!-- 认证表单 -->
        <view class="auth-form">
            <view class="form-section" :class="{ readonly: isReadOnly }">
                <view class="status-tip" v-if="isReadOnly">
                    <view class="tip-content" v-if="authStatus === 'pending'">
                        <uni-icons type="info" size="16" color="#ff9500"></uni-icons>
                        <text class="tip-text">您的预约申请正在审核中，请耐心等待</text>
                    </view>
                    <view class="tip-content approved" v-else-if="authStatus === 'approved'">
                        <uni-icons type="checkmarkempty" size="16" color="#07c160"></uni-icons>
                        <text class="tip-text">恭喜！您的临时预约已通过</text>
                    </view>
                </view>

                <!-- 审核不通过提示 -->
                <view class="status-tip" v-if="authStatus === 'rejected'">
                    <view class="tip-content rejected">
                        <uni-icons type="closeempty" size="16" color="#ff4444"></uni-icons>
                        <text class="tip-text">很抱歉，您的预约申请未通过审核，请重新提交</text>
                    </view>
                </view>
                <text class="section-title">基本信息</text>

                <!-- 使用uni-forms表单组件 -->
                <uni-forms ref="formRef" :modelValue="formData" :rules="formRules" label-position="top">
                    <uni-forms-item label="商户名称" name="merchantName">
                        <uni-easyinput v-model="formData.merchantName" :clearable="false" :disabled="true">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="商户地址" name="address">
                        <uni-easyinput v-model="formData.address" :clearable="false" :disabled="true">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="联系电话" name="contactPhone">
                        <uni-easyinput v-model="formData.contactPhone" type="number" maxlength="11" :clearable="false"
                            :disabled="true">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="预估垃圾桶数(个)" name="bucketCount" required>
                        <uni-easyinput v-model="formData.bucketCount" placeholder="请输入垃圾桶数量" type="number"
                            :clearable="false" :disabled="isReadOnly">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="预估垃圾重量(kg)" name="estimatedWeight" required>
                        <uni-easyinput v-model="formData.estimatedWeight" placeholder="请输入预估垃圾重量" type="number"
                            :clearable="false" :disabled="isReadOnly">
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="预约时间" name="estimatedTime" required>
                        <!-- 只读状态：使用 uni-easyinput 显示文本 -->
                        <uni-easyinput v-if="isReadOnly" :value="getDateTimeText()" :disabled="true"
                            placeholder="请选择预约时间" :clearable="false" />
                        <!-- 编辑状态：使用 uni-datetime-picker 插槽 -->
                        <uni-datetime-picker v-else v-model="formData.estimatedTime" type="date" :start="minDate"
                            :end="maxDate" :clearable="false">
                            <view class="datetime-slot" @click="openDateTimePicker">
                                <text v-if="formData.estimatedTime" class="datetime-text">{{
                                    formatDateTime(formData.estimatedTime) }}</text>
                                <text v-else class="datetime-placeholder">请选择预约时间</text>
                                <uni-icons type="calendar" size="20" color="#999"></uni-icons>
                            </view>
                        </uni-datetime-picker>
                    </uni-forms-item>

                    <uni-forms-item label="备注说明" name="estimatedRemarks" required>
                        <uni-easyinput v-model="formData.estimatedRemarks" placeholder="请输入其他要说明的信息" type="text"
                            :clearable="false" :disabled="isReadOnly">
                        </uni-easyinput>
                    </uni-forms-item>

                </uni-forms>
            </view>

            <!-- 提交按钮 -->
            <view class="submit-section" v-if="authStatus === 'none' || authStatus === 'rejected'">
                <button class="submit-btn" @click="submitAuth" :loading="submitting">
                    {{ authStatus === 'rejected' ? '重新提交' : '提交' }}
                </button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { apiPostaddPlanTemporary } from '@/api/apis.js'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user.js'
import PageHeader from '@/components/PageHeader/PageHeader.vue'
const userStore = useUserStore();
//返回上一页
const back = () => {
    uni.navigateBack()
}

// 接收页面参数
const props = ref({
    id: null,
    status: null
})

onLoad((options) => {
    // 接收参数并设置默认值
    props.value.id = options.id ? parseInt(options.id) : null;
    props.value.status = options.status ? parseInt(options.status) : null; // 默认为null
    console.log('接收到的参数:', props.value);

});


// 是否为只读状态
const isReadOnly = computed(() => {
    return authStatus.value === 'pending' || authStatus.value === 'approved'
})


// 表单数据
const formData = reactive({
    merchantName: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    bucketCount: '',
    estimatedWeight: '',
    estimatedTime: '',
    estimatedRemarks: '',
})

// 计算最小和最大可选日期
const minDate = computed(() => {
    const now = new Date()
    return now.toISOString().slice(0, 19).replace('T', ' ')
})

const maxDate = computed(() => {
    const now = new Date()
    const max = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30天后
    return max.toISOString().slice(0, 19).replace('T', ' ')
})

// //0:未审核/待审核 1:审核成功 2: 审核不通过
const currentStep = computed(() => {
    const status = props.value.status
    switch (status) {
        case 0: // 待审核
            return 2
        case 1: // 认证成功
            return 3
        case 2: // 审核不通过
            return 1
        default: // 未提交
            return 1
    }
})

// 认证状态 - 根据后端状态码正确映射
const authStatus = computed(() => {
    const status = props.value.status
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

// 表单引用
const formRef = ref()

// 表单验证规则
const formRules = {
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
    estimatedTime: {
        rules: [
            { required: true, errorMessage: '请选择预约时间' }
        ]
    },
    estimatedRemarks: {
        rules: [
            { required: true, errorMessage: '请输入备注说明' }
        ]
    }
}

// 提交状态
const submitting = ref(false)

// 获取日期时间文本（用于只读显示）
const getDateTimeText = () => {
    if (formData.estimatedTime) {
        return formatDateTime(formData.estimatedTime)
    }
    return ''
}

// 格式化日期时间
const formatDateTime = (dateTime) => {
    if (!dateTime) return ''
    const date = new Date(dateTime)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// 打开日期时间选择器
const openDateTimePicker = () => {
    // uni-datetime-picker 会自动处理点击事件
    // 这里可以添加额外的逻辑，比如日志记录等
}

// 页面加载完成
onMounted(async () => {
    // 确保用户信息已加载
    await userStore.ensureUserInfo()

    // 根据页面状态填充表单数据
    if (props.value.status !== null) {
        // 如果有状态，说明是查看或编辑已有预约
        // 这里可以根据需要调用API获取具体的预约数据
        // const reservationData = await getReservationData(props.value.id)
        // fillFormData(reservationData)
    }

    // 填充基本的用户信息
    fillFormData(null)
})


// 数据回显函数
const fillFormData = (data) => {
    console.log('开始数据回显:', data, '用户信息:', userStore.userInfo)

    // 基本信息回显 - 从用户store获取
    formData.merchantName = userStore.merchant?.name || userStore.userInfo?.name || ''
    formData.address = userStore.merchant?.address || userStore.userInfo?.address || ''
    formData.contactPerson = userStore.merchant?.contactTruename || userStore.userInfo?.contactTruename || ''
    formData.contactPhone = userStore.merchant?.contactTel || userStore.userInfo?.contactTel || ''

    // 如果有传入的预约数据，则回显预约相关信息
    if (data) {
        formData.bucketCount = data.bucketNum?.toString() || ''
        formData.estimatedWeight = data.trashWeight?.toString() || ''
        formData.estimatedTime = data.estimatedTime || ''
        formData.estimatedRemarks = data.estimatedRemarks || ''
    }

    console.log('数据回显完成:', formData)
}


// 表单验证（使用uni-forms的验证方式）
const validateForm = async () => {
    try {
        return await formRef.value.validate()
    } catch (error) {
        console.log('表单验证失败:', error)
        return false
    }
}

// 提交预约
const submitAuth = async () => {
    // 先进行表单验证
    const isValid = await validateForm()
    if (!isValid) {
        return
    }
    submitting.value = true
    try {
        // 准备提交数据 - 只包含API需要的字段
        const submitData = {
            merchantId: userStore.merchant?.id, // 用户ID
            name: formData.merchantName,              // 商户名称
            address: formData.address,                // 地址
            contactTruename: formData.contactPerson,  // 联系人姓名
            contactTel: formData.contactPhone,        // 联系电话
            bucketNum: parseInt(formData.bucketCount), // 预计桶数量
            trashWeight: parseInt(formData.estimatedWeight), // 预估垃圾重量
            appointmentTime: formData.estimatedTime,    // 预约时间
            explain: formData.estimatedRemarks, // 备注说明
        }

        // 调用临时预约提交API
        const result = await apiPostaddPlanTemporary(submitData)
        console.log('预约提交API返回:', submitData)

        // 检查返回结果
        if (result && result.code === 200) {
            uni.showToast({
                title: '预约申请提交成功',
                icon: 'success'
            })

            // 更新页面状态 - 提交成功后状态为待审核(0)
            props.value.status = 0

            // 延迟返回上一页，让用户看到成功提示
            setTimeout(() => {
                uni.navigateBack()
            }, 1000)
        } else {
            // 处理API返回的错误信息
            uni.showToast({
                title: result?.msg || '提交失败，请重试',
                icon: 'none'
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
            margin-top: 30rpx;
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


            // uni-easyinput样式调整，参照shCertification.vue的input-field样式
            // 使用!important是因为uni-app组件有内联样式和深层嵌套样式，需要强制覆盖
            :deep(.uni-easyinput) {
                .uni-easyinput__content {
                    border: none !important;
                    border-radius: 0 !important;
                    border-bottom: 2rpx solid #e5e5e5 !important;
                    background: transparent !important;
                    padding: 0 !important;
                    height: 55rpx !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    position: relative !important;
                    width: calc(100% - 24rpx) !important; // 减去左右边距，与下划线对齐
                    margin-left: 12rpx !important; // 可输入状态：向右偏移12rpx来对齐*号
                    margin-right: 12rpx !important; // 右边距12rpx，与下划线对齐
                    box-sizing: border-box !important;

                    &.is-focused {
                        border-bottom-color: #07c160 !important;
                    }

                    // 只读状态：不偏移，因为没有*号
                    &.is-disabled {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        width: 100% !important;
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
                    box-sizing: border-box !important;
                }

                .uni-easyinput__placeholder-class {
                    color: rgba(191, 191, 191, 1) !important;
                    font-size: 28rpx !important;
                    line-height: 40rpx !important;
                    text-align: left !important;
                }

            }

            // uni-data-select样式调整，与uni-easyinput保持一致
            :deep(.uni-data-select) {
                .uni-data-select__input-box {
                    border: none !important;
                    border-radius: 0 !important;
                    border-bottom: 2rpx solid #e5e5e5 !important;
                    background: transparent !important;
                    padding: 0 !important;
                    height: 55rpx !important;
                    box-shadow: none !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    position: relative !important;
                    width: calc(100% - 24rpx) !important; // 减去左右边距，与下划线对齐
                    margin-left: 12rpx !important; // 可输入状态：向右偏移12rpx来对齐*号
                    margin-right: 12rpx !important; // 右边距12rpx，与下划线对齐
                    box-sizing: border-box !important;

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
                        box-sizing: border-box !important;
                    }

                    .uni-data-select__input.uni-data-select__input--placeholder {
                        color: rgba(191, 191, 191, 1) !important;
                        line-height: 40rpx !important;
                        text-align: left !important;
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

            // 日期时间选择器插槽样式，与其他输入框保持一致
            .datetime-slot {
                border: none;
                border-bottom: 2rpx solid #e5e5e5;
                padding: 0;
                height: 55rpx;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                cursor: pointer;
                position: relative;
                width: calc(100% - 24rpx); // 减去左右边距，与下划线对齐
                margin-left: 12rpx; // 可输入状态：向右偏移12rpx来对齐*号
                margin-right: 12rpx; // 右边距12rpx，与下划线对齐
                box-sizing: border-box;

                .datetime-text {
                    font-size: 28rpx;
                    color: rgba(38, 38, 38, 1);
                    flex: 1;
                    line-height: 40rpx; // 与输入框保持一致
                    display: flex;
                    align-items: center;
                    text-align: left;
                }

                .datetime-placeholder {
                    color: rgba(191, 191, 191, 1);
                    font-size: 28rpx;
                    flex: 1;
                    line-height: 40rpx; // 与输入框保持一致
                    display: flex;
                    align-items: center;
                    text-align: left;
                }


                &:active {
                    background-color: rgba(0, 0, 0, 0.05);
                }
            }

            // 日期时间选择器样式（仅在编辑状态使用）
            :deep(.uni-datetime-picker) {
                .uni-date-editor--x {
                    border: none !important;
                    border-bottom: 2rpx solid #e5e5e5 !important;
                    background: transparent !important;
                    padding: 0 !important;
                    height: 55rpx !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    position: relative !important;
                    width: calc(100% - 24rpx) !important; // 减去左右边距，与下划线对齐
                    margin-left: 12rpx !important; // 可输入状态：向右偏移12rpx来对齐*号
                    margin-right: 12rpx !important; // 右边距12rpx，与下划线对齐
                    box-sizing: border-box !important;

                    .uni-date__x-input {
                        font-size: 28rpx !important;
                        color: rgba(38, 38, 38, 1) !important;
                        height: 40rpx !important;
                        line-height: 40rpx !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        flex: 1 !important;
                        text-align: left !important;
                        box-sizing: border-box !important;
                    }

                    .uni-date__x-input-placeholder {
                        color: rgba(191, 191, 191, 1) !important;
                        font-size: 28rpx !important;
                        line-height: 40rpx !important;
                        text-align: left !important;
                    }
                }

                &.uni-date-x--border {
                    border: none !important;
                }

                .uni-date-single--x,
                .uni-date-range--x {
                    top: 60rpx !important;
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

            // 禁用状态样式（等同于只读样式）
            :deep(.uni-easyinput) {
                .uni-easyinput__content.is-disabled {
                    margin-left: 12rpx !important;
                    margin-right: 12rpx !important;
                    width: calc(100% - 24rpx) !important;

                    .uni-easyinput__content-input {
                        color: rgba(38, 38, 38, 1) !important; // 禁用状态保持正常字体颜色
                    }
                }
            }

            // 禁用字段的label样式（等同于只读样式）
            // 商户名称、商户地址、联系电话字段整体向左缩进12rpx
            :deep(.uni-forms-item) {

                &:nth-child(1),
                &:nth-child(2),
                &:nth-child(3) {
                    .uni-forms-item__label {
                        margin-left: 12rpx !important;
                    }
                }
            }

            // 只读状态样式
            &.readonly {

                // 只读状态：label不显示*号，需要偏移12rpx来对齐
                :deep(.uni-forms-item__label) {
                    margin-left: 12rpx !important;
                }

                :deep(.uni-easyinput) {
                    .uni-easyinput__content {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        width: 100% !important;

                        .uni-easyinput__content-input {
                            color: rgba(38, 38, 38, 1) !important; // 只读状态保持正常颜色
                        }
                    }
                }

                :deep(.uni-data-select) {
                    .uni-data-select__input-box {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        width: 100% !important;

                        .uni-data-select__input {
                            color: rgba(38, 38, 38, 1) !important; // 只读状态保持正常颜色
                        }
                    }
                }

                :deep(.uni-datetime-picker) {
                    .uni-date-editor--x {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        width: 100% !important;

                        .uni-date__x-input {
                            color: rgba(38, 38, 38, 1) !important; // 只读状态保持正常颜色
                        }
                    }
                }

                // 只读状态下插槽内容的样式
                .datetime-slot {
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                    width: 100% !important;

                    .datetime-text {
                        color: rgba(38, 38, 38, 1) !important; // 只读状态保持正常颜色
                    }

                    .datetime-placeholder {
                        color: rgba(38, 38, 38, 1) !important; // 只读状态保持正常颜色
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

}
</style>