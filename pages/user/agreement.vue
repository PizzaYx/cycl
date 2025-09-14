<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="用户协议"
            @clickLeft="back" />
        <view class="agreement-content">
            <view class="title">用户服务协议</view>
            
            <view class="section">
                <view class="section-title">一、协议的确认和接纳</view>
                <view class="section-content">
                    <text>本协议是您与本应用之间的协议，具有合同效力。您确认本协议并接受全部条款后，方可使用本应用服务。</text>
                </view>
            </view>
            
            <view class="section">
                <view class="section-title">二、服务内容</view>
                <view class="section-content">
                    <text>本应用为用户提供垃圾分类相关信息和服务，具体以实际提供为准。</text>
                </view>
            </view>
            
            <view class="section">
                <view class="section-title">三、用户权限说明</view>
                <view class="section-content">
                    <view class="permission-item">
                        <text class="bold">1. 摄像头权限：</text>
                        <text>当您使用扫码功能时，我们需要访问您的摄像头权限以识别二维码信息。</text>
                    </view>
                    <view class="permission-item">
                        <text class="bold">2. 存储权限：</text>
                        <text>当您上传照片时，我们需要获取存储权限以访问您的相册或拍摄照片。</text>
                    </view>
                    <view class="section-desc">
                        <text>您可以在手机系统设置中随时关闭以上权限，但可能会影响您使用相关功能。</text>
                    </view>
                </view>
            </view>
            
            <view class="section">
                <view class="section-title">四、用户行为规范</view>
                <view class="section-content">
                    <text>您在使用本服务时，应当遵守相关法律法规，不得利用本服务从事违法违规行为。</text>
                </view>
            </view>
            
            <view class="section">
                <view class="section-title">五、账户安全</view>
                <view class="section-content">
                    <text>您应妥善保管账户信息和密码，并对账户下发生的所有活动承担责任。</text>
                </view>
            </view>
            
            <view class="section">
                <view class="section-title">六、知识产权</view>
                <view class="section-content">
                    <text>本应用所包含的全部信息（包括但不限于文字、图片、音频、视频等）均受相关知识产权法律法规保护。</text>
                </view>
            </view>
            
            <view class="section">
                <view class="section-title">七、免责声明</view>
                <view class="section-content">
                    <text>在法律允许的范围内，本应用对服务的及时性、安全性、准确性不做承诺。</text>
                </view>
            </view>
            
            <view class="section">
                <view class="section-title">八、协议修改</view>
                <view class="section-content">
                    <text>本应用有权在必要时修改本协议条款，修改后会在应用内公布。</text>
                </view>
            </view>
            
            <view class="section">
                <view class="section-title">九、其他</view>
                <view class="section-content">
                    <text>本协议的解释权归本应用所有。</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
// 返回上一页
const back = () => {
    uni.navigateBack()
}

</script>

<style lang="scss" scoped>
.container {
    background-color: #fff;
    min-height: 100vh;
}

.agreement-content {
    padding: 30rpx;
    
    .title {
        font-size: 36rpx;
        font-weight: bold;
        text-align: center;
        margin-bottom: 40rpx;
        color: $text-font-color-1;
    }
    
    .section {
        margin-bottom: 30rpx;
        
        .section-title {
            font-size: 30rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
            color: $text-font-color-1;
        }
        
        .section-content {
            font-size: 26rpx;
            color: $text-font-color-1;
            line-height: 42rpx;
            
            .permission-item {
                margin-bottom: 15rpx;
            }
            
            .bold {
                font-weight: bold;
            }
            
            .section-desc {
                margin-top: 15rpx;
                padding: 15rpx;
                background-color: #fff;
                border-radius: 10rpx;
            }
        }
    }
}
</style>