<template>
	<view class="container">
		
		<view class="content">
			<view class="avatar-section">
				<image class="avatar" :src="avatarUrl" mode="aspectFill" />
				<text class="avatar-text">货换头像</text>
			</view>

			<view class="info-section">
				<text class="section-title">基本信息</text>

				<view class="info-item">
					<text class="label">名字</text>
					<text class="value">李师傅</text>
				</view>

				<view class="info-item">
					<text class="label">车牌号码</text>
					<view class="value-container">
						<text class="value">川A3D47M</text>
						<uni-icons class="arrow-right" type="right" size="16" color="#999999" />
					</view>
				</view>

				<view class="info-item">
					<text class="label">联系电话</text>
					<text class="value">13546781879</text>
				</view>
			</view>
		</view>

		<view class="footer">
			<button class="save-btn" type="primary">保存</button>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';

	const avatarUrl = ref('https://ai-public.mastergo.com/ai/img_res/ad260cc6ead8d4815bc8d1dd5beae8f9.jpg');
</script>

<style>
	page {
		height: 100%;
		background-color: #f5f5f5;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.header {
		flex-shrink: 0;
		background-color: #ffffff;
	}

	.nav-bar {
		display: flex;
		align-items: center;
		padding: 0 32rpx;
		height: 88rpx;
	}

	.back-icon {
		width: 44rpx;
		height: 44rpx;
	}

	.title {
		flex: 1;
		text-align: center;
		font-size: 17px;
		font-weight: 500;
		color: #333333;
	}

	.right-icons {
		display: flex;
		gap: 20rpx;
	}

	.more-icon,
	.circle-icon {
		width: 44rpx;
		height: 44rpx;
	}

	.content {
		flex: 1;
		overflow: auto;
	}

	.avatar-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx 0;
		background-color: #ffffff;
	}

	.avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 80rpx;
		margin-bottom: 16rpx;
	}

	.avatar-text {
		font-size: 14px;
		color: #999999;
	}

	.info-section {
		margin-top: 20rpx;
		background-color: #ffffff;
		padding: 0 32rpx;
	}

	.section-title {
		font-size: 14px;
		color: #333333;
		padding: 24rpx 0;
		display: block;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.info-item:last-child {
		border-bottom: none;
	}

	.label {
		font-size: 16px;
		color: #333333;
	}

	.value-container {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.value {
		font-size: 16px;
		color: #666666;
	}

	.arrow-right {
		width: 32rpx;
		height: 32rpx;
	}

	.footer {
		flex-shrink: 0;
		padding: 40rpx 32rpx;
		background-color: #ffffff;
	}

	.save-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #07c160;
		color: #ffffff;
		font-size: 16px;
		border-radius: 8rpx;
	}

	.save-btn::after {
		border: none;
	}
</style>