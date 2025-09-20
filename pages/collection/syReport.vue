<!-- 收运上报 -->
<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运上报"
            @clickLeft="back" />
        <!-- 添加商店信息和扫码区域 -->
        <view class="store-info">
            <view class="store-name">商店名称: {{ merchantName }}</view>
            <view class="bin-info">
                <text>垃圾桶个数: {{ ljNum }}个</text>
                <uni-icons type="scan" size="30" color="#07C160" class="scan-icon" @click="handleScan" />
            </view>
        </view>
        <scroll-view class="content" scroll-y>
            <view class="record-list">
                <!-- 当没有数据时显示提示 -->
                <view v-if="records.length === 0" class="empty-tip">
                    <text>请点击扫码按钮添加垃圾桶数据</text>
                </view>

                <!-- 有数据时显示记录列表 -->
                <view v-for="(item, index) in records" :key="index" class="record-card">
                    <view class="input-group">
                        <view class="input-item">
                            <!-- <text class="label"><text class="required">*</text>垃圾桶数（个）</text> -->
                            <input type="number" v-model="item.binCount" class="input underline-input readonly" disabled
                                placeholder="1" />
                        </view>
                        <view class="input-item">
                            <text class="label"><text class="required">*</text>厨余垃圾重量（kg）</text>
                            <view class="weight-input-container">
                                <input type="number" v-model="item.weight" class="input underline-input"
                                    :class="{ 'readonly-input': item.isConfirmed }" :disabled="item.isConfirmed"
                                    placeholder="请输入垃圾重量" />
                                <button class="get-weight-btn" @tap="handleGetWeight(index)"
                                    :disabled="item.isConfirmed">获取重量</button>
                            </view>
                        </view>
                    </view>

                    <view class="upload-section">
                        <text class="label"><text class="required">*</text>厨余垃圾照片</text>
                        <view class="upload-area">
                            <uni-file-picker v-model="item.images" file-mediatype="image" :limit="maxImageCount"
                                :upload-url="uploadUrl" :header="uploadHeaders" :disabled="item.isConfirmed"
                                :readonly="item.isConfirmed" return-type="array"
                                @select="(e) => handleFileSelect(e, index)">
                            </uni-file-picker>
                            <text class="upload-tip">最多可上传{{ maxImageCount }}张图片，每张图片不超过3M</text>
                        </view>
                    </view>

                    <view class="button-group">
                        <button v-if="!item.isConfirmed" class="btn btn-cancel" @click="handleCancel(index)">取消</button>
                        <button v-if="!item.isConfirmed" class="btn btn-confirm"
                            @click="handleConfirm(index)">确认</button>
                    </view>
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
import { apiPostreportWeight, apiGetDriverPlanById, apiGetdriverConfirmPlan } from '@/api/apis.js'
import { useUserStore } from '@/stores/user.js'

// 返回上一页
const back = () => {
    // 返回前发送事件通知sfDetails页面刷新
    uni.$emit('refreshSfDetails');
    uni.navigateBack();
};

const ljNum = ref(0); // 垃圾桶数量
const maxImageCount = 3; // 最大上传图片数量
const maxImageSize = 3 * 1024 * 1024; // 每张图片最大大小 3M

// 新增接收页面参数的变量
const carId = ref(''); // 车辆ID
const driverId = ref(''); // 司机ID
const merchantId = ref(''); // 商户ID
const planId = ref(''); // 收运单ID
const merchantName = ref('')//商家名称

// 文件上传配置
const uploadHeaders = createUploadHeaders().value // 添加 .value 获取实际值
const userStore = useUserStore()

const records = ref([]);

// 页面加载时获取传入的参数
onLoad((options) => {
    if (options.carId) carId.value = options.carId;
    if (options.driverId) driverId.value = options.driverId;
    if (options.merchantId) merchantId.value = options.merchantId;
    if (options.planId) planId.value = options.planId;
    if (options.merchantName) merchantName.value = options.merchantName;
    console.log('接收到的参数:', options);
});

// 文件选择事件处理
const handleFileSelect = (event, index) => {
    console.log('选择了图片')
    console.log('uploadUrl:', uploadUrl)
    console.log('uploadHeaders:', uploadHeaders)
    console.log('event:', event)

    // 手动更新对应记录的images数据
    if (event.tempFiles && event.tempFiles.length > 0) {
        const newImages = [...(records.value[index].images || []), ...event.tempFiles];
        records.value[index].images = newImages;

        // 手动上传文件
        uploadFileManually(event.tempFiles[0], index)
    }
};

