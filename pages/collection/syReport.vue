<!-- 收运上报 -->
<template>
    <view class="container">
        <PageHeader title="收运上报" @back="back" />
        <!-- 添加商店信息和扫码区域 -->
        <view class="store-info">
            <view class="store-name">商店名称: {{ merchantName }}</view>
            <view class="bin-info">
                <text>垃圾桶: <text class="bin-count">{{ ljNum ?? 0 }}</text> 个</text>
                <uni-icons type="scan" size="30" color="#07C160" class="scan-icon" @click="handleScan" />
            </view>
        </view>
        <scroll-view class="content" scroll-y>
            <view class="record-list">
                <!-- 当没有数据时显示提示 -->
                <view v-if="records.length === 0" class="empty-tip">
                    <text>请点击右上扫码按钮获进行收运</text>
                </view>

                <!-- 有数据时显示记录列表 -->
                <view v-for="(item, index) in records" :key="index" class="record-item">
                    <view class="record-header">
                        <text class="bucket-number">桶 {{ index + 1 }} 重量: </text>
                        <view class="weight-display">
                            <text class="weight-value">{{ item.weight }}</text>
                            <text class="weight-unit"> kg</text>
                        </view>
                    </view>
                </view>

                <!-- 刷新按钮  -->
                <view v-if="showRefreshButton" class="refresh-button" @click="handleRefresh">
                    <uni-icons type="reload" size="40" color="#07C160"></uni-icons>
                </view>
            </view>
        </scroll-view>

        <!-- 固定底部按钮 -->
        <view class="bottom-button">
            <button class="btn-complete" @click="getSyCheckDetail">收运完成</button>
        </view>
    </view>
</template>

<script setup>
// @ts-nocheck
import { ref } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期
import { uploadUrl, createUploadHeaders } from '@/utils/config.js';
import { apiPostreportWeight, apiGetDriverPlanById, apiGetdriverConfirmPlan, apiGetMerchantBucke, apiGetBackfillBuckeWeight, apiGetPlanBuckeWeight } from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'
import uniFilePicker from '@/uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.vue'
import PageHeader from '@/components/PageHeader/PageHeader.vue'

// 返回上一页
const back = () => {
    // 返回前发送事件通知sfDetails页面刷新
    uni.$emit('refreshSfDetails');
    uni.navigateBack();
};

// 刷新按钮处理
const handleRefresh = async () => {
    try {
        // // 显示加载提示
        // uni.showLoading({
        //     title: '刷新中...'
        // });

        // 调用 apiGetBackfillBuckeWeight 获取回填重量
        const weightRes = await apiGetBackfillBuckeWeight({
            id: planId.value,           // 收运单ID
            merchantId: merchantId.value, // 商户ID
            driverId: driverId.value,   // 司机ID
            registrationNumber: registrationNumber.value // 车牌号
        });

        if (weightRes.code === 200) {
            console.log('刷新获取的重量信息:', weightRes.data);

            // 清空当前记录
            records.value = [];
            submitData.value = [];
            ljNum.value = 0;

            // 重新添加记录
            if (weightRes.data && (Array.isArray(weightRes.data) ? weightRes.data.length > 0 : true)) {
                addRecordsFromBucketData([], weightRes.data);

                uni.showToast({
                    title: '刷新成功',
                    icon: 'success'
                });
            } else {
                uni.showToast({
                    title: '未获取到数据，请稍后点击刷新按钮',
                    icon: 'none',
                    duration: 2000
                });
            }
        } else {
            uni.showToast({
                title: weightRes.msg || '刷新失败',
                icon: 'none'
            });
        }
    } catch (error) {
        console.error('刷新重量数据异常:', error);
        uni.showToast({
            title: '刷新异常',
            icon: 'none'
        });
    } finally {
        // uni.hideLoading();
    }
};

const ljNum = ref(0); // 垃圾桶数量
const showRefreshButton = ref(false); // 控制刷新按钮显示

