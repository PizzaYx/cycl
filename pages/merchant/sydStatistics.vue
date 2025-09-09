<!-- 收运统计 -->
<template>
	<view class="page">
		<!-- 头部搜索区域 -->
		<view class="header">
			<view class="search-box">
				<uni-icons class="search-icon" type="search" size="16" color="#999999"></uni-icons>
				<input class="search-input" type="text" placeholder="搜索店铺/商品关键词" placeholder-class="placeholder" />
			</view>
			<view class="filter-box">
				<view class="filter-item">
					<text class="filter-text">状态</text>
					<uni-icons type="bottom" size="12" color="#999999"></uni-icons>
				</view>
				<view class="filter-item">
					<text class="filter-text">时间</text>
					<uni-icons type="bottom" size="12" color="#999999"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 统计数据区域 -->
		<view class="statistics">
			<view class="stat-item">
				<view class="stat-icon bucket">
					<uni-icons type="shop" size="24" color="#FF9500"></uni-icons>
				</view>
				<view class="stat-content">
					<text class="stat-num">6</text>
					<text class="stat-label">应取桶数</text>
				</view>
			</view>
			<view class="stat-item">
				<view class="stat-icon weight">
					<uni-icons type="gift" size="24" color="#007AFF"></uni-icons>
				</view>
				<view class="stat-content">
					<text class="stat-num">2345</text>
					<text class="stat-label">总重量</text>
				</view>
			</view>
		</view>
		<!-- 订单列表区域 -->
		<scroll-view class="order-list" scroll-y>
			<view class="order-item" v-for="(item, index) in orderList" :key="index">
				<view class="order-header">
					<text class="order-time">{{item.time}}</text>
					<text class="order-status">{{item.status}}</text>
				</view>
				<view class="order-content">
					<view class="info-row">
						<text class="info-label">商品名称：</text>
						<text class="info-value">{{item.name}}</text>
					</view>
					<view class="info-row">
						<text class="info-label">桶 数：</text>
						<text class="info-value">{{item.quantity}}个</text>
					</view>
					<view class="info-row">
						<text class="info-label">重 量：</text>
						<text class="info-value">{{item.weight}}kg</text>
					</view>
				</view>
				<view class="order-footer">
					<uni-button class="detail-btn" size="mini" type="primary">查看详情</uni-button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script lang="ts" setup>
	import { ref } from 'vue';
	const orderList = ref([
		{
			time: '2025-08-13 14:30',
			status: '已完成',
			name: '二硫香菜',
			quantity: 3,
			weight: '2.5'
		},
		{
			time: '2025-08-13 14:30',
			status: '已完成',
			name: '二硫香菜',
			quantity: 3,
			weight: '1.3'
		},
		{
			time: '2025-08-13 14:30',
			status: '已完成',
			name: '二硫香菜',
			quantity: 3,
			weight: '2.4'
		}
	]);
</script>
<style>
	page {
		height: 100%;
		background-color: #F5F5F5;
	}

	.page {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.header {
		background-color: #FFFFFF;
		padding: 32rpx 40rpx;
	}

	.search-box {
		display: flex;
		align-items: center;
		background-color: #F5F5F5;
		border-radius: 36rpx;
		padding: 20rpx 32rpx;
		margin-bottom: 32rpx;
	}

	.search-icon {
		margin-right: 16rpx;
	}

	.search-input {
		flex: 1;
		font-size: 14px;
		height: 36rpx;
		line-height: 36rpx;
	}

	.placeholder {
		color: #999999;
	}

	.filter-box {
		display: flex;
		justify-content: flex-start;
	}

	.filter-item {
		display: flex;
		align-items: center;
		margin-right: 48rpx;
		padding: 8rpx 0;
	}

	.filter-text {
		font-size: 14px;
		color: #333333;
		margin-right: 12rpx;
	}

	.statistics {
		display: flex;
		padding: 40rpx;
		background-color: #FFFFFF;
		margin-top: 24rpx;
	}

	.stat-item {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.stat-icon {
		width: 88rpx;
		height: 88rpx;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 24rpx;
	}

	.bucket {
		background-color: rgba(255, 149, 0, 0.1);
	}

	.weight {
		background-color: rgba(0, 122, 255, 0.1);
	}

	.stat-content {
		display: flex;
		flex-direction: column;
	}

	.stat-num {
		font-size: 24px;
		color: #333333;
		font-weight: 500;
	}

	.stat-label {
		font-size: 12px;
		color: #999999;
		margin-top: 4rpx;
	}

	.order-list {
		flex: 1;
		overflow: auto;
		padding: 24rpx 40rpx;
	}

	.order-item {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.order-time {
		font-size: 14px;
		color: #666666;
	}

	.order-status {
		font-size: 14px;
		color: #999999;
	}

	.order-content {
		border-bottom: 1px solid #EEEEEE;
		padding-bottom: 32rpx;
	}

	.info-row {
		display: flex;
		margin-bottom: 24rpx;
	}

	.info-row:last-child {
		margin-bottom: 0;
	}

	.info-label {
		width: 160rpx;
		font-size: 14px;
		color: #666666;
	}

	.info-value {
		flex: 1;
		font-size: 14px;
		color: #333333;
	}

	.order-footer {
		padding-top: 32rpx;
		display: flex;
		justify-content: flex-end;
	}

	.detail-btn {
		background-color: #07C160 !important;
		border-color: #07C160 !important;
		padding: 0 32rpx !important;
	}
</style>