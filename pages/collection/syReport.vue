<!-- 收运记录 -->
<template>
    <view class="container">

        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运记录"
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
                            <input 
                                type="number" 
                                v-model="item.binCount" 
                                class="input underline-input" 
                                placeholder="请输入垃圾桶数量" 
                                :readonly="isInputReadOnly" />
                        </view>
                        <view class="input-item">
                            <text class="label"><text class="required">*</text>厨余垃圾重量（kg）</text>
                            <input 
                                type="number" 
                                v-model="item.weight" 
                                class="input underline-input" 
                                placeholder="请输入垃圾重量" 
                                :readonly="isInputReadOnly" />
                        </view>
                    </view>

                    <view class="upload-section">
                        <text class="label"><text class="required">*</text>厨余垃圾照片</text>
                        <view class="upload-area">
                            <uni-file-picker 
                                v-model="item.images" 
                                file-mediatype="image"
                                :limit="maxImageCount"
                                :readonly="isInputReadOnly"
                                @select="handleFileUpload">
                            </uni-file-picker>
                            <text class="upload-tip">最多可上传{{ maxImageCount }}张图片，每张图片不超过3M</text>
                        </view>
                    </view>

                    <view class="button-group">
                        <button class="btn btn-cancel" @click="handleCancel(index)">取消</button>
                        <button class="btn btn-confirm" @click="handleConfirm(index)">确认</button>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
// @ts-nocheck
import { ref } from 'vue';

const ljNum = ref(1); // 垃圾桶数量
const isInputReadOnly = ref(false); // 控制输入框是否只读
const maxImageCount = 3; // 最大上传图片数量
const maxImageSize = 3 * 1024 * 1024; // 每张图片最大大小 3M


const records = ref([
    {
        binCount: '',
        weight: '',
        images: [] // 改为数组存储多张图片
    }
]);

// 控制输入框只读状态的函数
const setInputReadOnly = (readOnly) => {
    isInputReadOnly.value = readOnly;
};

// 文件上传前的处理
const handleFileUpload = (event) => {
    // 检查事件对象和文件对象是否存在
    if (!event || !event.file) {
        console.warn('文件上传事件参数不完整:', event);
        return true; // 允许上传继续进行
    }
    
    const { file, index } = event;
    
    // 检查文件大小
    if (file.size && file.size > maxImageSize) {
        uni.showToast({
            title: '单张图片不能超过3M',
            icon: 'none'
            });
        return false;
    }
    
    return true;
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
                images: []
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
                images: []
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

const handleConfirm = (index) => {
    console.log('确认提交', records.value[index]);
};
</script>

<style lang="scss" scoped>
page {
    height: 100%;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #F5F5F5;
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
                        &[readonly] {
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
                        right: 164rpx; /* 144rpx宽度 + 20rpx间距 */
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