// 新增接收页面参数的变量
const carId = ref(''); // 车辆ID
const driverId = ref(''); // 司机ID
const merchantId = ref(''); // 商户ID
const planId = ref(''); // 收运单ID
const merchantName = ref('')//商家名称
const registrationNumber = ref('')//车牌号

const userStore = useUserStore()
const records = ref([]);
// 新增提交数据存储
const submitData = ref([]);

// 页面加载时获取传入的参数
onLoad(async (options) => {
    if (options.carId) carId.value = options.carId;
    if (options.driverId) driverId.value = options.driverId;
    if (options.merchantId) merchantId.value = options.merchantId;
    if (options.planId) planId.value = options.planId;
    if (options.merchantName) merchantName.value = options.merchantName;
    registrationNumber.value = userStore.sfmerchant?.registrationNumber;
    // if (options.registrationNumber) registrationNumber.value = options.registrationNumber;
    console.log('接收到的参数:', options);

});

// 收运完成
const getSyCheckDetail = () => {
    // 检查提交数据是否为空
    if (!submitData.value || submitData.value.length === 0) {
        uni.showToast({
            title: '没有收运数据，请先进行扫码上报操作',
            icon: 'none'
        });
        return;
    }

    // 确认收运完成
    uni.showModal({
        title: '确认收运完成',
        content: '是否确认收运完成？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    const confirmRes = await apiPostreportWeight(submitData.value);

                    if (confirmRes.code === 200) {
                        uni.showToast({
                            title: confirmRes.msg || '操作成功',
                            icon: 'success'
                        });
                        // 返回上一页
                        setTimeout(() => {
                            back();
                        }, 1500);
                    } else {
                        uni.showToast({
                            title: confirmRes.msg || '操作失败',
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    console.error('确认收运异常:', error);
                    uni.showToast({
                        title: '操作异常',
                        icon: 'none'
                    });
                }
            }
        }
    });
};

// 验证扫码结果格式
const validateScanResult = (scanResult) => {
    if (!scanResult || typeof scanResult !== 'string') {
        return false;
    }

    // 检查是否包含下划线
    if (!scanResult.includes('_')) {
        return false;
    }

    // 检查是否可以用下划线分割成2段
    const parts = scanResult.split('_');
    if (parts.length !== 2) {
        return false;
    }

    // 检查两段都不为空
    if (!parts[0] || !parts[1]) {
        return false;
    }

    // 可以添加更多验证规则，比如：
    // - 第一段是否为数字（桶编号）
    // - 第二段是否为时间格式（20250913145507）
    const bucketId = parts[0];
    const timestamp = parts[1];

    // 验证桶编号是否为数字
    if (!/^\d+$/.test(bucketId)) {
        return false;
    }

    // 验证时间戳格式（14位数字）
    if (!/^\d{14}$/.test(timestamp)) {
        return false;
    }

    return true;
};

