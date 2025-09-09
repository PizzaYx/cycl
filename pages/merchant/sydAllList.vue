<!-- 收运总列表 -->
<template>
	<view class="delivery-record">
		<!-- 顶部搜索栏 -->
		<view class="search-bar">
			<uni-icons class="search-icon" type="search" size="16" color="#999"></uni-icons>
			<input class="search-input" type="text" placeholder="按单号/物品关键词" placeholder-class="placeholder" />
		</view>
		<!-- 筛选条件栏 -->
		<view class="filter-bar">
			<view class="filter-item">
				<text>状态</text>
				<uni-icons type="bottom" size="12" color="#666"></uni-icons>
			</view>
			<view class="filter-item">
				<text>时间</text>
				<uni-icons type="bottom" size="12" color="#666"></uni-icons>
			</view>
		</view>
		<!-- 订单列表 -->
		<scroll-view class="order-list" scroll-y>
			<view class="order-item" v-for="(item, index) in 3" :key="index">
				<view class="order-header">
					<view class="store-name">川味小厨（总店）</view>
					<view class="order-status">已完成</view>
				</view>
				<view class="order-info">
					<view class="info-row">
						<text class="label">今日收运</text>
						<text class="value">5桶</text>
					</view>
					<view class="info-row">
						<text class="label">收运重量</text>
						<text class="value">4.24KG</text>
					</view>
					<view class="info-row">
						<text class="label">车牌号</text>
						<text class="value">川A3D47M</text>
					</view>
					<view class="info-row">
						<text class="label">收运时间</text>
						<text class="value">2025-08-20 14:05:30</text>
					</view>
					<view class="divider"></view>
					<view class="info-row appointment-time">
						<text class="label">预约时间</text>
						<text class="value">2025-08-20 14:05:30</text>
					</view>
				</view>
				<view class="order-footer">
					<uni-button class="detail-btn" type="primary" size="mini">查看详情</uni-button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script lang="ts" setup>
	// 组件逻辑
</script>
<style>
	page {
		height: 100%;
		background-color: #f5f5f5;
	}

	.delivery-record {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.search-bar {
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		position: relative;
	}

	.search-icon {
		position: absolute;
		left: 50rpx;
		z-index: 1;
	}

	.search-input {
		flex: 1;
		height: 72rpx;
		background-color: #f5f5f5;
		border-radius: 36rpx;
		padding: 0 80rpx;
		font-size: 14px;
	}

	.placeholder {
		color: #999999;
	}

	.filter-bar {
		display: flex;
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		justify-content: center;
	}

	.filter-item {
		display: flex;
		align-items: center;
		margin: 0 40rpx;
	}

	.filter-item text {
		font-size: 14px;
		color: #333333;
		margin-right: 8rpx;
	}

	.order-list {
		flex: 1;
		overflow: auto;
		padding: 20rpx 30rpx;
	}

	.order-item {
		background-color: #ffffff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.store-name {
		font-size: 16px;
		color: #333333;
		font-weight: 500;
	}

	.order-status {
		font-size: 14px;
		color: #52c41a;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
	}

	.info-row:last-child {
		margin-bottom: 0;
	}

	.label {
		font-size: 14px;
		color: #666666;
	}

	.value {
		font-size: 14px;
		color: #333333;
	}

	.divider {
		height: 1px;
		background-color: #f0f0f0;
		margin: 20rpx 0;
	}

	.appointment-time {
		margin-top: 20rpx;
	}

	.order-footer {
		margin-top: 20rpx;
		display: flex;
		justify-content: flex-end;
	}

	.detail-btn {
		margin: 0 !important;
		background-color: #ffffff !important;
		border: 1px solid #52c41a !important;
		color: #52c41a !important;
	}
</style>