// 手动上传文件
const uploadFileManually = (file, index) => {
    console.log('开始手动上传文件:', file)
    console.log('文件路径:', file.tempFilePath || file.path)
    console.log('上传URL:', uploadUrl)
    console.log('请求头:', uploadHeaders)

    uni.uploadFile({
        url: uploadUrl,
        filePath: file.tempFilePath || file.path,
        name: 'file',
        header: uploadHeaders,
        success: (res) => {
            console.log('手动上传成功:', res)
            // 处理上传成功
            const response = JSON.parse(res.data)
            console.log('服务器响应:', response)

            if (response.code === 200 && response.url) {
                // 更新文件信息
                records.value[index].images[records.value[index].images.length - 1] = {
                    ...file,
                    url: response.url,
                    fileName: response.fileName,
                    newFileName: response.newFileName,
                    originalFilename: response.originalFilename,
                    response: response
                }
                console.log('文件上传成功，URL:', response.url)
            } else {
                console.log('上传失败，服务器返回:', response)
            }
        },
        fail: (err) => {
            console.log('手动上传失败:', err)
            console.log('错误详情:', JSON.stringify(err))
        }
    })
};

// 获取重量按钮点击事件
const handleGetWeight = (index) => {
    console.log('获取重量按钮点击', { index, record: records.value[index] });
    // TODO: 在这里添加获取重量的具体逻辑
};

// 获取收运详情
const getSyCheckDetail = async () => {
    // 先检查本地是否有已确认的记录
    const confirmedRecords = records.value.filter(record => record.isConfirmed === true);

    if (confirmedRecords.length === 0) {
        uni.showToast({
            title: '请先进行收运上报操作并确认数据',
            icon: 'none'
        });
        return;
    }

    try {
        const res = await apiGetDriverPlanById({
            driverId: driverId.value,
            id: planId.value
        })

        if (res.code === 200) {
            const data = res.data;
            collectTask(data);
            console.log('详情', data);
        } else {
            uni.showToast({
                title: res.msg || '获取详情失败',
                icon: 'none'
            });
        }
    } catch (error) {
        console.error('获取详情异常:', error);
        uni.showToast({
            title: '获取详情异常',
            icon: 'none'
        });
    }
}

