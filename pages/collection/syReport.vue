<!-- 收运上报 -->
<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运上报"
            @clickLeft="back" />
        <!-- 添加商店信息和扫码区域 -->
        <view class="store-info">
            <view class="store-name">商店名称</view>
            <view class="bin-info">
                <text>垃圾桶个数: {{ ljNum }}个</text>
                <uni-icons type="scan" size="24" color="#07C160" class="scan-icon" @click="handleScan" />
            </view>
        </view>
        <scroll-view class="content" scroll-y>
            <view class="record-list">
                <view v-for="(item, index) in records" :key="index" class="record-card">
                    <view class="input-group">
                        <view class="input-item">
                            <text class="label"><text class="required">*</text>垃圾桶数（个）</text>
                            <input type="number" 
                                v-model="item.binCount" 
                                class="input underline-input readonly"
                                disabled
                                placeholder="1" />
                        </view>
                        <view class="input-item">
                            <text class="label"><text class="required">*</text>厨余垃圾重量（kg）</text>
                            <input type="number" 
                                v-model="item.weight" 
                                class="input underline-input" 
                                :class="{ 'readonly-input': item.isConfirmed }"
                                :disabled="item.isConfirmed"
                                placeholder="请输入垃圾重量" />
                        </view>
                    </view>

                    <view class="upload-section">
                        <text class="label"><text class="required">*</text>厨余垃圾照片</text>
                        <view class="upload-area">
                            <uni-file-picker 
                                v-model="item.images" 
                                file-mediatype="image" 
                                :limit="maxImageCount"
                                :auto-upload="true" 
                                :upload-url="uploadUrl" 
                                :header="uploadHeaders" 
                                :disabled="item.isConfirmed"
                                :readonly="item.isConfirmed"
                                return-type="array"
                                @select="(e) => handleFileSelect(e, index)"
                                @success="(e) => handleFileSuccess(e, index)"
                                @fail="(e) => handleFileFail(e, index)">
                            </uni-file-picker>
                            <text class="upload-tip">最多可上传{{ maxImageCount }}张图片，每张图片不超过3M</text>
                        </view>
                    </view>

                    <view class="button-group">
                        <button v-if="!item.isConfirmed" class="btn btn-cancel" @click="handleCancel(index)">取消</button>
                        <button v-if="!item.isConfirmed" class="btn btn-confirm" @click="handleConfirm(index)">确认</button>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
// @ts-nocheck
import { ref } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期
import { uploadUrl, createUploadHeaders } from '@/utils/config.js';
import {apiPostreportWeight } from '@/api/apis.js'

// 返回上一页
const back = () => {
    // 返回前发送事件通知sfDetails页面刷新
    uni.$emit('refreshSfDetails');
    uni.navigateBack();
};

const ljNum = ref(1); // 垃圾桶数量
const maxImageCount = 3; // 最大上传图片数量
const maxImageSize = 3 * 1024 * 1024; // 每张图片最大大小 3M

// 新增接收页面参数的变量
const carId = ref(''); // 车辆ID
const driverId = ref(''); // 司机ID
const merchantId = ref(''); // 商户ID
const planId = ref(''); // 收运单ID

const uploadHeaders = createUploadHeaders()

const records = ref([
    {
        binCount: '',
        weight: '',
        images: [], // 改为数组存储多张图片
        isConfirmed: false // 添加确认状态
    }
]);

// 页面加载时获取传入的参数
onLoad((options) => {
    if (options.carId) carId.value = options.carId;
    if (options.driverId) driverId.value = options.driverId;
    if (options.merchantId) merchantId.value = options.merchantId;
    if (options.planId) planId.value = options.planId;
    console.log('接收到的参数:', options);
});

// 文件选择事件处理
const handleFileSelect = (event, index) => {
    // 手动更新对应记录的images数据
    if (event.tempFiles && event.tempFiles.length > 0) {
        // 将新文件添加到现有images数组中，而不是替换整个数组
        const newImages = [...(records.value[index].images || []), ...event.tempFiles];
        // 更新对应记录的images数据
        records.value[index].images = newImages;
    }
};

const handleFileSuccess = (event, index) => {
    console.log('文件上传成功', event);
};

const handleFileFail = (event, index) => {
    console.log('文件上传失败', event);
};

const handleScan = () => {
    // @ts-ignore
    uni.scanCode({
        success: (res) => {
            console.log('扫码结果', res);
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
        },
        fail: (err) => {
            console.log('扫码失败', err);
            // 即使扫描失败也添加一条新记录（模拟）
            records.value.push({
                binCount: '',
                weight: '',
                images: [],
                isConfirmed: false // 添加确认状态
            });
            // 增加垃圾桶数量
            ljNum.value++;
        }
    });
};

const handleCancel = (index) => {
    // 如果只有一条数据，不允许删除
    if (records.value.length <= 1) {
        uni.showToast({
            title: '至少保留一条数据',
            icon: 'none'
        });
        return;
    }

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
            // 根据不同情况获取图片URL
            if (image.url) return image.url;
            if (image.path) return image.path;
            if (image.response && image.response.url) return image.response.url;
            if (typeof image === 'string') return image;
            return '';
        }).filter(url => url !== '').join(',') // 过滤掉空的URL并用逗号连接
    };
    
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
                title: res.message || '上报失败',
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
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 16rpx;
    }

    .bin-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #666666;

        .scan-icon {
            cursor: pointer;
        }
    }
}

.content {
    flex: 1;
    overflow: auto;

    .record-list {
        padding: 24rpx;

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
                        font-size: 12px;
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
</style>