const handleScan = () => {
    // 先进行扫码
    // @ts-ignore
    uni.scanCode({
        success: async (res) => {
            console.log('扫码结果', res);

            // 验证扫码结果格式
            if (!validateScanResult(res.result)) {
                uni.showToast({
                    title: '扫码格式不正确，请扫描正确的桶码',
                    icon: 'none'
                });
                return;
            }

            // 验证商户ID是否匹配
            const scanResult = res.result;
            const parts = scanResult.split('_');
            const scannedMerchantId = parts[0]; // 下划线前面的是商户ID

            console.log('扫码结果:', scanResult);
            console.log('扫码中的商户ID:', scannedMerchantId);
            console.log('当前商户ID:', merchantId.value);

            if (scannedMerchantId !== merchantId.value) {
                uni.showToast({
                    title: '桶码不属于当前商户，请扫描正确的桶码',
                    icon: 'none'
                });
                return;
            }

            // 检查是否已经扫描过相同的桶码
            const existingRecord = records.value.find(record => record.bucketCode === res.result);
            if (existingRecord) {
                uni.showToast({
                    title: '该桶码已扫描，请勿重复扫描',
                    icon: 'none'
                });
                return;
            }

            try {
                // 调用 apiGetMerchantBucke 获取商家所有桶信息
                const bucketRes = await apiGetMerchantBucke({
                    id: planId.value,           // 收运单ID
                    merchantId: merchantId.value, // 商户ID
                    driverId: driverId.value,   // 司机ID
                    registrationNumber: registrationNumber.value // 车牌号
                });

                if (bucketRes.code !== 200) {
                    uni.showToast({
                        title: bucketRes.msg || '获取桶信息失败',
                        icon: 'none'
                    });
                    return;
                }

                console.log('获取到的桶信息:', bucketRes.data);

                // 调用 apiGetBackfillBuckeWeight 回填重量
                const weightRes = await apiGetBackfillBuckeWeight({
                    id: planId.value,           // 收运单ID
                    merchantId: merchantId.value, // 商户ID
                    driverId: driverId.value,   // 司机ID
                    registrationNumber: registrationNumber.value // 车牌号
                });

                if (weightRes.code !== 200) {
                    // 重量回填失败不影响主流程，继续执行
                } else {
                }

                // 根据API返回的桶数据添加记录
                addRecordsFromBucketData(bucketRes.data, weightRes.data);

                // 扫码成功后显示刷新按钮
                showRefreshButton.value = true;

                // 根据weightRes.data情况显示不同提示
                if (weightRes.code === 200 && weightRes.data && (Array.isArray(weightRes.data) ? weightRes.data.length > 0 : true)) {
                    // 有数据时显示获取数据中提示
                    uni.showToast({
                        title: '获取数据成功',
                        icon: 'none',
                        duration: 2000
                    });
                } else {
                    // 未获取到数据时显示提示
                    uni.showToast({
                        title: '未获取到数据，请稍后点击右下刷新按钮',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } catch (error) {

                uni.showToast({
                    title: '获取桶信息异常',
                    icon: 'none'
                });
            }
        },
        fail: (err) => {
            console.log('扫码失败', err);
            uni.showToast({
                title: '扫码失败,请重试!',
                icon: 'none'
            });
        }
    });
};

// 根据API返回的桶数据添加记录
const addRecordsFromBucketData = (bucketData, weightData) => {
    // 清空之前的提交数据
    submitData.value = [];

    // 根据 apiGetBackfillBuckeWeight 的数据来添加记录，使用 apiGetMerchantBucke 里面的编号
    if (Array.isArray(weightData)) {
        // 如果重量数据是数组，按重量数据的数量来添加记录
        weightData.forEach((weightItem, index) => {
            // 从桶数据中获取对应的编号信息
            let bucketInfo = null;
            if (Array.isArray(bucketData) && bucketData.length > index) {
                bucketInfo = bucketData[index];
            }

            // 添加显示记录
            records.value.push({
                binCount: 1, // 默认垃圾桶数量为1
                weight: weightItem.weight || '', // 使用回填的重量数据
                images: [],
                isConfirmed: false, // 新添加的记录标记为未确认
                bucketCode: bucketInfo ? bucketInfo.bucketCode : '', // 桶编码，有就给，没有就空着
                bucketType: bucketInfo ? bucketInfo.bucketType : '', // 桶类型
                bucketName: bucketInfo ? bucketInfo.bucketName : '', // 桶名称
                id: `temp_${Date.now()}_${index}` // 临时ID
            });

            // 添加提交数据
            submitData.value.push({
                thirdpartyId: weightItem.id, // 第三方垃圾桶称重记录id
                bucketCode: bucketInfo ? bucketInfo.bucketCode : '', // 桶编码
                weight: parseFloat(weightItem.weight || 0), // 垃圾重量改为小数类型
                carId: carId.value, // 车辆ID
                driverId: driverId.value, // 司机ID
                merchantId: merchantId.value, // 商户ID
                planId: planId.value, // 收运单ID
            });

            ljNum.value++;
        });
    } else if (weightData && typeof weightData === 'object') {
        // 如果重量数据是单个对象
        // 从桶数据中获取第一个编号信息
        let bucketInfo = null;
        if (Array.isArray(bucketData) && bucketData.length > 0) {
            bucketInfo = bucketData[0];
        }

        // 添加显示记录
        records.value.push({
            binCount: 1, // 默认垃圾桶数量为1
            weight: weightData.weight || '', // 使用回填的重量数据
            images: [],
            isConfirmed: false, // 新添加的记录标记为未确认
            bucketCode: bucketInfo ? bucketInfo.bucketCode : '', // 桶编码，有就给，没有就空着
            bucketType: bucketInfo ? bucketInfo.bucketType : '', // 桶类型
            bucketName: bucketInfo ? bucketInfo.bucketName : '', // 桶名称
            id: `temp_${Date.now()}_0` // 临时ID
        });

        // 添加提交数据
        submitData.value.push({
            thirdpartyId: weightData.id, // 第三方垃圾桶称重记录id
            bucketCode: bucketInfo ? bucketInfo.bucketCode : '', // 桶编码
            weight: parseFloat(weightData.weight || 0), // 垃圾重量改为小数类型
            carId: carId.value, // 车辆ID
            driverId: driverId.value, // 司机ID
            merchantId: merchantId.value, // 商户ID
            planId: planId.value, // 收运单ID
        });

        ljNum.value++;
    } else {
        console.log('重量数据格式不正确');
    }

    console.log('提交数据:', submitData.value);
};


</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $bg-theme-color;
}

// 添加商店信息样式
.store-info {
    padding: 32rpx;
    background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
    margin: 20rpx;
    border-radius: 24rpx;
    box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(7, 193, 96, 0.1);

    .store-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333333;
        margin-bottom: 20rpx;
    }

    .bin-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        color: #666666;
        background: rgba(7, 193, 96, 0.05);
        padding: 16rpx 20rpx;
        border-radius: 16rpx;
        border: 1px solid rgba(7, 193, 96, 0.1);

        .bin-count {
            font-size: 36rpx;
            font-weight: bold;
            color: #07C160;
            display: inline-block;
            line-height: 1;
        }

        .scan-icon {
            cursor: pointer;
            padding: 8rpx;
            border-radius: 50%;
            background: rgba(7, 193, 96, 0.1);
            transition: all 0.3s ease;

            &:hover {
                background: rgba(7, 193, 96, 0.2);
                transform: scale(1.1);
            }
        }
    }
}

