<template>
    <view class="container">
        <view class="header">
            <text class="title">收运上报</text>
            <view class="header-right">
                <uni-icons type="more-filled" size="24" color="#333333" />
            </view>
        </view>

        <scroll-view class="content" scroll-y>
            <view class="record-list">
                <view v-for="(item, index) in records" :key="index" class="record-card">
                    <view class="input-group">
                        <view class="input-item">
                            <text class="label"><text class="required">*</text>垃圾桶数（个）</text>
                            <input type="number" v-model="item.binCount" class="input" placeholder="请输入垃圾桶数量" />
                        </view>
                        <view class="input-item">
                            <text class="label"><text class="required">*</text>原余垃圾重量（kg）</text>
                            <input type="number" v-model="item.weight" class="input" placeholder="请输入垃圾重量" />
                        </view>
                    </view>

                    <view class="upload-section">
                        <text class="label"><text class="required">*</text>原余垃圾照片</text>
                        <view class="upload-area">
                            <view class="upload-box" @click="handleUpload(index)">
                                <uni-icons type="plusempty" size="32" color="#CCCCCC" />
                            </view>
                            <text class="upload-tip">上传视频请确保文件大小在20MB以内，支持mp4、avi、mov格式</text>
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

<script lang="ts" setup>
import { ref } from 'vue';

interface Record {
    binCount: string;
    weight: string;
    image: string;
}

const records = ref < Record[] > ([
    {
        binCount: '',
        weight: '',
        image: ''
    }
]);

const handleUpload = (index: number) => {
    uni.chooseMedia({
        count: 1,
        mediaType: ['video'],
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        success: (res) => {
            console.log(res);
        }
    });
};

const handleCancel = (index: number) => {
    records.value[index] = {
        binCount: '',
        weight: '',
        image: ''
    };
};

const handleConfirm = (index: number) => {
    console.log('确认提交', records.value[index]);
};
</script>

<style>
page {
    height: 100%;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #F5F5F5;
}

.header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #FFFFFF;
    flex-shrink: 0;
}

.title {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
}

.header-right {
    position: absolute;
    right: 32rpx;
    display: flex;
    align-items: center;
}

.content {
    flex: 1;
    overflow: auto;
}

.record-list {
    padding: 24rpx;
}

.record-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
}

.input-group {
    margin-bottom: 32rpx;
}

.input-item {
    margin-bottom: 24rpx;
}

.input-item:last-child {
    margin-bottom: 0;
}

.label {
    display: block;
    font-size: 14px;
    color: #333333;
    margin-bottom: 16rpx;
}

.required {
    color: #FF4D4F;
    margin-right: 8rpx;
}

.input {
    height: 88rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 24rpx;
    font-size: 14px;
}

.upload-section {
    margin-bottom: 32rpx;
}

.upload-area {
    margin-top: 16rpx;
}

.upload-box {
    width: 200rpx;
    height: 200rpx;
    background-color: #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
    margin-bottom: 16rpx;
}

.upload-tip {
    font-size: 12px;
    color: #999999;
    line-height: 1.5;
}

.button-group {
    display: flex;
    justify-content: space-between;
}

.btn {
    width: 320rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    border-radius: 8rpx;
    font-size: 14px;
}

.btn-cancel {
    background-color: #F5F5F5;
    color: #666666;
}

.btn-confirm {
    background-color: #07C160;
    color: #FFFFFF;
}
</style>