// 收运完成
const collectTask = (task) => {
    console.log('收运:', task.id);

    // 检查服务器返回的数据，判断是否有上报数据
    if (task.weight > 0 && task.bucketNum > 0) {
        //确认收运完成
        uni.showModal({
            title: '确认收运完成',
            content: '是否确认收运完成？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        const confirmRes = await apiGetdriverConfirmPlan({
                            id: task.id,
                            driverId: userStore.sfmerchant?.id,
                        });

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
        })
    }
    else {
        uni.showToast({
            title: '服务器未检测到上报数据，请先进行收运上报操作',
            icon: 'none'
        });
        return;
    }
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
    // @ts-ignore
    uni.scanCode({
        success: (res) => {
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

            // 扫描成功后添加一条新记录
            records.value.push({
                binCount: '',
                weight: '',
                images: [],
                isConfirmed: false, // 添加确认状态
                bucketCode: res.result // 添加桶编码
            });
            // 增加垃圾桶数量
            ljNum.value++;

            uni.showToast({
                title: '扫码成功',
                icon: 'success'
            });
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

const handleCancel = (index) => {
    // 弹出确认对话框
    uni.showModal({
        title: '确认删除',
        content: '是否确认删除当前数据？',
        success: (res) => {
            if (res.confirm) {
                // 用户点击确定，删除当前记录
                records.value.splice(index, 1);
                // 减少垃圾桶数量
                ljNum.value--;
            }
        }
    });
};

//验证
const handleConfirm = (index) => {
    const record = records.value[index];

    // 验证重量是否输入
    if (!record.weight || record.weight.trim() === '') {
        uni.showToast({
            title: '请输入垃圾重量',
            icon: 'none'
        });
        return;
    }

    // 验证是否至少上传了一张图片
    // 1. 检查数据是否存在
    if (record.images === undefined || record.images === null) {
        uni.showToast({
            title: '请至少上传1张图片',
            icon: 'none'
        });
        return;
    }

    // 2. 检查是否为数组
    if (!Array.isArray(record.images)) {
        uni.showToast({
            title: '请至少上传1张图片',
            icon: 'none'
        });
        return;
    }

    // 3. 检查数组是否为空
    if (record.images.length === 0) {
        uni.showToast({
            title: '请至少上传1张图片',
            icon: 'none'
        });
        return;
    }

    // 4. 检查是否有有效的文件
    const validFiles = record.images.filter((file) => {
        if (!file) {
            return false;
        }

        // 检查各种可能的文件格式
        const hasUrl = file.url && file.url.trim();
        const hasPath = file.path && file.path.trim();
        const hasResponse = file.response && file.response.url;
        const isString = typeof file === 'string' && file.trim();
        const hasFileId = file.fileID || file.id;
        const hasName = file.name;
        const hasSize = file.size;
        const hasTempFilePath = file.tempFilePath;
        const hasFile = file.file;

        const isValid = hasUrl || hasPath || hasResponse || isString || hasFileId || hasName || hasSize || hasTempFilePath || hasFile;
        return isValid;
    });

    if (validFiles.length === 0) {
        uni.showToast({
            title: '请至少上传1张图片',
            icon: 'none'
        });
        return;
    }

    // 检查文件数量限制
    if (validFiles.length > maxImageCount) {
        uni.showToast({
            title: `最多只能上传${maxImageCount}张图片`,
            icon: 'none'
        });
        return;
    }


    confirmReport(index);

};

//确认收运上报
const confirmReport = async (index) => {
    const record = records.value[index];
    // 从扫码结果中获取桶编码数据，如果没有则使用默认值
    const bucketCode = record.bucketCode || ('BC' + new Date().getTime());

    // 构造上报数据
    const reportData = {
        bucketCode: bucketCode, // 桶编码
        weight: parseFloat(record.weight), // 垃圾重量改为小数类型
        carId: carId.value, // 车辆ID
        driverId: driverId.value, // 司机ID
        merchantId: merchantId.value, // 商户ID
        planId: planId.value, // 收运单ID
        img: record.images.map(image => {
            console.log('处理图片数据:', image);
            console.log('图片URL:', image.url);
            console.log('图片路径:', image.path);
            console.log('图片响应:', image.response);

            // 根据不同情况获取图片URL
            if (image.url) {
                console.log('使用image.url:', image.url);
                return image.url;
            }
            if (image.path) {
                console.log('使用image.path:', image.path);
                return image.path;
            }
            if (image.response && image.response.url) {
                console.log('使用image.response.url:', image.response.url);
                return image.response.url;
            }
            if (typeof image === 'string') {
                console.log('使用字符串:', image);
                return image;
            }
            console.log('没有找到有效的URL');
            return '';
        }).filter(url => url !== '') // 过滤掉空的URL
    };

    // 将过滤后的URL用逗号连接
    reportData.img = reportData.img.join(',');

    console.log('最终上报的图片URLs:', reportData.img);
    console.log('完整上报数据:', reportData);

    try {
        const res = await apiPostreportWeight(reportData);
        if (res.code === 200) {
            uni.showToast({
                title: '上报成功',
                icon: 'success'
            });

            // 设置为已确认状态
            record.isConfirmed = true;
        } else {

            uni.showToast({
                title: res.msg || '上报失败',
                icon: 'none'
            });
        }
    } catch (error) {
        uni.showToast({
            title: '上报异常',
            icon: 'none'
        });
        console.error('上报异常:', error);
    }
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
    padding: 24rpx;
    background-color: #FFFFFF;
    margin: 20rpx;
    border-radius: 20rpx;

    .store-name {
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
        margin-bottom: 16rpx;
    }

    .bin-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        color: #666666;

        .scan-icon {
            cursor: pointer;
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
            padding: 120rpx 0;
            color: #999999;
            font-size: 34rpx;
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

                    .upload-tip {
                        font-size: 24rpx;
                        color: #999999;
                        line-height: 1.5;
                        margin-top: 16rpx;
                    }
                }
            }

            .button-group {
                position: relative;
                height: 48rpx;
                margin-top: 32rpx;

                .btn {
                    position: absolute;
                    right: 0;
                    width: 144rpx;
                    height: 48rpx;
                    line-height: 48rpx;
                    text-align: center;
                    border-radius: 100rpx;
                    font-size: 14px;

                    &.btn-cancel {
                        right: 164rpx;
                        /* 144rpx宽度 + 20rpx间距 */
                        background-color: #F5F5F5;
                        color: #666666;
                    }

                    &.btn-confirm {
                        right: 0;
                        background-color: #07C160;
                        color: #FFFFFF;
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
    background-color: #FFFFFF;
    padding: 24rpx;
    border-top: 1px solid #E5E5E5;
    z-index: 999;

    .btn-complete {
        width: 100%;
        height: 88rpx;
        background-color: #07C160;
        color: #FFFFFF;
        border: none;
        border-radius: 44rpx;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 88rpx;
        text-align: center;

        &:active {
            background-color: #06AD56;
        }
    }
}
</style>