.content {
    flex: 1;
    overflow: auto;
    padding-bottom: 120rpx; // 为底部按钮留出空间

    .record-list {
        padding: 24rpx;

        .empty-tip {
            text-align: center;
            padding: 120rpx 40rpx;
            color: #999999;
            font-size: 32rpx;
            background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
            border-radius: 20rpx;
            margin: 20rpx;
            box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(7, 193, 96, 0.1);
            position: relative;
        }

        .record-item {
            background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
            border-radius: 20rpx;
            padding: 32rpx;
            margin-bottom: 20rpx;
            box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(7, 193, 96, 0.1);
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-2rpx);
                box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
            }

            .record-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12rpx;
                height: 35rpx;

                .bucket-number {
                    font-size: 28rpx;
                    font-weight: 600;
                    color: #333333;
                    line-height: 35rpx;
                    margin-top: 10rpx;
                }

                .weight-display {
                    display: flex;
                    align-items: center;
                    margin-top: 10rpx;

                    .weight-value {
                        font-size: 36rpx;
                        color: #07C160;
                        font-weight: 700;
                        line-height: 35rpx;
                    }

                    .weight-unit {
                        font-size: 24rpx;
                        color: #666666;
                        margin-left: 8rpx;
                        line-height: 35rpx;
                    }
                }
            }

            .record-details {
                .detail-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12rpx;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .detail-label {
                        font-size: 26rpx;
                        color: #666666;
                        min-width: 120rpx;
                    }

                    .detail-value {
                        font-size: 26rpx;
                        color: #333333;
                        font-weight: 500;
                        flex: 1;
                    }
                }
            }
        }

        .refresh-button {
            position: fixed;
            right: 30rpx;
            bottom: 300rpx;
            z-index: 999;
            width: 100rpx;
            height: 100rpx;
            background-color: #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(7, 193, 96, 0.2);
        }

        .record-card {
            background-color: #FFFFFF;
            border-radius: 16rpx;
            padding: 32rpx;
            margin-bottom: 24rpx;

            .input-group {
                margin-bottom: 32rpx;

                .input-item {
                    margin-bottom: 24rpx;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .label {
                        display: block;
                        font-size: 14px;
                        color: #333333;
                        margin-bottom: 16rpx;

                        .required {
                            color: #FF4D4F;
                            margin-right: 8rpx;
                        }
                    }

                    .input {
                        height: 88rpx;
                        background-color: #F5F5F5;
                        border-radius: 8rpx;
                        padding: 0 24rpx;
                        font-size: 14px;
                    }

                    // 重量输入容器样式
                    .weight-input-container {
                        display: flex;
                        align-items: center;
                        gap: 16rpx;

                        .input {
                            flex: 1;
                        }

                        .get-weight-btn {
                            width: 120rpx;
                            height: 54rpx;
                            background-color: #07C160;
                            color: #FFFFFF;
                            border: none;
                            border-radius: 32rpx;
                            font-size: 24rpx;
                            font-weight: 500;
                            line-height: 54rpx;
                            text-align: center;
                            white-space: nowrap;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            &:active {
                                background-color: #06AD56;
                            }

                            &[disabled] {
                                background-color: #CCCCCC;
                                color: #fff;
                            }
                        }
                    }

                    // 下划线样式输入框
                    .underline-input {
                        height: 88rpx;
                        background-color: transparent;
                        border: none;
                        border-bottom: 1px solid #e0e0e0;
                        border-radius: 0;
                        padding: 0 8rpx;
                        font-size: 14px;
                        box-shadow: none;

                        &:focus {
                            outline: none;
                            border-bottom: 1px solid #07C160;
                        }

                        // 只读状态样式
                        &[disabled] {
                            background-color: #f5f5f5;
                            color: #999;
                            -webkit-text-fill-color: #999; // 防止iOS设备上disabled文字变淡
                            opacity: 1; // 防止某些浏览器中disabled元素透明度变化
                        }

                        &.readonly-input {
                            background-color: #f5f5f5;
                            color: #999;
                        }
                    }
                }
            }

            .upload-section {
                margin-bottom: 32rpx;

                .label {
                    display: block;
                    font-size: 14px;
                    color: #333333;
                    margin-bottom: 16rpx;

                    .required {
                        color: #FF4D4F;
                        margin-right: 8rpx;
                    }
                }

                .upload-area {
                    margin-top: 16rpx;

                    .test-upload-btn {
                        width: 200rpx;
                        height: 60rpx;
                        background-color: #07C160;
                        color: #FFFFFF;
                        border: none;
                        border-radius: 8rpx;
                        font-size: 28rpx;
                        margin-bottom: 16rpx;
                    }

                    .upload-tip {
                        font-size: 24rpx;
                        color: #999999;
                        line-height: 1.5;
                        margin-top: 16rpx;
                    }
                }
            }

        }
    }
}

// 底部固定按钮样式
.bottom-button {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, #FFFFFF 100%);
    padding: 24rpx 32rpx 40rpx;
    border-top: 1px solid rgba(7, 193, 96, 0.1);
    z-index: 999;
    backdrop-filter: blur(10rpx);

    .btn-complete {
        width: 100%;
        height: 96rpx;
        background: linear-gradient(135deg, #07C160 0%, #06AD56 100%);
        color: #FFFFFF;
        border: none;
        border-radius: 48rpx;
        font-size: 32rpx;
        font-weight: 600;
        line-height: 96rpx;
        text-align: center;
        box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;


        &:hover {
            transform: translateY(-2rpx);
            box-shadow: 0 12rpx 32rpx rgba(7, 193, 96, 0.4);
        }

        &:active {
            transform: translateY(0);
            background: linear-gradient(135deg, #06AD56 0%, #059B4A 100%);
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        &:hover::after {
            left: 100%;
        }
    }
}
</style>